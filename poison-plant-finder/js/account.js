/* Account dashboard: greeting, stats, account actions, and (in guest mode)
   instructions for turning on real cross-device accounts. */
(function () {
  const dash = $("#dash"), hello = $("#hello");

  async function stats() {
    const [favs, notes, cols, sights] = await Promise.all([
      Store.favorites.list(), Store.notes.all(), Store.collections.list(), Store.sightings.list(),
    ]);
    return { favs: favs.length, notes: Object.keys(notes).length, cols: cols.length, sights: sights.length, raw: { favs, notes, cols, sights } };
  }

  function statCards(s) {
    const items = [["Saved plants", s.favs, "collections.html"], ["Notes", s.notes, "collections.html"],
                   ["Lists", s.cols, "collections.html"], ["Sightings", s.sights, "sightings.html"]];
    return `<div class="stat-grid">${items.map(([k, v, href]) =>
      `<a class="stat" href="${href}"><span class="stat__n">${v}</span><span class="stat__k">${k}</span></a>`).join("")}</div>`;
  }

  function exportBlock() {
    return `<div class="panel">
      <h3>Your data</h3>
      <p class="note">Download everything you've saved as a JSON file, or clear it from this device.</p>
      <div class="keyrow">
        <button class="btn btn--ghost" id="exportBtn">⬇ Export my data</button>
        <button class="btn btn--ghost danger" id="clearBtn">Clear saved data</button>
      </div>
    </div>`;
  }

  async function render() {
    const user = Store.user();
    const cloud = Store.isCloud();
    const signedIn = cloud && user;
    hello.textContent = user && user.name ? `Hi, ${user.name}` : "Your dashboard";

    let s = { favs: 0, notes: 0, cols: 0, sights: 0, raw: {} };
    if (signedIn || !cloud) s = await stats();

    if (cloud && !user) {
      dash.innerHTML = `
        <div class="panel">
          <h3>Sign in to sync</h3>
          <p>You have real accounts enabled. Sign in to see your saved plants, notes, lists and sightings on every device.</p>
          <button class="btn" id="goSignIn">Sign in or create account</button>
        </div>`;
      $("#goSignIn").addEventListener("click", () => openAuth("signin"));
      return;
    }

    dash.innerHTML = `
      ${statCards(s)}
      ${!cloud ? guestPanel() : cloudPanel(user)}
      ${exportBlock()}`;

    wireExport(s);
    if (!cloud) $("#nameBtn")?.addEventListener("click", () => openAuth("guest"));
    if (cloud) $("#signOut2")?.addEventListener("click", () => Store.auth.signOut());
  }

  function cloudPanel(user) {
    return `<div class="panel">
      <h3>Account</h3>
      <div class="traitlist">
        <div class="row"><span class="k">Name</span><span>${user.name || "—"}</span></div>
        <div class="row"><span class="k">Email</span><span>${user.email || "—"}</span></div>
        <div class="row"><span class="k">Sync</span><span>On — saved to your account across devices</span></div>
      </div>
      <button class="btn btn--ghost" id="signOut2" style="margin-top:1rem">Sign out</button>
    </div>`;
  }

  function guestPanel() {
    return `<div class="panel">
      <h3>You're in guest mode</h3>
      <p>Your saves live in <b>this browser only</b>. That's fine for one device — but to sync to your phone and
        other computers, turn on free accounts:</p>
      <ol class="steps">
        <li>Create a free project at <a href="https://supabase.com" target="_blank" rel="noopener">supabase.com</a>.</li>
        <li>In <b>Project Settings → API</b>, copy your <b>Project URL</b> and <b>anon public key</b>.</li>
        <li>Paste both into <code>js/config.js</code> and run the SQL in <code>supabase-schema.sql</code>
            (Supabase → SQL Editor) to create the tables.</li>
        <li>Reload — you'll get real sign-in, and everyone's data stays private via row-level security.</li>
      </ol>
      <button class="btn btn--ghost" id="nameBtn">Set display name</button>
    </div>`;
  }

  function wireExport(s) {
    $("#exportBtn")?.addEventListener("click", () => {
      const blob = new Blob([JSON.stringify({ exported: new Date().toISOString(), ...s.raw }, null, 2)], { type: "application/json" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob); a.download = "poison-plant-finder-data.json"; a.click();
      URL.revokeObjectURL(a.href);
    });
    $("#clearBtn")?.addEventListener("click", async () => {
      if (!confirm("Clear all saved plants, notes, lists and sightings from this device? This can't be undone.")) return;
      if (!Store.isCloud()) {
        Object.keys(localStorage).filter(k => k.startsWith("ppf_guest_")).forEach(k => localStorage.removeItem(k));
        location.reload();
      } else {
        alert("To delete cloud data, remove items from Collections and Sightings, or delete your account in Supabase.");
      }
    });
  }

  document.addEventListener("DOMContentLoaded", async () => {
    await Store.init();
    render();
    Store.onChange(render);
  });
})();
