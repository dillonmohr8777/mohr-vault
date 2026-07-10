/* ============================================================================
   POISON PLANT FINDER — single-file SPA runtime
   Ports every page into one hash-routed app. Depends on globals defined by the
   inlined config.js / data.js / store.js (PPF_CONFIG, PLANTS, VOCAB, SEVERITY,
   Store). Chrome + account UI mount once; only #app swaps between views.
   ============================================================================ */
(function () {
  "use strict";
  const PC_PHONE = "1-800-222-1222";
  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const byId = () => Object.fromEntries((window.PLANTS || []).map(p => [p.id, p]));
  const esc = (s) => (s || "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const debounce = (fn, ms) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };
  const plantHref = (id) => `#/plant/${id}`;
  function severityOf(p) { return (window.SEVERITY || {})[p.severity] || { label: "—", tag: "" }; }
  function sevBadge(p) { return `<span class="badge-sev sev-${p.severity}">${p.severity} · ${severityOf(p).label}</span>`; }
  function invasiveBadge(p) { return `<span class="badge-invasive">${p.invasive.status}</span>`; }
  function contactBadge(p) { return p.contactHazard ? `<span class="badge-contact">⚠ harmful to touch</span>` : ""; }

  /* ---- procedural botanical plate (verbatim engine) ------------------- */
  function seedFrom(str) { let h = 2166136261; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function rng(seed) { let s = seed || 1; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
  const FLOWER_HEX = { "White": "#F3EEE0", "Yellow": "#D9B53C", "Pink / Purple": "#9C6CA0", "Red / Orange": "#B5562A", "Green / none": "#7E8B5E" };
  function drawPlate(canvas, plant) {
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    const W = Math.max(rect.width, 240), H = Math.max(rect.height, W * 1.25);
    canvas.width = W * dpr; canvas.height = H * dpr; ctx.scale(dpr, dpr);
    const r = rng(seedFrom(plant.id)), INK = "#2C4131", INK2 = "#6E5438", LEAFFILL = "#CBD3B0";
    ctx.fillStyle = "#FAF6EC"; ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = "rgba(110,84,56,.07)"; ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 22) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y < H; y += 22) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
    const cx = W / 2, cy = H / 2;
    const flowerHex = FLOWER_HEX[(plant.traits.flowerColor || [])[0]] || "#7E8B5E";
    const kind = plant.traits.veins;
    ctx.save(); ctx.translate(cx, cy); ctx.rotate((r() - 0.5) * 0.25);
    if (kind === "Needle / scale") drawConifer(ctx, W, H, r, INK, LEAFFILL, flowerHex);
    else if (kind === "Palmate (hand)") drawPalmate(ctx, W, H, r, INK, INK2, LEAFFILL, flowerHex);
    else if (kind === "Parallel") drawStrap(ctx, W, H, r, INK, INK2, LEAFFILL, flowerHex);
    else drawPinnate(ctx, W, H, r, INK, INK2, LEAFFILL, flowerHex);
    ctx.restore();
    ctx.font = "10px 'IBM Plex Mono', monospace"; ctx.fillStyle = "rgba(81,96,74,.7)";
    ctx.fillText("No. " + (seedFrom(plant.id) % 900 + 100), 12, 20);
  }
  function leafBlade(ctx, len, wid, fill, ink) {
    ctx.beginPath(); ctx.moveTo(0, -len / 2);
    ctx.quadraticCurveTo(wid, -len * 0.15, wid * 0.2, len / 2);
    ctx.quadraticCurveTo(-wid * 0.2, len * 0.62, -wid * 0.2, len / 2);
    ctx.quadraticCurveTo(-wid, -len * 0.15, 0, -len / 2);
    ctx.closePath(); ctx.fillStyle = fill; ctx.fill(); ctx.lineWidth = 1.6; ctx.strokeStyle = ink; ctx.stroke();
  }
  function drawPinnate(ctx, W, H, r, ink, ink2, fill, flowerHex) {
    const len = H * 0.62, wid = W * 0.22; leafBlade(ctx, len, wid, fill, ink);
    ctx.lineWidth = 1.6; ctx.strokeStyle = ink;
    ctx.beginPath(); ctx.moveTo(0, -len / 2 + 4); ctx.lineTo(0, len / 2 - 4); ctx.stroke();
    ctx.lineWidth = 1; ctx.strokeStyle = "rgba(44,65,49,.6)"; const n = 7;
    for (let i = 1; i < n; i++) {
      const t = i / n, y = -len / 2 + len * t, reach = wid * (0.85 - Math.abs(t - 0.45));
      ctx.beginPath(); ctx.moveTo(0, y); ctx.quadraticCurveTo(reach * 0.6, y - 6, reach, y - 12); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, y); ctx.quadraticCurveTo(-reach * 0.6, y - 6, -reach, y - 12); ctx.stroke();
    }
    drawFlowerCluster(ctx, wid * 1.05, -len * 0.28, flowerHex, ink2, r);
  }
  function drawPalmate(ctx, W, H, r, ink, ink2, fill, flowerHex) {
    const R = Math.min(W, H) * 0.34, lobes = 5; ctx.save(); ctx.beginPath();
    for (let i = 0; i <= lobes * 2; i++) {
      const a = (Math.PI * 2 * i) / (lobes * 2) - Math.PI / 2, rad = (i % 2 === 0) ? R : R * 0.45;
      const x = Math.cos(a) * rad, y = Math.sin(a) * rad * 1.05;
      i === 0 ? ctx.moveTo(x, y) : ctx.quadraticCurveTo(Math.cos(a) * rad * 1.05, Math.sin(a) * rad * 1.05, x, y);
    }
    ctx.closePath(); ctx.fillStyle = fill; ctx.fill(); ctx.lineWidth = 1.6; ctx.strokeStyle = ink; ctx.stroke();
    ctx.lineWidth = 1.1; ctx.strokeStyle = "rgba(44,65,49,.6)";
    for (let i = 0; i < lobes; i++) { const a = (Math.PI * 2 * i) / lobes - Math.PI / 2; ctx.beginPath(); ctx.moveTo(0, R * 0.15); ctx.lineTo(Math.cos(a) * R * 0.92, Math.sin(a) * R * 0.92); ctx.stroke(); }
    ctx.lineWidth = 2; ctx.strokeStyle = ink2; ctx.beginPath(); ctx.moveTo(0, R * 0.15); ctx.lineTo(0, R * 1.25); ctx.stroke();
    ctx.restore(); drawFlowerCluster(ctx, R * 0.8, -R * 0.9, flowerHex, ink2, r);
  }
  function drawStrap(ctx, W, H, r, ink, ink2, fill, flowerHex) {
    const len = H * 0.66, wid = W * 0.12;
    for (let k = -1; k <= 1; k += 2) {
      ctx.save(); ctx.translate(k * wid * 1.2, 0); ctx.rotate(k * 0.12); ctx.beginPath(); ctx.moveTo(0, -len / 2);
      ctx.quadraticCurveTo(wid, 0, 0, len / 2); ctx.quadraticCurveTo(-wid, 0, 0, -len / 2); ctx.closePath();
      ctx.fillStyle = fill; ctx.fill(); ctx.lineWidth = 1.5; ctx.strokeStyle = ink; ctx.stroke();
      ctx.lineWidth = .9; ctx.strokeStyle = "rgba(44,65,49,.55)";
      for (let i = -2; i <= 2; i++) { ctx.beginPath(); ctx.moveTo(i * wid * 0.28, -len / 2 + 12); ctx.lineTo(i * wid * 0.28, len / 2 - 12); ctx.stroke(); }
      ctx.restore();
    }
    drawFlowerCluster(ctx, 0, -len * 0.5 - 6, flowerHex, ink2, r);
  }
  function drawConifer(ctx, W, H, r, ink, fill, flowerHex) {
    const len = H * 0.6; ctx.lineWidth = 2.2; ctx.strokeStyle = "#6E5438";
    ctx.beginPath(); ctx.moveTo(0, -len / 2); ctx.lineTo(0, len / 2); ctx.stroke();
    ctx.lineWidth = 1.4; ctx.strokeStyle = ink; const n = 16;
    for (let i = 0; i < n; i++) { const y = -len / 2 + len * (i / n) + 6, l = 20 + 8 * Math.sin(i);
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(l, y + 8); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(-l, y + 8); ctx.stroke(); }
    ctx.fillStyle = flowerHex; ctx.beginPath(); ctx.arc(10, len * 0.18, 7, 0, Math.PI * 2); ctx.fill();
  }
  function drawFlowerCluster(ctx, x, y, hex, ink2, r) {
    ctx.lineWidth = 1.4; ctx.strokeStyle = ink2; ctx.beginPath(); ctx.moveTo(x * 0.2, y + 30); ctx.quadraticCurveTo(x * 0.7, y + 10, x, y); ctx.stroke();
    for (let i = 0; i < 5; i++) { const px = x + Math.cos(i * 1.3) * 10, py = y + Math.sin(i * 1.7) * 9 - i * 2;
      ctx.fillStyle = hex; ctx.beginPath(); ctx.arc(px, py, 5 + (r() * 2), 0, Math.PI * 2); ctx.fill();
      ctx.lineWidth = .8; ctx.strokeStyle = "rgba(44,65,49,.4)"; ctx.stroke(); }
  }
  function renderPlates(root = document) {
    const map = byId(); $$("canvas[data-plant]", root).forEach(c => { const p = map[c.dataset.plant]; if (p) drawPlate(c, p); });
  }
  function initReveal(root = document) {
    const els = $$(".reveal", root);
    if (!els.length || !("IntersectionObserver" in window)) { els.forEach(e => e.classList.add("in")); return; }
    const io = new IntersectionObserver((es) => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .12 });
    els.forEach(e => io.observe(e));
  }
  function cardHTML(p) {
    return `<a class="card reveal" href="${plantHref(p.id)}">
      <div class="card__plate"><canvas data-plant="${p.id}"></canvas><span class="card__sev">${sevBadge(p)}</span></div>
      <div class="card__body"><span class="card__common">${p.common}</span>
        <span class="card__sci">${p.scientific}</span>
        <div class="card__meta">${invasiveBadge(p)}${contactBadge(p)}</div></div></a>`;
  }

  /* ====================================================================== */
  /*  CHROME (header / footer / account menu / modal) — mounted once        */
  /* ====================================================================== */
  const LEAF_MARK = `<svg class="mark" viewBox="0 0 32 32" aria-hidden="true">
    <path d="M16 2C9 7 4 13 4 21c0 5 4 9 9 9 9 0 15-9 15-19 0-3-1-6-2-9-4 3-7 4-10 4z" fill="#3F5E45"/>
    <path d="M16 6c-2 6-3 14-3 22" fill="none" stroke="#E2DAC4" stroke-width="1.4" stroke-linecap="round"/>
    <path d="M13 16c2-1 4-2 7-2M13 22c2-1 3-2 6-3" fill="none" stroke="#E2DAC4" stroke-width="1.1" stroke-linecap="round"/></svg>`;
  const NAV = [["#/", "Home"], ["#/identify", "Photo ID"], ["#/wizard", "ID wizard"], ["#/filter", "By traits"], ["#/catalog", "All plants"]];

  function injectChrome() {
    const header = document.createElement("div");
    header.innerHTML = `
      <div class="pc-banner">Plant emergency? In the US call <strong>Poison Control ${PC_PHONE}</strong> ·
        life-threatening symptoms → call <strong>911</strong></div>
      <header class="site-header"><div class="wrap">
        <a class="brand" href="#/">${LEAF_MARK}<span>Poison&nbsp;Plant&nbsp;Finder</span></a>
        <button class="nav-toggle" aria-label="Menu" aria-expanded="false">Menu</button>
        <nav class="nav">${NAV.map(([h, l]) => `<a href="${h}" data-nav="${h}">${l}</a>`).join("")}</nav>
        <div class="acct" id="acctSlot"></div>
      </div></header>`;
    document.body.prepend(header);
    const toggle = $(".nav-toggle");
    toggle.addEventListener("click", () => { const open = $(".nav").classList.toggle("open"); toggle.setAttribute("aria-expanded", String(open)); });

    const footer = document.createElement("div");
    footer.innerHTML = `
      <section class="disclaimer"><div class="wrap"><strong>Educational use only — not medical advice.</strong>
        Plant identification is hard and look-alikes are common, so never rely on this site to decide whether
        something is safe to touch, eat, or feed to an animal. If exposure is possible, contact Poison Control
        (US ${PC_PHONE}), a doctor, or a vet. When unsure, treat an unknown plant as dangerous and don't touch it.</div></section>
      <footer class="site-footer"><div class="wrap">
        <span>Poison Plant Finder — a free field guide to dangerous plants.</span>
        <span class="mono">Poison Control (US): ${PC_PHONE} · Emergency: 911</span></div></footer>`;
    document.body.append(footer);
  }

  /* ---- account menu + auth modal (hash-aware port of auth-ui.js) ------- */
  let acctSlot;
  const initials = (n) => (n || "?").trim().slice(0, 1).toUpperCase();
  function renderAccount(user) {
    if (!acctSlot) return;
    if (user && Store.isCloud()) {
      acctSlot.innerHTML = `<div class="acct-menu">
        <button class="acct-btn" id="acctBtn" aria-haspopup="true" aria-expanded="false"><span class="avatar">${initials(user.name)}</span><span class="acct-name">${esc(user.name || user.email)}</span></button>
        <div class="acct-pop" id="acctPop" hidden>
          <a href="#/account">Your dashboard</a><a href="#/collections">Collections</a><a href="#/sightings">Sightings</a>
          <button id="signOutBtn">Sign out</button></div></div>`;
      $("#acctBtn").addEventListener("click", togglePop);
      $("#signOutBtn").addEventListener("click", () => Store.auth.signOut());
    } else if (!Store.isCloud()) {
      acctSlot.innerHTML = `<div class="acct-menu">
        <button class="acct-btn" id="acctBtn" aria-haspopup="true" aria-expanded="false"><span class="avatar guest">${initials(user && user.name)}</span><span class="acct-name">${esc((user && user.name) || "Guest")}</span></button>
        <div class="acct-pop" id="acctPop" hidden>
          <span class="acct-pop__label">Guest — saved on this device</span>
          <a href="#/account">Your dashboard</a><a href="#/collections">Collections</a><a href="#/sightings">Sightings</a>
          <button id="setNameBtn">Set display name</button></div></div>`;
      $("#acctBtn").addEventListener("click", togglePop);
      $("#setNameBtn").addEventListener("click", () => openModal("guest"));
    } else {
      acctSlot.innerHTML = `<button class="btn btn--ghost acct-signin" id="signInBtn">Sign in</button>`;
      $("#signInBtn").addEventListener("click", () => openModal("signin"));
    }
  }
  function togglePop() { const pop = $("#acctPop"), btn = $("#acctBtn"); const open = pop.hasAttribute("hidden"); pop.toggleAttribute("hidden", !open); btn.setAttribute("aria-expanded", String(open)); }
  document.addEventListener("click", (e) => { const pop = document.getElementById("acctPop"); if (pop && !pop.hasAttribute("hidden") && !e.target.closest(".acct-menu")) { pop.setAttribute("hidden", ""); document.getElementById("acctBtn")?.setAttribute("aria-expanded", "false"); } });

  function openModal(mode) {
    closeModal();
    const cloud = Store.isCloud();
    const wrap = document.createElement("div"); wrap.className = "modal"; wrap.id = "authModal";
    wrap.innerHTML = `<div class="modal__card" role="dialog" aria-modal="true" aria-labelledby="authTitle">
      <button class="modal__close" aria-label="Close" id="mClose">×</button>${cloud ? cloudForm() : guestForm()}</div>`;
    document.body.appendChild(wrap);
    wrap.addEventListener("click", (e) => { if (e.target === wrap) closeModal(); });
    $("#mClose").addEventListener("click", closeModal);
    document.addEventListener("keydown", escClose);
    if (cloud) {
      $$("#authModal [data-tab]").forEach(t => t.addEventListener("click", () => switchTab(t.dataset.tab)));
      $("#authForm").addEventListener("submit", submitCloud);
      switchTab(mode === "signup" ? "signup" : "signin");
    } else { $("#guestForm").addEventListener("submit", submitGuest); setTimeout(() => $("#gName")?.focus(), 30); }
  }
  function escClose(e) { if (e.key === "Escape") closeModal(); }
  function closeModal() { const m = document.getElementById("authModal"); if (m) m.remove(); document.removeEventListener("keydown", escClose); }
  function cloudForm() {
    return `<span class="eyebrow">Your field notebook</span><h2 id="authTitle" style="margin:.4rem 0 1rem">Welcome back</h2>
      <div class="tabs"><button data-tab="signin" class="tab">Sign in</button><button data-tab="signup" class="tab">Create account</button></div>
      <form id="authForm" class="stack" style="margin-top:1rem">
        <label class="field-label" id="nameRow" hidden>Name<input class="field field--block" type="text" id="aName" autocomplete="name" placeholder="What should we call you?" /></label>
        <label class="field-label">Email<input class="field field--block" type="email" id="aEmail" autocomplete="email" required placeholder="you@example.com" /></label>
        <label class="field-label">Password<input class="field field--block" type="password" id="aPass" autocomplete="current-password" required minlength="6" placeholder="At least 6 characters" /></label>
        <p class="auth-error" id="authError" hidden></p>
        <button class="btn btn--block" type="submit" id="authSubmit">Sign in</button></form>
      <p class="note" style="margin-top:.8rem">Your saved plants, notes, lists and sightings sync to every device you sign in on.</p>`;
  }
  function guestForm() {
    const u = Store.user();
    return `<span class="eyebrow">Guest mode</span><h2 id="authTitle" style="margin:.4rem 0 .6rem">Saved on this device</h2>
      <p class="note">You're using Poison Plant Finder as a guest — your favorites, notes, lists and sightings are saved in <b>this browser only</b>. Pick a display name to personalize it.</p>
      <form id="guestForm" class="stack" style="margin-top:1rem">
        <label class="field-label">Display name<input class="field field--block" type="text" id="gName" placeholder="e.g. Dillon" value="${(u?.name && u.name !== "Guest") ? esc(u.name) : ""}" /></label>
        <button class="btn btn--block" type="submit">Save</button></form>
      <p class="note" style="margin-top:1rem">Want it to sync to your phone and other computers? Add a free Supabase key in <code>config</code> to turn on real accounts — see the dashboard.</p>`;
  }
  function switchTab(tab) {
    $$("#authModal .tab").forEach(t => t.classList.toggle("active", t.dataset.tab === tab));
    const signup = tab === "signup";
    $("#nameRow").toggleAttribute("hidden", !signup);
    $("#authTitle").textContent = signup ? "Create your account" : "Welcome back";
    $("#authSubmit").textContent = signup ? "Create account" : "Sign in";
    $("#aPass").setAttribute("autocomplete", signup ? "new-password" : "current-password");
    $("#authForm").dataset.mode = tab;
  }
  async function submitCloud(e) {
    e.preventDefault();
    const mode = $("#authForm").dataset.mode, email = $("#aEmail").value.trim(), pass = $("#aPass").value, name = $("#aName").value.trim();
    const err = $("#authError"), btn = $("#authSubmit");
    err.setAttribute("hidden", ""); btn.disabled = true; btn.textContent = "…";
    try {
      if (mode === "signup") { const r = await Store.auth.signUp(email, pass, name); if (r.needsConfirm) { err.textContent = "Check your email to confirm your account, then sign in."; err.classList.add("info"); err.removeAttribute("hidden"); btn.disabled = false; switchTab("signin"); return; } }
      else { await Store.auth.signIn(email, pass); }
      closeModal();
    } catch (ex) {
      err.textContent = friendly(ex.message); err.removeAttribute("hidden"); btn.disabled = false; btn.textContent = mode === "signup" ? "Create account" : "Sign in";
    }
  }
  function friendly(m) { if (/invalid login/i.test(m)) return "Email or password is incorrect."; if (/already registered/i.test(m)) return "That email already has an account — try signing in."; return m || "Something went wrong. Try again."; }
  async function submitGuest(e) { e.preventDefault(); await Store.auth.signIn($("#gName").value.trim() || "Guest"); closeModal(); }
  function maybeBanner() {
    if (Store.isCloud() || localStorage.getItem("ppf_hide_guest_banner")) return;
    const b = document.createElement("div"); b.className = "guest-banner";
    b.innerHTML = `<div class="wrap"><span>You're in <b>guest mode</b> — saves stay on this device. Turn on free accounts to sync everywhere.</span>
      <span class="guest-banner__actions"><a href="#/account">Learn how</a><button id="dismissGuest" aria-label="Dismiss">Dismiss</button></span></div>`;
    $(".site-header").insertAdjacentElement("afterend", b);
    $("#dismissGuest").addEventListener("click", () => { localStorage.setItem("ppf_hide_guest_banner", "1"); b.remove(); });
  }
  window.openAuth = openModal;

  /* ====================================================================== */
  /*  VIEWS                                                                  */
  /* ====================================================================== */
  const app = () => document.getElementById("app");

  const views = {
    /* ---------- HOME ---------- */
    home() {
      app().innerHTML = `
        <section class="hero"><div class="wrap hero__grid"><div>
          <span class="eyebrow">Free field guide · Optional account</span>
          <h1>Know what you're<br><em>touching.</em></h1>
          <p class="lede">Thousands of common plants can burn your skin, blind you, or kill if eaten — and most people have no idea what they look like. Identify a dangerous plant by its leaf veins, flower, and growing conditions, then learn whether it's invasive, whether to pull it, and exactly what to do if you're exposed.</p>
          <div class="hero__cta"><a class="btn" href="#/identify">Identify by photo →</a><a class="btn btn--ghost" href="#/filter">Identify by traits</a></div>
          <div class="legend" aria-label="Severity scale">
            <span class="chip sev-1"><span class="sev-dot" style="background:var(--sev-1)"></span>1 Irritant</span>
            <span class="chip sev-2"><span class="sev-dot" style="background:var(--sev-2)"></span>2 Harmful</span>
            <span class="chip sev-3"><span class="sev-dot" style="background:var(--sev-3)"></span>3 Toxic</span>
            <span class="chip sev-4"><span class="sev-dot" style="background:var(--sev-4)"></span>4 Severe</span>
            <span class="chip sev-5"><span class="sev-dot" style="background:var(--sev-5)"></span>5 Deadly</span></div>
        </div><div class="plate"><canvas data-plant="giant-hogweed" aria-label="Botanical plate illustration"></canvas>
          <div class="plate__tag"><span>PLATE I · <span class="serif-italic">Heracleum mantegazzianum</span></span><span>SEV&nbsp;5</span></div></div></div></section>

        <section class="section section--band"><div class="wrap">
          <div class="section__head reveal"><span class="eyebrow">Three ways in</span>
            <h2>Start with a photo, the wizard, or what you can see.</h2>
            <p class="muted">No login, no cost. The trait tools work offline; the photo tool uses your own free Pl@ntNet key.</p></div>
          <div class="methods">
            <a class="method reveal" href="#/identify" style="text-decoration:none"><span class="num">METHOD 01</span><h3>Identify by photo</h3><p>Upload a photo of leaves or flowers. We match it against the Pl@ntNet plant database and flag any result that's in our poison list — with the full danger profile one tap away.</p><span class="btn btn--ghost">Open photo ID →</span></a>
            <a class="method reveal" href="#/wizard" style="text-decoration:none"><span class="num">METHOD 02</span><h3>Guided wizard</h3><p>Answer one question at a time — vein pattern, leaf arrangement, flower, sun, water — and watch the list of dangerous plants narrow live until you've got your match.</p><span class="btn btn--ghost">Start the wizard →</span></a>
            <a class="method reveal" href="#/filter" style="text-decoration:none"><span class="num">METHOD 03</span><h3>Identify by traits</h3><p>Prefer to drive? Narrow by <b>vein pattern</b>, flower color, sunlight, water and climate — plus leaf shape and arrangement. The list filters as you choose.</p><span class="btn btn--ghost">Open trait filter →</span></a></div></div></section>

        <section class="section"><div class="wrap">
          <div class="section__head reveal"><span class="eyebrow">Should you pull it?</span>
            <h2>Some of these don't just need avoiding — they need removing.</h2>
            <p class="lede">Invasive poisonous plants spread along trails, fences and pastures. Every profile tells you whether to remove it, <b>how to do it safely</b>, and what never to do (hint: never burn poison ivy or hogweed). Save the ones near you and log where you found them.</p></div>
          <div class="grid-plants" id="featured"></div>
          <p class="center" style="margin-top:1.8rem"><a class="btn" href="#/catalog">Browse all plants →</a></p></div></section>`;
      const ids = ["poison-ivy", "giant-hogweed", "water-hemlock", "oleander", "manchineel", "monkshood"];
      const map = byId();
      $("#featured").innerHTML = ids.map(id => map[id] ? cardHTML(map[id]) : "").join("");
      renderPlates(app()); initReveal(app());
    },

    /* ---------- IDENTIFY (Pl@ntNet) ---------- */
    identify() {
      app().innerHTML = `<section class="section"><div class="wrap" style="max-width:820px">
        <span class="eyebrow">Method 01 · Photo</span><h1 style="margin:.4rem 0 .6rem">Identify by photo</h1>
        <p class="lede">Upload a clear photo of the leaves or flowers. We send it to the <a href="https://plantnet.org" target="_blank" rel="noopener">Pl@ntNet</a> plant database, then check the results against our poison list and flag anything dangerous.</p>
        <div class="panel" id="keyPanel" style="margin-top:1.5rem"><h3>One-time setup · your free Pl@ntNet key</h3>
          <p class="note">Keeping photo-ID free needs a free API key from Pl@ntNet (about 2 minutes, ~500 IDs/day). Get one at <a href="https://my.plantnet.org/" target="_blank" rel="noopener">my.plantnet.org</a> → account → settings. It's stored only in this browser.</p>
          <div class="keyrow"><input class="field field--search" id="apiKey" type="password" placeholder="Paste your Pl@ntNet API key" autocomplete="off" />
            <button class="btn" id="saveKey">Save key</button><button class="btn btn--ghost hidden" id="clearKey">Forget key</button></div>
          <p class="note" id="keyStatus"></p></div>
        <div class="dropzone" id="drop" role="button" tabindex="0" aria-label="Upload a plant photo">
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#6E5438" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="M7 9l5-5 5 5" /><path d="M12 4v12" /></svg>
          <p><strong>Drop a photo here</strong> or click to choose</p><p class="note">Leaves or flowers, well-lit, filling the frame. JPG or PNG.</p>
          <input type="file" id="file" accept="image/*" class="hidden" /></div>
        <div class="keyrow" id="organRow"><label class="note" for="organ">What's in the photo?</label>
          <select class="field" id="organ"><option value="auto">Auto-detect</option><option value="leaf">Leaf</option><option value="flower">Flower</option><option value="fruit">Fruit / berries</option><option value="bark">Bark</option></select></div>
        <div class="preview hidden" id="preview"><img id="previewImg" alt="Your uploaded plant photo" />
          <div><button class="btn btn--block" id="identifyBtn">Identify this plant →</button>
          <div id="status" class="stack" style="margin-top:1rem"></div><div class="results" id="results"></div></div></div>
        <p class="note" style="margin-top:1.5rem">No photo, or want to be sure? <a href="#/filter">Identify by traits instead →</a> Results name a likely species — always confirm against the plant's profile and look-alikes before acting.</p>
      </div></section>`;
      initIdentify();
    },

    /* ---------- WIZARD ---------- */
    wizard() {
      app().innerHTML = `<section class="section"><div class="wrap" style="max-width:760px">
        <span class="eyebrow">Guided identification</span><h1 style="margin:.4rem 0 .6rem">ID wizard</h1>
        <p class="lede" style="margin-bottom:1.8rem">One question at a time. Answer what you can see and skip the rest — we'll narrow the list of dangerous plants as you go. Not a diagnosis: always confirm against the profile and look-alikes.</p>
        <div class="wizard" id="wizard"><div class="wizard__bar"><div class="wizard__progress" id="progress"></div></div>
          <div class="wizard__count" id="count"></div><div id="stage"></div></div></div></section>`;
      initWizard();
    },

    /* ---------- FILTER ---------- */
    filter() {
      app().innerHTML = `<section class="section"><div class="wrap">
        <span class="eyebrow">Method 03 · No photo needed</span><h1 style="margin:.4rem 0 .6rem">Identify by traits</h1>
        <p class="lede" style="margin-bottom:1.8rem">Pick what you can see on the plant. Start with the <b>vein pattern</b> — it's the most reliable clue — then add flower color and where it's growing. Results filter as you go.</p>
        <div class="filter-layout">
          <form class="filter-panel" id="filters" aria-label="Plant trait filters">
            <div class="filter-group" id="g-veins"><span class="lbl">Leaf veins</span></div>
            <div class="filter-group" id="g-arrangement"><span class="lbl">Leaf arrangement</span></div>
            <div class="filter-group" id="g-flowerColor"><span class="lbl">Flower color</span></div>
            <div class="filter-group" id="g-sun"><span class="lbl">Sunlight</span></div>
            <div class="filter-group" id="g-water"><span class="lbl">Water</span></div>
            <div class="filter-group" id="g-extra"><span class="lbl">Other clues</span>
              <label class="opt"><input type="checkbox" id="x-touch" /> Hurts to touch</label>
              <label class="opt"><input type="checkbox" id="x-invasive" /> Spreading / invasive</label></div>
            <button type="button" class="btn btn--ghost btn--block filter-reset" id="reset">Reset filters</button></form>
          <div><div class="toolbar" style="margin-top:0"><strong id="summary" style="font-family:var(--display);font-size:1.3rem;color:var(--forest-deep)"></strong><span class="count" id="count"></span></div>
            <div class="grid-plants" id="grid"></div>
            <p class="center muted hidden" id="empty" style="margin-top:2rem">Nothing matches every trait you picked. Try removing one — real plants vary, and a wrong guess on one feature can hide the right plant. <a href="#" id="clear">Reset</a>.</p></div></div></div></section>`;
      initFilter();
    },

    /* ---------- CATALOG ---------- */
    catalog() {
      app().innerHTML = `<section class="section"><div class="wrap">
        <span class="eyebrow">The field guide</span><h1 style="margin:.4rem 0 1.4rem">All dangerous plants</h1>
        <div class="toolbar">
          <input class="field field--search" id="search" type="search" placeholder="Search name or scientific name…" aria-label="Search plants" />
          <select class="field" id="sev" aria-label="Filter by severity"><option value="">Any severity</option><option value="5">5 · Deadly</option><option value="4">4 · Severe</option><option value="3">3 · Toxic</option><option value="2">2 · Harmful</option><option value="1">1 · Irritant</option></select>
          <select class="field" id="flag" aria-label="Filter by hazard type"><option value="">All hazards</option><option value="touch">Harmful to touch</option><option value="invasive">Invasive</option></select>
          <select class="field" id="sort" aria-label="Sort"><option value="sev">Sort: most dangerous</option><option value="az">Sort: A–Z</option></select>
          <span class="count" id="count"></span></div>
        <div class="grid-plants" id="grid"></div>
        <p class="center muted hidden" id="empty" style="margin-top:2rem">No plants match those filters. <a href="#" id="clear">Clear filters</a>.</p></div></section>`;
      initCatalog();
    },

    /* ---------- PLANT DETAIL ---------- */
    plant(id) {
      const p = (window.PLANTS || []).find(x => x.id === id);
      if (!p) { app().innerHTML = `<section class="section"><div class="wrap"><h1>Plant not found</h1><p class="muted">We couldn't find that plant. <a href="#/catalog">Browse all plants →</a></p></div></section>`; return; }
      document.title = `${p.common} (${p.scientific}) — Poison Plant Finder`;
      const t = p.traits, d = p.danger, rem = p.removal, sev = severityOf(p);
      const aka = (p.aka && p.aka.length) ? ` · also called ${p.aka.join(", ")}` : "";
      const verdict = rem.shouldRemove ? `🚩 Yes — remove this plant` : `Usually leave it — but handle with care`;
      app().innerHTML = `<section class="section"><div class="wrap"><div id="plant"><div class="specimen">
        <aside class="specimen__plate"><canvas data-plant="${p.id}"></canvas>
          <div class="specimen__taxon"><span><b>Family</b> ${p.family}</span>
            <span><b>Scientific</b> <span class="serif-italic">${p.scientific}</span></span>
            <span><b>Severity</b> ${p.severity} of 5 — ${sev.label}</span></div></aside>
        <div class="detail-body"><div class="detail-head"><span class="eyebrow">Specimen profile</span><h1>${p.common}</h1>
          <div class="detail-sci">${p.scientific}<span class="muted" style="font-style:normal;font-family:var(--body);font-size:.9rem">${aka}</span></div>
          <div class="detail-badges">${sevBadge(p)} ${invasiveBadge(p)} ${contactBadge(p)}</div>
          <div class="user-actions" id="userActions">
            <button class="action-btn" id="favBtn" aria-pressed="false"><span class="ic">♡</span> <span class="lbl">Save</span></button>
            <div class="list-dd"><button class="action-btn" id="listBtn" aria-haspopup="true" aria-expanded="false"><span class="ic">＋</span> Add to list</button><div class="list-pop" id="listPop" hidden></div></div>
            <a class="action-btn" id="sightBtn" href="#/sightings/${p.id}"><span class="ic">📍</span> Log a sighting</a></div></div>
          <div class="callout-remove ${rem.shouldRemove ? "do-remove" : ""}"><div class="verdict">${verdict}</div><p>${rem.urgency}</p>
            <dl><div><dt>How to remove safely</dt><dd>${rem.method}</dd></div><div><dt>Precautions</dt><dd>${rem.precautions}</dd></div><div><dt>Disposal</dt><dd>${rem.disposal}</dd></div></dl></div>
          <div class="panel"><h3>Where it grows</h3><div class="traitlist">
            <div class="row"><span class="k">Native to</span><span>${p.native}</span></div>
            <div class="row"><span class="k">Status</span><span>${p.invasive.status} — ${p.invasive.regions}</span></div>
            <div class="row"><span class="k">Climate</span><span>${t.climate}</span></div></div></div>
          <div class="panel"><h3>How to identify it</h3><p>${t.leaf}</p><div class="traitlist">
            <div class="row"><span class="k">Vein pattern</span><span>${t.veins} — ${t.veinNote}</span></div>
            <div class="row"><span class="k">Arrangement</span><span>${t.arrangement}</span></div>
            <div class="row"><span class="k">Flowers</span><span>${t.flower}</span></div>
            <div class="row"><span class="k">Sunlight</span><span>${(t.sun || []).join(", ")}</span></div>
            <div class="row"><span class="k">Water</span><span>${(t.water || []).join(", ")}</span></div>
            <div class="row"><span class="k">Look-alikes</span><span>${t.lookalikes}</span></div></div></div>
          <div class="panel"><h3>Why it's dangerous</h3><div class="danger-grid">
            <div class="danger-row"><span class="k">If eaten</span><span>${d.ingest}</span></div>
            <div class="danger-row"><span class="k">On skin</span><span>${d.skin}</span></div>
            <div class="danger-row"><span class="k">In eyes</span><span>${d.eyes}</span></div>
            <div class="danger-row"><span class="k">Animals</span><span>${d.animals}</span></div>
            <div class="danger-row"><span class="k">Allergy / anaphylaxis</span><span>${d.anaphylaxis}</span></div></div></div>
          <div class="panel notebook"><h3>Your notes</h3>
            <textarea id="noteBox" class="notebox" placeholder="Private notes — where you've seen it, how you removed it, reminders for next season…"></textarea>
            <span class="note save-status" id="noteStatus"></span></div>
          <div class="panel"><h3>If you're exposed — first aid</h3><p class="firstaid">${p.firstAid}</p>
            <p class="emergency-note">${p.emergency}<br>US Poison Control: <strong>${PC_PHONE}</strong> · Emergency: <strong>911</strong></p></div>
          <p class="note">This profile is for education and is not medical advice. Identification is hard and look-alikes are common — when in doubt, treat the plant as dangerous and check with Poison Control, a doctor, or a vet.</p>
        </div></div></div></div></section>`;
      renderPlates(app()); initReveal(app());
      initPlantControls(p);
    },

    /* ---------- SIGHTINGS ---------- */
    sightings(plantParam) {
      app().innerHTML = `<section class="section"><div class="wrap">
        <span class="eyebrow">Your field log</span><h1 style="margin:.4rem 0 .6rem">Sightings</h1>
        <p class="lede" style="margin-bottom:1.6rem">Save where you've spotted a dangerous plant — pin it on the map, tag it, and keep notes so you (or whoever maintains the land) can find and deal with it later.</p>
        <div class="sight-layout">
          <form class="panel sight-form" id="sightForm"><h3>Log a sighting</h3>
            <label class="field-label">Plant<select class="field field--block" id="sPlant"></select></label>
            <label class="field-label">Category<select class="field field--block" id="sCategory"><option>My property</option><option>Public land / trail</option><option>Shared / neighbor</option><option>To remove</option><option>Just spotted</option></select></label>
            <label class="field-label">Date seen<input class="field field--block" type="date" id="sDate" /></label>
            <label class="field-label">Place (optional)<input class="field field--block" type="text" id="sPlace" placeholder="e.g. back fence, north trailhead" /></label>
            <div class="loc-row"><button type="button" class="btn btn--ghost" id="useLoc">📍 Use my location</button><span class="note" id="locNote">…or tap the map to drop a pin</span></div>
            <label class="field-label">Notes<textarea class="notebox" id="sNotes" placeholder="How much there is, condition, whether it needs removing…"></textarea></label>
            <button class="btn btn--block" type="submit">Save sighting</button><p class="auth-error" id="sError" hidden></p></form>
          <div class="sight-main"><div id="map" class="map"></div>
            <div class="toolbar" style="margin:1.2rem 0 .6rem"><strong style="font-family:var(--display);font-size:1.3rem;color:var(--forest-deep)">Logged sightings</strong><span class="count" id="sCount"></span></div>
            <div id="sList" class="sight-list"></div></div></div></div></section>`;
      initSightings(plantParam);
    },

    /* ---------- COLLECTIONS ---------- */
    collections() {
      app().innerHTML = `<section class="section"><div class="wrap">
        <span class="eyebrow">Your field notebook</span><h1 style="margin:.4rem 0 .6rem">Collections</h1>
        <p class="lede" style="margin-bottom:1.8rem">Saved plants and your own lists — like "My yard", "Trail by the creek", or "To remove this weekend".</p>
        <div id="favSection"></div>
        <div class="toolbar" style="margin-top:2.5rem"><strong style="font-family:var(--display);font-size:1.5rem;color:var(--forest-deep)">Your lists</strong>
          <div class="newlist-inline"><input class="field" id="newListName" placeholder="New list name" /><button class="btn" id="createList">Create list</button></div></div>
        <div id="lists"></div></div></section>`;
      initCollections();
    },

    /* ---------- ACCOUNT ---------- */
    account() {
      app().innerHTML = `<section class="section"><div class="wrap" style="max-width:880px">
        <span class="eyebrow">Your account</span><h1 style="margin:.4rem 0 1.4rem" id="hello">Dashboard</h1><div id="dash"></div></div></section>`;
      initAccount();
    },
  };

  /* ====================================================================== */
  /*  VIEW CONTROLLERS (ported from per-page scripts)                        */
  /* ====================================================================== */
  function initIdentify() {
    const LS_KEY = "ppf_plantnet_key";
    const apiKeyInput = $("#apiKey"), keyStatus = $("#keyStatus"), drop = $("#drop"), fileInput = $("#file");
    const preview = $("#preview"), previewImg = $("#previewImg"), identifyBtn = $("#identifyBtn"), statusEl = $("#status"), resultsEl = $("#results");
    let currentFile = null;
    function refreshKeyUI() {
      const key = localStorage.getItem(LS_KEY);
      if (key) { keyStatus.innerHTML = "✓ Key saved in this browser. You're ready to identify."; $("#clearKey").classList.remove("hidden"); apiKeyInput.value = ""; apiKeyInput.placeholder = "Key saved — paste a new one to replace"; }
      else { keyStatus.textContent = "No key saved yet. The trait filter still works without one."; $("#clearKey").classList.add("hidden"); }
    }
    $("#saveKey").addEventListener("click", () => { const v = apiKeyInput.value.trim(); if (!v) { keyStatus.textContent = "Paste a key first, or use the trait filter."; return; } localStorage.setItem(LS_KEY, v); refreshKeyUI(); });
    $("#clearKey").addEventListener("click", () => { localStorage.removeItem(LS_KEY); refreshKeyUI(); });
    refreshKeyUI();
    function setFile(f) { if (!f || !f.type.startsWith("image/")) return; currentFile = f; previewImg.src = URL.createObjectURL(f); preview.classList.remove("hidden"); resultsEl.innerHTML = ""; statusEl.innerHTML = ""; }
    drop.addEventListener("click", () => fileInput.click());
    drop.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); fileInput.click(); } });
    fileInput.addEventListener("change", (e) => setFile(e.target.files[0]));
    ["dragover", "dragenter"].forEach(ev => drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.add("drag"); }));
    ["dragleave", "drop"].forEach(ev => drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.remove("drag"); }));
    drop.addEventListener("drop", (e) => setFile(e.dataTransfer.files[0]));
    const normName = (s) => (s || "").toLowerCase().replace(/[^a-z ]/g, " ").replace(/\s+/g, " ").trim();
    function plantCandidates(p) { const out = new Set(); p.scientific.split("/").forEach(part => { const w = normName(part).split(" ").filter(Boolean); if (w[0]) out.add(w[0]); if (w[1] && w[1] !== "spp") out.add(w[0] + " " + w[1]); }); return out; }
    function findMatch(sci) { const n = normName(sci), w = n.split(" "), genus = w[0], binom = w.slice(0, 2).join(" ");
      for (const p of PLANTS) if (plantCandidates(p).has(binom)) return { plant: p, exact: true };
      for (const p of PLANTS) if (plantCandidates(p).has(genus)) return { plant: p, exact: false };
      return null; }
    identifyBtn.addEventListener("click", async () => {
      const key = localStorage.getItem(LS_KEY);
      if (!key) { statusEl.innerHTML = `<p class="emergency-note">Save your free Pl@ntNet key above first, or <a href="#/filter">use the trait filter</a>.</p>`; return; }
      if (!currentFile) return;
      statusEl.innerHTML = `<div class="keyrow"><span class="spinner"></span><span class="note">Identifying… checking the Pl@ntNet database</span></div>`; resultsEl.innerHTML = "";
      const organ = $("#organ").value, form = new FormData(); form.append("images", currentFile); form.append("organs", organ === "auto" ? "auto" : organ);
      try {
        const res = await fetch(`https://my-api.plantnet.org/v2/identify/all?api-key=${encodeURIComponent(key)}`, { method: "POST", body: form });
        if (!res.ok) { const msg = res.status === 401 || res.status === 403 ? "That key was rejected. Check it at my.plantnet.org and save it again." : res.status === 404 ? "Pl@ntNet couldn't recognize a plant in that photo. Try a clearer leaf or flower shot." : res.status === 429 ? "Daily free limit reached on this key. Try again tomorrow, or use the trait filter." : `Pl@ntNet returned an error (${res.status}).`; statusEl.innerHTML = `<p class="emergency-note">${msg}</p>`; return; }
        renderResults((await res.json()).results || []);
      } catch (err) { statusEl.innerHTML = `<p class="emergency-note">Couldn't reach Pl@ntNet (network or browser block). You can still <a href="#/filter">identify by traits</a>. Technical detail: ${err.message}</p>`; }
    });
    function renderResults(results) {
      if (!results.length) { statusEl.innerHTML = `<p class="emergency-note">No confident match. Try a sharper photo of a single leaf or flower, or <a href="#/filter">identify by traits</a>.</p>`; return; }
      let dangerFound = null;
      const rows = results.slice(0, 5).map(r => {
        const sci = r.species?.scientificNameWithoutAuthor || r.species?.scientificName || "Unknown";
        const common = (r.species?.commonNames || [])[0] || "", score = Math.round((r.score || 0) * 100), m = findMatch(sci);
        if (m && !dangerFound) dangerFound = m;
        if (m) return `<a class="result-row match" href="${plantHref(m.plant.id)}"><div><strong>${m.plant.common}</strong> — <span class="serif-italic">${sci}</span>${common ? `<br><span class="note">also called ${common}</span>` : ""}<br>${sevBadge(m.plant)} ${m.exact ? "" : `<span class="note">(genus match — confirm species)</span>`}</div><span class="score">${score}%</span></a>`;
        return `<div class="result-row"><div><strong>${common || sci}</strong> ${common ? `<br><span class="serif-italic note">${sci}</span>` : ""}<br><span class="note">Not in our poison database.</span></div><span class="score">${score}%</span></div>`;
      }).join("");
      statusEl.innerHTML = dangerFound ? `<p class="emergency-note">⚠ A possible match is in our poison list: <strong>${dangerFound.plant.common}</strong>. Open it to see the danger profile — and never touch or taste a plant on the strength of a photo alone.</p>` : `<p class="note">No clear match to a known poisonous plant — but that's not a guarantee of safety. Compare with the <a href="#/catalog">catalog</a> and look-alikes before handling anything.</p>`;
      resultsEl.innerHTML = `<p class="note">Top Pl@ntNet matches (highest confidence first):</p>` + rows;
    }
  }

  function initWizard() {
    const QUESTIONS = [
      { key: "veins", multi: false, q: "How do the veins run on a single leaf?", help: "Look at one leaf (or leaflet) and trace the veins from the stalk.",
        hints: { "Pinnate (feather)": "One central rib with veins branching off like a feather.", "Palmate (hand)": "Several main veins spreading from one point, like fingers from a palm.", "Parallel": "Veins run side by side down the leaf, like a blade of grass.", "Needle / scale": "Needles or tiny scales instead of a flat leaf (conifers)." } },
      { key: "arrangement", multi: false, q: "How are the leaves arranged on the stem?", help: "Where leaves attach to the stem.",
        hints: { "Alternate": "One leaf at a time, staggered up the stem.", "Opposite": "Leaves in matched pairs across from each other.", "Whorled": "Three or more leaves circling the stem at one point.", "Basal rosette": "A low circle of leaves at the base, near the ground.", "Compound leaflets": "Each 'leaf' is made of several leaflets on one stalk." } },
      { key: "flowerColor", multi: true, q: "What color are the flowers (if any)?", help: "Skip if it isn't flowering.", hints: {} },
      { key: "sun", multi: true, q: "How much sun does it get where it's growing?", help: "", hints: {} },
      { key: "water", multi: true, q: "How wet is the ground there?", help: "", hints: {} },
    ];
    const answers = {}; let step = 0;
    const matches = () => PLANTS.filter(p => { const t = p.traits; for (const Q of QUESTIONS) { const a = answers[Q.key]; if (!a) continue; if (Q.multi) { if (!a.some(v => (t[Q.key] || []).includes(v))) return false; } else { if (t[Q.key] !== a) return false; } } return true; }).sort((a, b) => b.severity - a.severity || a.common.localeCompare(b.common));
    const stage = $("#stage"), progress = $("#progress"), countEl = $("#count");
    function render() {
      const m = matches(); progress.style.width = `${(step / QUESTIONS.length) * 100}%`;
      countEl.innerHTML = `<strong>${m.length}</strong> plant${m.length === 1 ? "" : "s"} still match`;
      if (step >= QUESTIONS.length) return renderResults(m);
      const Q = QUESTIONS[step], opts = VOCAB[Q.key];
      stage.innerHTML = `<div class="wizard__q reveal in"><span class="step-no">Step ${step + 1} of ${QUESTIONS.length}</span><h2>${Q.q}</h2>${Q.help ? `<p class="note">${Q.help}</p>` : ""}
        <div class="wizard__opts">${opts.map(o => `<button class="wopt" data-val="${o}"><span class="wopt__t">${o}</span>${Q.hints[o] ? `<span class="wopt__h">${Q.hints[o]}</span>` : ""}</button>`).join("")}</div>
        <div class="wizard__nav">${step > 0 ? `<button class="btn btn--ghost" id="backBtn">← Back</button>` : "<span></span>"}
          <div class="wizard__nav-right"><button class="btn btn--ghost" id="skipBtn">Not sure — skip</button>${m.length <= 6 ? `<button class="btn" id="seeBtn">See ${m.length} matches →</button>` : ""}</div></div></div>`;
      stage.querySelectorAll(".wopt").forEach(b => b.addEventListener("click", () => {
        const v = b.dataset.val;
        if (Q.multi) { const cur = answers[Q.key] || []; answers[Q.key] = cur.includes(v) ? cur.filter(x => x !== v) : [...cur, v]; b.classList.toggle("on"); const m2 = matches(); countEl.innerHTML = `<strong>${m2.length}</strong> plant${m2.length === 1 ? "" : "s"} still match`; ensureNext(); }
        else { answers[Q.key] = v; step++; render(); }
      }));
      $("#backBtn")?.addEventListener("click", () => { step--; render(); });
      $("#skipBtn")?.addEventListener("click", () => { delete answers[Q.key]; step++; render(); });
      $("#seeBtn")?.addEventListener("click", () => { step = QUESTIONS.length; render(); });
    }
    function ensureNext() { if ($("#nextBtn")) return; const btn = document.createElement("button"); btn.className = "btn"; btn.id = "nextBtn"; btn.textContent = "Next →"; btn.addEventListener("click", () => { step++; render(); }); $(".wizard__nav-right").appendChild(btn); }
    function renderResults(m) {
      progress.style.width = "100%";
      const picked = QUESTIONS.filter(Q => answers[Q.key]).map(Q => { const a = answers[Q.key]; return `${Array.isArray(a) ? a.join(" / ") : a}`; });
      stage.innerHTML = `<div class="reveal in"><span class="step-no">Result</span><h2>${m.length ? `${m.length} possible match${m.length === 1 ? "" : "es"}` : "No exact match"}</h2>
        <p class="note">${picked.length ? "Based on: " + picked.join(" · ") : "You skipped every question — here's the full list."}${m.length ? " Tap one to see its full danger profile." : " Try again and skip a trait — real plants vary, and one wrong call can hide the right plant."}</p>
        <div class="grid-plants" style="margin-top:1.2rem">${m.map(p => cardHTML(p)).join("")}</div>
        <div class="wizard__nav" style="margin-top:1.6rem"><button class="btn btn--ghost" id="restartBtn">↺ Start over</button><a class="btn btn--ghost" href="#/filter">Switch to full filter →</a></div></div>`;
      renderPlates(stage); $("#restartBtn").addEventListener("click", () => { Object.keys(answers).forEach(k => delete answers[k]); step = 0; render(); });
    }
    render();
  }

  function initFilter() {
    const groups = { veins: { key: "veins", el: "#g-veins" }, arrangement: { key: "arrangement", el: "#g-arrangement" }, flowerColor: { key: "flowerColor", el: "#g-flowerColor" }, sun: { key: "sun", el: "#g-sun" }, water: { key: "water", el: "#g-water" } };
    Object.values(groups).forEach(g => { const host = $(g.el); VOCAB[g.key].forEach(val => { const label = document.createElement("label"); label.className = "opt"; label.innerHTML = `<input type="checkbox" value="${val}" data-group="${g.key}" /> ${val}`; host.appendChild(label); }); });
    const grid = $("#grid"), countEl = $("#count"), emptyEl = $("#empty"), summary = $("#summary");
    const selected = (k) => $$(`input[data-group="${k}"]:checked`).map(i => i.value);
    function apply() {
      const sel = { veins: selected("veins"), arrangement: selected("arrangement"), flowerColor: selected("flowerColor"), sun: selected("sun"), water: selected("water") };
      const touch = $("#x-touch").checked, invasive = $("#x-invasive").checked, anyChosen = Object.values(sel).some(a => a.length) || touch || invasive;
      let list = PLANTS.filter(p => { const t = p.traits;
        if (sel.veins.length && !sel.veins.includes(t.veins)) return false;
        if (sel.arrangement.length && !sel.arrangement.includes(t.arrangement)) return false;
        if (sel.flowerColor.length && !sel.flowerColor.some(v => (t.flowerColor || []).includes(v))) return false;
        if (sel.sun.length && !sel.sun.some(v => (t.sun || []).includes(v))) return false;
        if (sel.water.length && !sel.water.some(v => (t.water || []).includes(v))) return false;
        if (touch && !p.contactHazard) return false;
        if (invasive && !/invasive/i.test(p.invasive.status)) return false;
        return true; });
      list.sort((a, b) => (b.severity - a.severity) || a.common.localeCompare(b.common));
      grid.innerHTML = list.map(cardHTML).join(""); countEl.textContent = `${list.length} of ${PLANTS.length}`;
      summary.textContent = anyChosen ? (list.length ? "Possible matches" : "No matches") : "All plants";
      emptyEl.classList.toggle("hidden", list.length > 0); renderPlates(grid); initReveal(grid);
    }
    $("#filters").addEventListener("change", apply);
    const reset = () => { $$("#filters input[type=checkbox]").forEach(i => i.checked = false); apply(); };
    $("#reset").addEventListener("click", reset);
    $("#clear")?.addEventListener("click", (e) => { e.preventDefault(); reset(); });
    apply();
  }

  function initCatalog() {
    const grid = $("#grid"), countEl = $("#count"), emptyEl = $("#empty"), search = $("#search"), sevSel = $("#sev"), flagSel = $("#flag"), sortSel = $("#sort");
    function apply() {
      const q = search.value.trim().toLowerCase(), sev = sevSel.value, flag = flagSel.value, sort = sortSel.value;
      let list = PLANTS.filter(p => {
        if (sev && String(p.severity) !== sev) return false;
        if (flag === "touch" && !p.contactHazard) return false;
        if (flag === "invasive" && !/invasive/i.test(p.invasive.status)) return false;
        if (q) { const hay = (p.common + " " + p.scientific + " " + (p.aka || []).join(" ")).toLowerCase(); if (!hay.includes(q)) return false; }
        return true; });
      list.sort((a, b) => sort === "az" ? a.common.localeCompare(b.common) : (b.severity - a.severity) || a.common.localeCompare(b.common));
      grid.innerHTML = list.map(cardHTML).join(""); countEl.textContent = `${list.length} of ${PLANTS.length} plants`;
      emptyEl.classList.toggle("hidden", list.length > 0); renderPlates(grid); initReveal(grid);
    }
    [search, sevSel, flagSel, sortSel].forEach(el => el.addEventListener("input", apply));
    $("#clear")?.addEventListener("click", (e) => { e.preventDefault(); search.value = ""; sevSel.value = ""; flagSel.value = ""; apply(); });
    apply();
  }

  async function initPlantControls(p) {
    await Store.init();
    const favBtn = $("#favBtn"), noteBox = $("#noteBox"), noteStatus = $("#noteStatus");
    async function refreshFav() { const favs = await Store.favorites.list(); const on = favs.includes(p.id); favBtn.classList.toggle("on", on); favBtn.setAttribute("aria-pressed", String(on)); favBtn.querySelector(".ic").textContent = on ? "♥" : "♡"; favBtn.querySelector(".lbl").textContent = on ? "Saved" : "Save"; }
    favBtn.addEventListener("click", async () => { const favs = await Store.favorites.list(); if (favs.includes(p.id)) await Store.favorites.remove(p.id); else await Store.favorites.add(p.id); refreshFav(); });
    async function loadNote() { noteBox.value = await Store.notes.get(p.id); }
    const saveNote = debounce(async () => { await Store.notes.set(p.id, noteBox.value.trim()); noteStatus.textContent = "Saved ✓"; setTimeout(() => { noteStatus.textContent = ""; }, 1500); }, 600);
    noteBox.addEventListener("input", () => { noteStatus.textContent = "Saving…"; saveNote(); });
    const listBtn = $("#listBtn"), listPop = $("#listPop");
    async function renderLists() {
      const cols = await Store.collections.list();
      listPop.innerHTML = (cols.length ? cols.map(c => `<label class="list-opt"><input type="checkbox" data-col="${c.id}" ${c.items.includes(p.id) ? "checked" : ""}/> ${esc(c.name)}</label>`).join("") : `<p class="note" style="padding:.3rem .2rem">No lists yet.</p>`) + `<div class="list-new"><input class="field" id="newListName" placeholder="New list name" /><button class="btn" id="newListBtn">Create</button></div>`;
      listPop.querySelectorAll("input[data-col]").forEach(cb => cb.addEventListener("change", async () => { if (cb.checked) await Store.collections.addItem(cb.dataset.col, p.id); else await Store.collections.removeItem(cb.dataset.col, p.id); }));
      $("#newListBtn").addEventListener("click", async () => { const name = $("#newListName").value.trim(); if (!name) return; const col = await Store.collections.create(name); await Store.collections.addItem(col.id, p.id); renderLists(); });
    }
    listBtn.addEventListener("click", async () => { const open = listPop.hasAttribute("hidden"); if (open) await renderLists(); listPop.toggleAttribute("hidden", !open); listBtn.setAttribute("aria-expanded", String(open)); });
    document.addEventListener("click", (e) => { if (!listPop.hasAttribute("hidden") && !e.target.closest(".list-dd")) { listPop.setAttribute("hidden", ""); listBtn.setAttribute("aria-expanded", "false"); } });
    await Promise.all([refreshFav(), loadNote()]);
    Store.onChange(() => { if (document.getElementById("favBtn")) { refreshFav(); loadNote(); } });
  }

  async function initSightings(plantParam) {
    const map = byId();
    let lmap, markers, draft = null, draftMarker = null;
    const sel = $("#sPlant");
    sel.innerHTML = `<option value="">— choose a plant —</option><option value="unknown">Unknown / not sure</option>` + PLANTS.slice().sort((a, b) => a.common.localeCompare(b.common)).map(p => `<option value="${p.id}">${p.common} (${p.scientific})</option>`).join("");
    if (plantParam && map[plantParam]) sel.value = plantParam;
    $("#sDate").value = new Date().toISOString().slice(0, 10);
    function initMap() {
      lmap = L.map("map").setView([39.5, -98.35], 4);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19, attribution: "© OpenStreetMap contributors" }).addTo(lmap);
      markers = L.layerGroup().addTo(lmap);
      lmap.on("click", (e) => setDraft(e.latlng.lat, e.latlng.lng));
    }
    function setDraft(lat, lng) { draft = { lat, lng }; if (draftMarker) draftMarker.setLatLng([lat, lng]); else draftMarker = L.marker([lat, lng], { opacity: 0.7 }).addTo(lmap).bindPopup("New sighting here").openPopup(); $("#locNote").textContent = `Pin set: ${lat.toFixed(4)}, ${lng.toFixed(4)}`; }
    $("#useLoc").addEventListener("click", () => {
      if (!navigator.geolocation) { $("#locNote").textContent = "Geolocation isn't available — tap the map instead."; return; }
      $("#locNote").textContent = "Locating…";
      navigator.geolocation.getCurrentPosition((pos) => { const { latitude, longitude } = pos.coords; lmap.setView([latitude, longitude], 15); setDraft(latitude, longitude); }, () => { $("#locNote").textContent = "Couldn't get your location — tap the map to drop a pin."; }, { enableHighAccuracy: true, timeout: 8000 });
    });
    const catClass = (c) => "cat-" + (c || "").toLowerCase().replace(/[^a-z]+/g, "-");
    async function refresh() {
      const list = await Store.sightings.list();
      $("#sCount").textContent = `${list.length} logged`; markers.clearLayers(); const bounds = [];
      list.forEach(s => { const p = s.plant_id && map[s.plant_id], title = p ? p.common : "Unknown plant";
        if (typeof s.lat === "number" && typeof s.lng === "number") { const mk = L.marker([s.lat, s.lng]).addTo(markers); mk.bindPopup(`<b>${title}</b><br>${s.category || ""}${s.place ? "<br>" + esc(s.place) : ""}${s.seen_on ? "<br>" + s.seen_on : ""}` + (p ? `<br><a href="${plantHref(p.id)}">View profile →</a>` : "")); bounds.push([s.lat, s.lng]); } });
      if (bounds.length) lmap.fitBounds(bounds, { padding: [40, 40], maxZoom: 13 });
      $("#sList").innerHTML = list.length ? list.map(s => { const p = s.plant_id && map[s.plant_id], sev = p ? sevBadge(p) : "";
        return `<div class="sight-card" data-lat="${s.lat ?? ""}" data-lng="${s.lng ?? ""}"><div class="sight-card__head"><div>
          <div class="sight-card__title">${p ? `<a href="${plantHref(p.id)}">${p.common}</a>` : "Unknown plant"}</div>${p ? `<div class="card__sci">${p.scientific}</div>` : ""}</div>${sev}</div>
          <div class="sight-card__meta"><span class="chip ${catClass(s.category)}">${s.category || "—"}</span>${s.seen_on ? `<span class="chip">${s.seen_on}</span>` : ""}${s.place ? `<span class="chip">📍 ${esc(s.place)}</span>` : ""}${(typeof s.lat === "number") ? `<button class="linkbtn show-on-map">show on map</button>` : ""}</div>
          ${s.notes ? `<p class="sight-card__notes">${esc(s.notes)}</p>` : ""}<button class="linkbtn danger del-btn" data-id="${s.id}">Delete</button></div>`; }).join("") : `<p class="note">No sightings yet. Fill in the form and save your first one.</p>`;
      $$("#sList .del-btn").forEach(b => b.addEventListener("click", async () => { await Store.sightings.remove(b.dataset.id); refresh(); }));
      $$("#sList .show-on-map").forEach(b => b.addEventListener("click", () => { const card = b.closest(".sight-card"), lat = parseFloat(card.dataset.lat), lng = parseFloat(card.dataset.lng); if (!isNaN(lat)) { lmap.setView([lat, lng], 15); window.scrollTo({ top: $(".map").offsetTop - 80, behavior: "smooth" }); } }));
    }
    $("#sightForm").addEventListener("submit", async (e) => {
      e.preventDefault(); const err = $("#sError"); err.setAttribute("hidden", "");
      const plantId = sel.value; if (!plantId) { err.textContent = "Pick a plant (or 'Unknown')."; err.removeAttribute("hidden"); return; }
      await Store.sightings.add({ plant_id: plantId === "unknown" ? null : plantId, category: $("#sCategory").value, seen_on: $("#sDate").value || null, place: $("#sPlace").value.trim() || null, lat: draft ? draft.lat : null, lng: draft ? draft.lng : null, notes: $("#sNotes").value.trim() || null });
      if (draftMarker) { lmap.removeLayer(draftMarker); draftMarker = null; } draft = null;
      $("#sNotes").value = ""; $("#sPlace").value = ""; $("#locNote").textContent = "…or tap the map to drop a pin"; refresh();
    });
    initMap(); await Store.init(); refresh();
  }

  async function initCollections() {
    const map = byId();
    function plantCard(p, removeLabel, attr) { return `<div class="card has-remove"><a href="${plantHref(p.id)}"><div class="card__plate"><canvas data-plant="${p.id}"></canvas><span class="card__sev">${sevBadge(p)}</span></div><div class="card__body"><span class="card__common">${p.common}</span><span class="card__sci">${p.scientific}</span></div></a><button class="card__remove" ${attr}>${removeLabel}</button></div>`; }
    async function renderFavorites() {
      const favs = await Store.favorites.list(), host = $("#favSection");
      host.innerHTML = `<div class="collection"><div class="collection__head"><h2>♥ Saved plants</h2><span class="count">${favs.length}</span></div>${favs.length ? `<div class="grid-plants">${favs.map(id => map[id] ? plantCard(map[id], "Remove", `data-fav="${id}"`) : "").join("")}</div>` : `<p class="note">No saved plants yet. Open any plant and tap <b>Save</b>.</p>`}</div>`;
      host.querySelectorAll("[data-fav]").forEach(b => b.addEventListener("click", async () => { await Store.favorites.remove(b.dataset.fav); renderFavorites(); }));
      renderPlates(host);
    }
    async function renderLists() {
      const cols = await Store.collections.list(), host = $("#lists");
      host.innerHTML = cols.length ? cols.map(c => `<div class="collection" data-col="${c.id}"><div class="collection__head"><h2 class="collection__name" contenteditable="true" data-rename="${c.id}">${esc(c.name)}</h2><span class="count">${c.items.length}</span><button class="linkbtn danger del-col" data-col="${c.id}">Delete list</button></div>${c.items.length ? `<div class="grid-plants">${c.items.map(id => map[id] ? plantCard(map[id], "Remove", `data-rm="${c.id}" data-pid="${id}"`) : "").join("")}</div>` : `<p class="note">Empty list. Open a plant and use <b>Add to list</b>.</p>`}</div>`).join("") : `<p class="note">No lists yet — create one above, or use <b>Add to list</b> on any plant.</p>`;
      host.querySelectorAll(".del-col").forEach(b => b.addEventListener("click", async () => { if (confirm("Delete this list? The plants stay in the catalog.")) { await Store.collections.remove(b.dataset.col); renderLists(); } }));
      host.querySelectorAll("[data-rm]").forEach(b => b.addEventListener("click", async () => { await Store.collections.removeItem(b.dataset.rm, b.dataset.pid); renderLists(); }));
      host.querySelectorAll("[data-rename]").forEach(el => { el.addEventListener("blur", async () => { const name = el.textContent.trim(); if (name) await Store.collections.rename(el.dataset.rename, name); }); el.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); el.blur(); } }); });
      renderPlates(host);
    }
    $("#createList").addEventListener("click", async () => { const name = $("#newListName").value.trim(); if (!name) return; await Store.collections.create(name); $("#newListName").value = ""; renderLists(); });
    await Store.init(); renderFavorites(); renderLists();
  }

  async function initAccount() {
    const dash = $("#dash"), hello = $("#hello");
    async function stats() { const [favs, notes, cols, sights] = await Promise.all([Store.favorites.list(), Store.notes.all(), Store.collections.list(), Store.sightings.list()]); return { favs: favs.length, notes: Object.keys(notes).length, cols: cols.length, sights: sights.length, raw: { favs, notes, cols, sights } }; }
    function statCards(s) { const items = [["Saved plants", s.favs, "#/collections"], ["Notes", s.notes, "#/collections"], ["Lists", s.cols, "#/collections"], ["Sightings", s.sights, "#/sightings"]]; return `<div class="stat-grid">${items.map(([k, v, href]) => `<a class="stat" href="${href}"><span class="stat__n">${v}</span><span class="stat__k">${k}</span></a>`).join("")}</div>`; }
    function exportBlock() { return `<div class="panel"><h3>Your data</h3><p class="note">Download everything you've saved as a JSON file, or clear it from this device.</p><div class="keyrow"><button class="btn btn--ghost" id="exportBtn">⬇ Export my data</button><button class="btn btn--ghost danger" id="clearBtn">Clear saved data</button></div></div>`; }
    function cloudPanel(user) { return `<div class="panel"><h3>Account</h3><div class="traitlist"><div class="row"><span class="k">Name</span><span>${esc(user.name) || "—"}</span></div><div class="row"><span class="k">Email</span><span>${esc(user.email) || "—"}</span></div><div class="row"><span class="k">Sync</span><span>On — saved to your account across devices</span></div></div><button class="btn btn--ghost" id="signOut2" style="margin-top:1rem">Sign out</button></div>`; }
    function guestPanel() { return `<div class="panel"><h3>You're in guest mode</h3><p>Your saves live in <b>this browser only</b>. That's fine for one device — but to sync to your phone and other computers, turn on free accounts:</p><ol class="steps"><li>Create a free project at <a href="https://supabase.com" target="_blank" rel="noopener">supabase.com</a>.</li><li>In <b>Project Settings → API</b>, copy your <b>Project URL</b> and <b>anon public key</b>.</li><li>Paste both into the app's config and run the included SQL to create the tables.</li><li>Reload — you'll get real sign-in, and everyone's data stays private via row-level security.</li></ol><button class="btn btn--ghost" id="nameBtn">Set display name</button></div>`; }
    async function render() {
      const user = Store.user(), cloud = Store.isCloud(), signedIn = cloud && user;
      hello.textContent = user && user.name ? `Hi, ${user.name}` : "Your dashboard";
      let s = { favs: 0, notes: 0, cols: 0, sights: 0, raw: {} };
      if (signedIn || !cloud) s = await stats();
      if (cloud && !user) { dash.innerHTML = `<div class="panel"><h3>Sign in to sync</h3><p>You have real accounts enabled. Sign in to see your saved plants, notes, lists and sightings on every device.</p><button class="btn" id="goSignIn">Sign in or create account</button></div>`; $("#goSignIn").addEventListener("click", () => openAuth("signin")); return; }
      dash.innerHTML = `${statCards(s)}${!cloud ? guestPanel() : cloudPanel(user)}${exportBlock()}`;
      $("#exportBtn")?.addEventListener("click", () => { const blob = new Blob([JSON.stringify({ exported: new Date().toISOString(), ...s.raw }, null, 2)], { type: "application/json" }); const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "poison-plant-finder-data.json"; a.click(); URL.revokeObjectURL(a.href); });
      $("#clearBtn")?.addEventListener("click", async () => { if (!confirm("Clear all saved plants, notes, lists and sightings from this device? This can't be undone.")) return; if (!Store.isCloud()) { Object.keys(localStorage).filter(k => k.startsWith("ppf_guest_")).forEach(k => localStorage.removeItem(k)); render(); } else { alert("To delete cloud data, remove items from Collections and Sightings, or delete your account in Supabase."); } });
      if (!cloud) $("#nameBtn")?.addEventListener("click", () => openAuth("guest"));
      if (cloud) $("#signOut2")?.addEventListener("click", () => Store.auth.signOut());
    }
    await Store.init(); render();
    if (!initAccount._sub) { initAccount._sub = true; Store.onChange(() => { if (document.getElementById("dash")) render(); }); }
  }

  /* ====================================================================== */
  /*  ROUTER                                                                 */
  /* ====================================================================== */
  function parseHash() {
    const raw = (location.hash || "#/").replace(/^#\/?/, "");
    const [path] = raw.split("?");
    const segs = path.split("/").filter(Boolean);
    return { view: segs[0] || "home", param: segs[1] || null };
  }
  function route() {
    const { view, param } = parseHash();
    const fn = views[view] || views.home;
    document.title = "Poison Plant Finder — identify dangerous plants for free";
    window.scrollTo(0, 0);
    fn(param);
    // active nav state
    const active = "#/" + (view === "home" ? "" : view);
    $$(".nav a[data-nav]").forEach(a => { a.toggleAttribute("aria-current", a.getAttribute("data-nav") === active); $(".nav")?.classList.remove("open"); });
  }

  /* ---- boot ---- */
  let _booted = false;
  function boot() {
    if (_booted) return; _booted = true;
    injectChrome();
    const main = document.createElement("main"); main.id = "app"; main.className = "app-main";
    $(".site-header").insertAdjacentElement("afterend", main);
    acctSlot = document.getElementById("acctSlot");
    Store.init().then(() => { Store.onChange(renderAccount); renderAccount(Store.user()); maybeBanner(); })
      .catch(() => { renderAccount(Store.user()); maybeBanner(); });
    window.addEventListener("hashchange", route);
    route();
    let rt; window.addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(() => renderPlates(), 200); });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
