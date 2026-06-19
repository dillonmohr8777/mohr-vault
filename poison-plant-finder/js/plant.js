/* Plant detail page: render one plant as a herbarium specimen sheet. */
(function () {
  const id = params().get("id");
  const p = (window.PLANTS || []).find(x => x.id === id);
  const host = document.getElementById("plant");

  if (!p) {
    host.innerHTML = `<h1>Plant not found</h1>
      <p class="muted">We couldn't find that plant. <a href="catalog.html">Browse all plants →</a></p>`;
    return;
  }
  document.title = `${p.common} (${p.scientific}) — Poison Plant Finder`;

  const t = p.traits, d = p.danger, rem = p.removal;
  const sev = severityOf(p);
  const aka = (p.aka && p.aka.length) ? ` · also called ${p.aka.join(", ")}` : "";

  const removeClass = rem.shouldRemove ? "do-remove" : "";
  const verdict = rem.shouldRemove
    ? `🚩 Yes — remove this plant`
    : `Usually leave it — but handle with care`;

  host.innerHTML = `
    <div class="specimen">
      <aside class="specimen__plate">
        <canvas data-plant="${p.id}"></canvas>
        <div class="specimen__taxon">
          <span><b>Family</b> ${p.family}</span>
          <span><b>Scientific</b> <span class="serif-italic">${p.scientific}</span></span>
          <span><b>Severity</b> ${p.severity} of 5 — ${sev.label}</span>
        </div>
      </aside>

      <div class="detail-body">
        <div class="detail-head">
          <span class="eyebrow">Specimen profile</span>
          <h1>${p.common}</h1>
          <div class="detail-sci">${p.scientific}<span class="muted" style="font-style:normal;font-family:var(--body);font-size:.9rem">${aka}</span></div>
          <div class="detail-badges">
            ${sevBadge(p)} ${invasiveBadge(p)} ${contactBadge(p)}
          </div>
          <div class="user-actions" id="userActions">
            <button class="action-btn" id="favBtn" aria-pressed="false"><span class="ic">♡</span> <span class="lbl">Save</span></button>
            <div class="list-dd">
              <button class="action-btn" id="listBtn" aria-haspopup="true" aria-expanded="false"><span class="ic">＋</span> Add to list</button>
              <div class="list-pop" id="listPop" hidden></div>
            </div>
            <a class="action-btn" id="sightBtn" href="sightings.html?plant=${p.id}"><span class="ic">📍</span> Log a sighting</a>
          </div>
        </div>

        <!-- SHOULD YOU REMOVE IT -->
        <div class="callout-remove ${removeClass}">
          <div class="verdict">${verdict}</div>
          <p>${rem.urgency}</p>
          <dl>
            <div><dt>How to remove safely</dt><dd>${rem.method}</dd></div>
            <div><dt>Precautions</dt><dd>${rem.precautions}</dd></div>
            <div><dt>Disposal</dt><dd>${rem.disposal}</dd></div>
          </dl>
        </div>

        <!-- WHERE IT GROWS -->
        <div class="panel">
          <h3>Where it grows</h3>
          <div class="traitlist">
            <div class="row"><span class="k">Native to</span><span>${p.native}</span></div>
            <div class="row"><span class="k">Status</span><span>${p.invasive.status} — ${p.invasive.regions}</span></div>
            <div class="row"><span class="k">Climate</span><span>${t.climate}</span></div>
          </div>
        </div>

        <!-- HOW TO IDENTIFY -->
        <div class="panel">
          <h3>How to identify it</h3>
          <p>${t.leaf}</p>
          <div class="traitlist">
            <div class="row"><span class="k">Vein pattern</span><span>${t.veins} — ${t.veinNote}</span></div>
            <div class="row"><span class="k">Arrangement</span><span>${t.arrangement}</span></div>
            <div class="row"><span class="k">Flowers</span><span>${t.flower}</span></div>
            <div class="row"><span class="k">Sunlight</span><span>${(t.sun || []).join(", ")}</span></div>
            <div class="row"><span class="k">Water</span><span>${(t.water || []).join(", ")}</span></div>
            <div class="row"><span class="k">Look-alikes</span><span>${t.lookalikes}</span></div>
          </div>
        </div>

        <!-- DANGER PROFILE -->
        <div class="panel">
          <h3>Why it's dangerous</h3>
          <div class="danger-grid">
            <div class="danger-row"><span class="k">If eaten</span><span>${d.ingest}</span></div>
            <div class="danger-row"><span class="k">On skin</span><span>${d.skin}</span></div>
            <div class="danger-row"><span class="k">In eyes</span><span>${d.eyes}</span></div>
            <div class="danger-row"><span class="k">Animals</span><span>${d.animals}</span></div>
            <div class="danger-row"><span class="k">Allergy / anaphylaxis</span><span>${d.anaphylaxis}</span></div>
          </div>
        </div>

        <!-- YOUR NOTES -->
        <div class="panel notebook">
          <h3>Your notes</h3>
          <textarea id="noteBox" class="notebox" placeholder="Private notes — where you've seen it, how you removed it, reminders for next season…"></textarea>
          <span class="note save-status" id="noteStatus"></span>
        </div>

        <!-- FIRST AID -->
        <div class="panel">
          <h3>If you're exposed — first aid</h3>
          <p class="firstaid">${p.firstAid}</p>
          <p class="emergency-note">${p.emergency}<br>US Poison Control: <strong>1-800-222-1222</strong> · Emergency: <strong>911</strong></p>
        </div>

        <p class="note">This profile is for education and is not medical advice. Identification is hard and
          look-alikes are common — when in doubt, treat the plant as dangerous and check with Poison Control,
          a doctor, or a vet.</p>
      </div>
    </div>`;

  renderPlates(); initReveal();

  /* ---- interactive notebook (favorite / lists / notes) ---------------- */
  function debounce(fn, ms) { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; }

  async function setupControls() {
    await Store.init();
    const favBtn = document.getElementById("favBtn");
    const noteBox = document.getElementById("noteBox");
    const noteStatus = document.getElementById("noteStatus");

    // favorite
    async function refreshFav() {
      const favs = await Store.favorites.list();
      const on = favs.includes(p.id);
      favBtn.classList.toggle("on", on);
      favBtn.setAttribute("aria-pressed", String(on));
      favBtn.querySelector(".ic").textContent = on ? "♥" : "♡";
      favBtn.querySelector(".lbl").textContent = on ? "Saved" : "Save";
    }
    favBtn.addEventListener("click", async () => {
      const favs = await Store.favorites.list();
      if (favs.includes(p.id)) await Store.favorites.remove(p.id); else await Store.favorites.add(p.id);
      refreshFav();
    });

    // notes
    async function loadNote() { noteBox.value = await Store.notes.get(p.id); }
    const saveNote = debounce(async () => {
      await Store.notes.set(p.id, noteBox.value.trim());
      noteStatus.textContent = "Saved ✓";
      setTimeout(() => { noteStatus.textContent = ""; }, 1500);
    }, 600);
    noteBox.addEventListener("input", () => { noteStatus.textContent = "Saving…"; saveNote(); });

    // add to list
    const listBtn = document.getElementById("listBtn"), listPop = document.getElementById("listPop");
    async function renderLists() {
      const cols = await Store.collections.list();
      listPop.innerHTML =
        (cols.length ? cols.map(c => `
          <label class="list-opt"><input type="checkbox" data-col="${c.id}" ${c.items.includes(p.id) ? "checked" : ""}/> ${escapeHtml(c.name)}</label>`).join("")
          : `<p class="note" style="padding:.3rem .2rem">No lists yet.</p>`) +
        `<div class="list-new"><input class="field" id="newListName" placeholder="New list name" /><button class="btn" id="newListBtn">Create</button></div>`;
      listPop.querySelectorAll("input[data-col]").forEach(cb => cb.addEventListener("change", async () => {
        if (cb.checked) await Store.collections.addItem(cb.dataset.col, p.id);
        else await Store.collections.removeItem(cb.dataset.col, p.id);
      }));
      document.getElementById("newListBtn").addEventListener("click", async () => {
        const name = document.getElementById("newListName").value.trim();
        if (!name) return;
        const col = await Store.collections.create(name);
        await Store.collections.addItem(col.id, p.id);
        renderLists();
      });
    }
    listBtn.addEventListener("click", async () => {
      const open = listPop.hasAttribute("hidden");
      if (open) await renderLists();
      listPop.toggleAttribute("hidden", !open);
      listBtn.setAttribute("aria-expanded", String(open));
    });
    document.addEventListener("click", (e) => {
      if (!listPop.hasAttribute("hidden") && !e.target.closest(".list-dd")) {
        listPop.setAttribute("hidden", ""); listBtn.setAttribute("aria-expanded", "false");
      }
    });

    await Promise.all([refreshFav(), loadNote()]);
    // re-sync when the user signs in/out
    Store.onChange(() => { refreshFav(); loadNote(); });
  }
  function escapeHtml(s) { return (s || "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])); }
  setupControls();
})();
