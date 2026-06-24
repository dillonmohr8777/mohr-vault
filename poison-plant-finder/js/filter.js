/* Trait filter: build checkbox groups from the controlled vocab, then match
   plants. Within a group the selected values are OR'd; across groups they're
   AND'd. Single-value traits (veins, arrangement) check membership; array
   traits (flowerColor, sun, water) check for any overlap. */
(function () {
  const groups = {
    veins:       { key: "veins",       multi: false, el: "#g-veins" },
    arrangement: { key: "arrangement", multi: false, el: "#g-arrangement" },
    flowerColor: { key: "flowerColor", multi: true,  el: "#g-flowerColor" },
    sun:         { key: "sun",         multi: true,  el: "#g-sun" },
    water:       { key: "water",       multi: true,  el: "#g-water" },
  };

  // build checkboxes
  Object.values(groups).forEach(g => {
    const host = $(g.el);
    VOCAB[g.key].forEach(val => {
      const id = `f-${g.key}-${val.replace(/[^a-z0-9]/gi, "")}`;
      const label = document.createElement("label");
      label.className = "opt";
      label.innerHTML = `<input type="checkbox" value="${val}" data-group="${g.key}" id="${id}" /> ${val}`;
      host.appendChild(label);
    });
  });

  const grid = $("#grid"), countEl = $("#count"), emptyEl = $("#empty"), summary = $("#summary");

  function selected(groupKey) {
    return $$(`input[data-group="${groupKey}"]:checked`).map(i => i.value);
  }

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
    const sel = {
      veins: selected("veins"), arrangement: selected("arrangement"),
      flowerColor: selected("flowerColor"), sun: selected("sun"), water: selected("water"),
    };
    const touch = $("#x-touch").checked, invasive = $("#x-invasive").checked;
    const anyChosen = Object.values(sel).some(a => a.length) || touch || invasive;

    let list = PLANTS.filter(p => {
      const t = p.traits;
      if (sel.veins.length && !sel.veins.includes(t.veins)) return false;
      if (sel.arrangement.length && !sel.arrangement.includes(t.arrangement)) return false;
      if (sel.flowerColor.length && !sel.flowerColor.some(v => (t.flowerColor || []).includes(v))) return false;
      if (sel.sun.length && !sel.sun.some(v => (t.sun || []).includes(v))) return false;
      if (sel.water.length && !sel.water.some(v => (t.water || []).includes(v))) return false;
      if (touch && !p.contactHazard) return false;
      if (invasive && !/invasive/i.test(p.invasive.status)) return false;
      return true;
    });
    list.sort((a, b) => (b.severity - a.severity) || a.common.localeCompare(b.common));

    grid.innerHTML = list.map(cardHTML).join("");
    countEl.textContent = `${list.length} of ${PLANTS.length}`;
    summary.textContent = anyChosen ? (list.length ? "Possible matches" : "No matches") : "All plants";
    emptyEl.classList.toggle("hidden", list.length > 0);
    renderPlates(); initReveal();
  }

  $("#filters").addEventListener("change", apply);
  function reset() { $$("#filters input[type=checkbox]").forEach(i => i.checked = false); apply(); }
  $("#reset").addEventListener("click", reset);
  $("#clear")?.addEventListener("click", (e) => { e.preventDefault(); reset(); });

  apply();
})();
