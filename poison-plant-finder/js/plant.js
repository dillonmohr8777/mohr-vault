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
})();
