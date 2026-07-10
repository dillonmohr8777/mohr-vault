/* Catalog page: live search, filter and sort over the plant list. */
(function () {
  const grid = $("#grid"), countEl = $("#count"), emptyEl = $("#empty");
  const search = $("#search"), sevSel = $("#sev"), flagSel = $("#flag"), sortSel = $("#sort");

  function cardHTML(p) {
    return `<a class="card reveal" href="plant.html?id=${p.id}">
      <div class="card__plate"><canvas data-plant="${p.id}"></canvas>
        <span class="card__sev">${sevBadge(p)}</span></div>
      <div class="card__body">
        <span class="card__common">${p.common}</span>
        <span class="card__sci">${p.scientific}</span>
        <div class="card__meta">${invasiveBadge(p)}${contactBadge(p)}</div>
      </div></a>`;
  }

  function apply() {
    const q = search.value.trim().toLowerCase();
    const sev = sevSel.value, flag = flagSel.value, sort = sortSel.value;
    let list = PLANTS.filter(p => {
      if (sev && String(p.severity) !== sev) return false;
      if (flag === "touch" && !p.contactHazard) return false;
      if (flag === "invasive" && !/invasive/i.test(p.invasive.status)) return false;
      if (q) {
        const hay = (p.common + " " + p.scientific + " " + (p.aka || []).join(" ")).toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
    list.sort((a, b) => sort === "az" ? a.common.localeCompare(b.common) : (b.severity - a.severity) || a.common.localeCompare(b.common));

    grid.innerHTML = list.map(cardHTML).join("");
    countEl.textContent = `${list.length} of ${PLANTS.length} plants`;
    emptyEl.classList.toggle("hidden", list.length > 0);
    renderPlates(); initReveal();
  }

  [search, sevSel, flagSel, sortSel].forEach(el => el.addEventListener("input", apply));
  $("#clear")?.addEventListener("click", (e) => { e.preventDefault(); search.value = ""; sevSel.value = ""; flagSel.value = ""; apply(); });

  // honor ?sev= or ?q= from links
  const p = params();
  if (p.get("sev")) sevSel.value = p.get("sev");
  if (p.get("q")) search.value = p.get("q");
  document.addEventListener("DOMContentLoaded", apply);
  if (document.readyState !== "loading") apply();
})();
