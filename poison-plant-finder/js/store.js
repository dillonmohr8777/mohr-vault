/* ============================================================================
   POISON PLANT FINDER — data layer (Store)
   One async API for accounts + saved data, with two interchangeable backends:
     • Cloud  — Supabase auth + Postgres (when config.js has URL + anon key)
     • Guest  — localStorage on this device (works with zero setup)
   Pages never talk to a backend directly; they call Store.* and get Promises.
   ============================================================================ */
const Store = (() => {
  const cfg = window.PPF_CONFIG || {};
  const hasCloud = !!(cfg.SUPABASE_URL && cfg.SUPABASE_ANON_KEY && window.supabase);
  let sb = null;
  if (hasCloud) {
    sb = window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY);
  }

  /* ---- auth state + simple event bus ----------------------------------- */
  const listeners = new Set();
  let user = null; // { id, email, name }
  let initPromise = null;
  function emit() { listeners.forEach(fn => { try { fn(user); } catch (e) {} }); }

  /* ===================== GUEST (localStorage) backend ==================== */
  const LS = {
    key: (k) => `ppf_guest_${k}`,
    read: (k, def) => { try { return JSON.parse(localStorage.getItem(LS.key(k))) ?? def; } catch { return def; } },
    write: (k, v) => localStorage.setItem(LS.key(k), JSON.stringify(v)),
  };

  const guest = {
    profile() {
      let p = LS.read("profile", null);
      if (!p) { p = { id: "guest", email: "", name: "Guest" }; LS.write("profile", p); }
      return p;
    },
    setName(name) { const p = guest.profile(); p.name = name; LS.write("profile", p); user = p; emit(); },
    favorites: {
      async list() { return LS.read("favorites", []); },
      async add(id) { const f = LS.read("favorites", []); if (!f.includes(id)) { f.push(id); LS.write("favorites", f); } },
      async remove(id) { LS.write("favorites", LS.read("favorites", []).filter(x => x !== id)); },
    },
    notes: {
      async get(id) { return (LS.read("notes", {})[id]) || ""; },
      async set(id, body) { const n = LS.read("notes", {}); if (body) n[id] = body; else delete n[id]; LS.write("notes", n); },
      async all() { return LS.read("notes", {}); },
    },
    collections: {
      async list() { return LS.read("collections", []); },
      async create(name) { const c = LS.read("collections", []); const item = { id: "c" + Date.now(), name, items: [] }; c.push(item); LS.write("collections", c); return item; },
      async rename(id, name) { const c = LS.read("collections", []); const x = c.find(i => i.id === id); if (x) { x.name = name; LS.write("collections", c); } },
      async remove(id) { LS.write("collections", LS.read("collections", []).filter(i => i.id !== id)); },
      async addItem(id, plantId) { const c = LS.read("collections", []); const x = c.find(i => i.id === id); if (x && !x.items.includes(plantId)) { x.items.push(plantId); LS.write("collections", c); } },
      async removeItem(id, plantId) { const c = LS.read("collections", []); const x = c.find(i => i.id === id); if (x) { x.items = x.items.filter(p => p !== plantId); LS.write("collections", c); } },
    },
    sightings: {
      async list() { return LS.read("sightings", []).sort((a, b) => (b.seen_on || "").localeCompare(a.seen_on || "")); },
      async add(s) { const arr = LS.read("sightings", []); const item = { id: "s" + Date.now(), ...s }; arr.push(item); LS.write("sightings", arr); return item; },
      async remove(id) { LS.write("sightings", LS.read("sightings", []).filter(s => s.id !== id)); },
    },
  };

  /* ===================== CLOUD (Supabase) backend ======================= */
  const cloud = {
    favorites: {
      async list() { const { data } = await sb.from("favorites").select("plant_id"); return (data || []).map(r => r.plant_id); },
      async add(id) { await sb.from("favorites").upsert({ user_id: user.id, plant_id: id }); },
      async remove(id) { await sb.from("favorites").delete().eq("plant_id", id); },
    },
    notes: {
      async get(id) { const { data } = await sb.from("notes").select("body").eq("plant_id", id).maybeSingle(); return data?.body || ""; },
      async set(id, body) {
        if (body) await sb.from("notes").upsert({ user_id: user.id, plant_id: id, body, updated_at: new Date().toISOString() });
        else await sb.from("notes").delete().eq("plant_id", id);
      },
      async all() { const { data } = await sb.from("notes").select("plant_id, body"); const o = {}; (data || []).forEach(r => o[r.plant_id] = r.body); return o; },
    },
    collections: {
      async list() {
        const { data } = await sb.from("collections").select("id, name, collection_items(plant_id)").order("created_at");
        return (data || []).map(c => ({ id: c.id, name: c.name, items: (c.collection_items || []).map(i => i.plant_id) }));
      },
      async create(name) { const { data } = await sb.from("collections").insert({ user_id: user.id, name }).select().single(); return { id: data.id, name: data.name, items: [] }; },
      async rename(id, name) { await sb.from("collections").update({ name }).eq("id", id); },
      async remove(id) { await sb.from("collections").delete().eq("id", id); },
      async addItem(id, plantId) { await sb.from("collection_items").upsert({ collection_id: id, plant_id: plantId }); },
      async removeItem(id, plantId) { await sb.from("collection_items").delete().eq("collection_id", id).eq("plant_id", plantId); },
    },
    sightings: {
      async list() { const { data } = await sb.from("sightings").select("*").order("seen_on", { ascending: false }); return data || []; },
      async add(s) { const { data } = await sb.from("sightings").insert({ user_id: user.id, ...s }).select().single(); return data; },
      async remove(id) { await sb.from("sightings").delete().eq("id", id); },
    },
  };

  const backend = hasCloud ? cloud : guest;

  /* ===================== public API ===================================== */
  return {
    isCloud: () => hasCloud,
    user: () => user,
    onChange(fn) { listeners.add(fn); return () => listeners.delete(fn); },

    init() {
      if (initPromise) return initPromise;
      initPromise = (async () => {
        if (hasCloud) {
          const { data } = await sb.auth.getSession();
          applySession(data.session);
          sb.auth.onAuthStateChange((_e, session) => applySession(session));
        } else {
          user = guest.profile(); emit();
        }
        return user;
      })();
      return initPromise;
    },

    auth: {
      async signUp(email, password, name) {
        if (!hasCloud) { guest.setName(name || email || "Guest"); return { ok: true, guest: true }; }
        const { data, error } = await sb.auth.signUp({ email, password, options: { data: { name } } });
        if (error) throw error;
        return { ok: true, needsConfirm: !data.session };
      },
      async signIn(email, password) {
        if (!hasCloud) { guest.setName(email || "Guest"); return { ok: true, guest: true }; }
        const { error } = await sb.auth.signInWithPassword({ email, password });
        if (error) throw error;
        return { ok: true };
      },
      async signOut() {
        if (hasCloud) await sb.auth.signOut();
        else { user = guest.profile(); emit(); }
      },
    },

    favorites: backend.favorites,
    notes: backend.notes,
    collections: backend.collections,
    sightings: backend.sightings,
  };

  function applySession(session) {
    if (session?.user) {
      const u = session.user;
      user = { id: u.id, email: u.email, name: u.user_metadata?.name || u.email };
    } else {
      user = null;
    }
    emit();
  }
})();

window.Store = Store;
