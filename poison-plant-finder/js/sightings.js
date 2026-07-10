/* Sightings log: a form + a Leaflet/OpenStreetMap map. Save where you found a
   plant (GPS or pin), tag and date it, and review/delete past sightings. */
(function () {
  const byId = Object.fromEntries(PLANTS.map(p => [p.id, p]));
  let map, markers, draft = null, draftMarker = null;

  // populate plant select
  const sel = $("#sPlant");
  sel.innerHTML = `<option value="">— choose a plant —</option><option value="unknown">Unknown / not sure</option>` +
    PLANTS.slice().sort((a, b) => a.common.localeCompare(b.common))
      .map(p => `<option value="${p.id}">${p.common} (${p.scientific})</option>`).join("");
  const pre = params().get("plant");
  if (pre && byId[pre]) sel.value = pre;

  $("#sDate").value = new Date().toISOString().slice(0, 10);

  /* ---- map ---- */
  function initMap() {
    map = L.map("map").setView([39.5, -98.35], 4); // continental US default
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19, attribution: "© OpenStreetMap contributors",
    }).addTo(map);
    markers = L.layerGroup().addTo(map);
    map.on("click", (e) => setDraft(e.latlng.lat, e.latlng.lng));
  }

  function setDraft(lat, lng) {
    draft = { lat, lng };
    if (draftMarker) draftMarker.setLatLng([lat, lng]);
    else draftMarker = L.marker([lat, lng], { opacity: 0.7 }).addTo(map).bindPopup("New sighting here").openPopup();
    $("#locNote").textContent = `Pin set: ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  }

  $("#useLoc").addEventListener("click", () => {
    if (!navigator.geolocation) { $("#locNote").textContent = "Geolocation isn't available — tap the map instead."; return; }
    $("#locNote").textContent = "Locating…";
    navigator.geolocation.getCurrentPosition(
      (pos) => { const { latitude, longitude } = pos.coords; map.setView([latitude, longitude], 15); setDraft(latitude, longitude); },
      () => { $("#locNote").textContent = "Couldn't get your location — tap the map to drop a pin."; },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  });

  /* ---- list + markers ---- */
  function catClass(c) { return "cat-" + (c || "").toLowerCase().replace(/[^a-z]+/g, "-"); }

  async function refresh() {
    const list = await Store.sightings.list();
    $("#sCount").textContent = `${list.length} logged`;
    markers.clearLayers();
    const bounds = [];
    list.forEach(s => {
      const p = s.plant_id && byId[s.plant_id];
      const title = p ? p.common : "Unknown plant";
      if (typeof s.lat === "number" && typeof s.lng === "number") {
        const mk = L.marker([s.lat, s.lng]).addTo(markers);
        mk.bindPopup(`<b>${title}</b><br>${s.category || ""}${s.place ? "<br>" + escapeHtml(s.place) : ""}${s.seen_on ? "<br>" + s.seen_on : ""}` +
          (p ? `<br><a href="plant.html?id=${p.id}">View profile →</a>` : ""));
        bounds.push([s.lat, s.lng]);
      }
    });
    if (bounds.length) map.fitBounds(bounds, { padding: [40, 40], maxZoom: 13 });

    $("#sList").innerHTML = list.length ? list.map(s => {
      const p = s.plant_id && byId[s.plant_id];
      const sev = p ? sevBadge(p) : "";
      return `<div class="sight-card" data-lat="${s.lat ?? ""}" data-lng="${s.lng ?? ""}">
        <div class="sight-card__head">
          <div>
            <div class="sight-card__title">${p ? `<a href="plant.html?id=${p.id}">${p.common}</a>` : "Unknown plant"}</div>
            ${p ? `<div class="card__sci">${p.scientific}</div>` : ""}
          </div>
          ${sev}
        </div>
        <div class="sight-card__meta">
          <span class="chip ${catClass(s.category)}">${s.category || "—"}</span>
          ${s.seen_on ? `<span class="chip">${s.seen_on}</span>` : ""}
          ${s.place ? `<span class="chip">📍 ${escapeHtml(s.place)}</span>` : ""}
          ${(typeof s.lat === "number") ? `<button class="linkbtn show-on-map">show on map</button>` : ""}
        </div>
        ${s.notes ? `<p class="sight-card__notes">${escapeHtml(s.notes)}</p>` : ""}
        <button class="linkbtn danger del-btn" data-id="${s.id}">Delete</button>
      </div>`;
    }).join("") : `<p class="note">No sightings yet. Fill in the form and save your first one.</p>`;

    $$("#sList .del-btn").forEach(b => b.addEventListener("click", async () => {
      await Store.sightings.remove(b.dataset.id); refresh();
    }));
    $$("#sList .show-on-map").forEach(b => b.addEventListener("click", () => {
      const card = b.closest(".sight-card");
      const lat = parseFloat(card.dataset.lat), lng = parseFloat(card.dataset.lng);
      if (!isNaN(lat)) { map.setView([lat, lng], 15); window.scrollTo({ top: $(".map").offsetTop - 80, behavior: "smooth" }); }
    }));
  }

  /* ---- save ---- */
  $("#sightForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const err = $("#sError"); err.setAttribute("hidden", "");
    const plantId = sel.value;
    if (!plantId) { err.textContent = "Pick a plant (or 'Unknown')."; err.removeAttribute("hidden"); return; }
    const rec = {
      plant_id: plantId === "unknown" ? null : plantId,
      category: $("#sCategory").value,
      seen_on: $("#sDate").value || null,
      place: $("#sPlace").value.trim() || null,
      lat: draft ? draft.lat : null,
      lng: draft ? draft.lng : null,
      notes: $("#sNotes").value.trim() || null,
    };
    await Store.sightings.add(rec);
    // reset draft + form bits
    if (draftMarker) { map.removeLayer(draftMarker); draftMarker = null; } draft = null;
    $("#sNotes").value = ""; $("#sPlace").value = ""; $("#locNote").textContent = "…or tap the map to drop a pin";
    refresh();
  });

  function escapeHtml(s) { return (s || "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])); }

  document.addEventListener("DOMContentLoaded", async () => {
    initMap();
    await Store.init();
    refresh();
    Store.onChange(refresh);
  });
})();
