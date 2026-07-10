/* Photo identification via the Pl@ntNet API (user supplies a free key, stored
   in localStorage). Results are cross-referenced against our poison database so
   a dangerous match is flagged with a direct link to its profile. */
(function () {
  const LS_KEY = "ppf_plantnet_key";
  const apiKeyInput = $("#apiKey"), keyStatus = $("#keyStatus");
  const drop = $("#drop"), fileInput = $("#file");
  const preview = $("#preview"), previewImg = $("#previewImg");
  const identifyBtn = $("#identifyBtn"), statusEl = $("#status"), resultsEl = $("#results");
  let currentFile = null;

  /* ---- API key handling ---- */
  function refreshKeyUI() {
    const key = localStorage.getItem(LS_KEY);
    if (key) {
      keyStatus.innerHTML = "✓ Key saved in this browser. You're ready to identify.";
      $("#clearKey").classList.remove("hidden");
      apiKeyInput.value = "";
      apiKeyInput.placeholder = "Key saved — paste a new one to replace";
    } else {
      keyStatus.textContent = "No key saved yet. The trait filter still works without one.";
      $("#clearKey").classList.add("hidden");
    }
  }
  $("#saveKey").addEventListener("click", () => {
    const v = apiKeyInput.value.trim();
    if (!v) { keyStatus.textContent = "Paste a key first, or use the trait filter."; return; }
    localStorage.setItem(LS_KEY, v); refreshKeyUI();
  });
  $("#clearKey").addEventListener("click", () => { localStorage.removeItem(LS_KEY); refreshKeyUI(); });
  refreshKeyUI();

  /* ---- file selection ---- */
  function setFile(f) {
    if (!f || !f.type.startsWith("image/")) return;
    currentFile = f;
    previewImg.src = URL.createObjectURL(f);
    preview.classList.remove("hidden");
    resultsEl.innerHTML = ""; statusEl.innerHTML = "";
  }
  drop.addEventListener("click", () => fileInput.click());
  drop.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); fileInput.click(); } });
  fileInput.addEventListener("change", (e) => setFile(e.target.files[0]));
  ["dragover", "dragenter"].forEach(ev => drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.add("drag"); }));
  ["dragleave", "drop"].forEach(ev => drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.remove("drag"); }));
  drop.addEventListener("drop", (e) => setFile(e.dataTransfer.files[0]));

  /* ---- match a scientific name to our database ---- */
  function normName(s) { return (s || "").toLowerCase().replace(/[^a-z ]/g, " ").replace(/\s+/g, " ").trim(); }
  function plantCandidates(p) {
    // build a set of "genus species" and "genus" tokens from p.scientific (may hold "A / B" or "Genus spp.")
    const out = new Set();
    p.scientific.split("/").forEach(part => {
      const words = normName(part).split(" ").filter(Boolean);
      if (words[0]) out.add(words[0]);                       // genus
      if (words[1] && words[1] !== "spp") out.add(words[0] + " " + words[1]); // binomial
    });
    return out;
  }
  function findMatch(sciName) {
    const n = normName(sciName);
    const words = n.split(" ");
    const genus = words[0], binom = words.slice(0, 2).join(" ");
    for (const p of PLANTS) {
      const cands = plantCandidates(p);
      if (cands.has(binom)) return { plant: p, exact: true };
    }
    for (const p of PLANTS) {
      const cands = plantCandidates(p);
      if (cands.has(genus)) return { plant: p, exact: false };
    }
    return null;
  }

  /* ---- identify ---- */
  identifyBtn.addEventListener("click", async () => {
    const key = localStorage.getItem(LS_KEY);
    if (!key) { statusEl.innerHTML = `<p class="emergency-note">Save your free Pl@ntNet key above first, or <a href="filter.html">use the trait filter</a>.</p>`; return; }
    if (!currentFile) return;

    statusEl.innerHTML = `<div class="keyrow"><span class="spinner"></span><span class="note">Identifying… checking the Pl@ntNet database</span></div>`;
    resultsEl.innerHTML = "";

    const organ = $("#organ").value;
    const form = new FormData();
    form.append("images", currentFile);
    form.append("organs", organ === "auto" ? "auto" : organ);

    try {
      const res = await fetch(`https://my-api.plantnet.org/v2/identify/all?api-key=${encodeURIComponent(key)}`, { method: "POST", body: form });
      if (!res.ok) {
        const msg = res.status === 401 || res.status === 403 ? "That key was rejected. Check it at my.plantnet.org and save it again."
          : res.status === 404 ? "Pl@ntNet couldn't recognize a plant in that photo. Try a clearer leaf or flower shot."
          : res.status === 429 ? "Daily free limit reached on this key. Try again tomorrow, or use the trait filter."
          : `Pl@ntNet returned an error (${res.status}).`;
        statusEl.innerHTML = `<p class="emergency-note">${msg}</p>`;
        return;
      }
      const data = await res.json();
      renderResults(data.results || []);
    } catch (err) {
      statusEl.innerHTML = `<p class="emergency-note">Couldn't reach Pl@ntNet (network or browser block).
        You can still <a href="filter.html">identify by traits</a>. Technical detail: ${err.message}</p>`;
    }
  });

  function renderResults(results) {
    if (!results.length) {
      statusEl.innerHTML = `<p class="emergency-note">No confident match. Try a sharper photo of a single leaf or flower, or <a href="filter.html">identify by traits</a>.</p>`;
      return;
    }
    const top = results.slice(0, 5);
    let dangerFound = null;
    const rows = top.map(r => {
      const sci = r.species?.scientificNameWithoutAuthor || r.species?.scientificName || "Unknown";
      const common = (r.species?.commonNames || [])[0] || "";
      const score = Math.round((r.score || 0) * 100);
      const m = findMatch(sci);
      if (m && !dangerFound) dangerFound = m;
      if (m) {
        return `<a class="result-row match" href="plant.html?id=${m.plant.id}">
          <div><strong>${m.plant.common}</strong> — <span class="serif-italic">${sci}</span>
            ${common ? `<br><span class="note">also called ${common}</span>` : ""}
            <br>${sevBadge(m.plant)} ${m.exact ? "" : `<span class="note">(genus match — confirm species)</span>`}</div>
          <span class="score">${score}%</span></a>`;
      }
      return `<div class="result-row">
        <div><strong>${common || sci}</strong> ${common ? `<br><span class="serif-italic note">${sci}</span>` : ""}
          <br><span class="note">Not in our poison database.</span></div>
        <span class="score">${score}%</span></div>`;
    }).join("");

    statusEl.innerHTML = dangerFound
      ? `<p class="emergency-note">⚠ A possible match is in our poison list: <strong>${dangerFound.plant.common}</strong>.
         Open it to see the danger profile — and never touch or taste a plant on the strength of a photo alone.</p>`
      : `<p class="note">No clear match to a known poisonous plant — but that's not a guarantee of safety.
         Compare with the <a href="catalog.html">catalog</a> and look-alikes before handling anything.</p>`;
    resultsEl.innerHTML = `<p class="note">Top Pl@ntNet matches (highest confidence first):</p>` + rows;
  }
})();
