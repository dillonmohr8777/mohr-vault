/* Collections page: favorites + user-defined lists of plants. */
(function () {
  const byId = Object.fromEntries(PLANTS.map(p => [p.id, p]));

  function plantCard(p, removeLabel, onRemoveAttr) {
    return `<div class="card has-remove">
      <a href="plant.html?id=${p.id}">
        <div class="card__plate"><canvas data-plant="${p.id}"></canvas><span class="card__sev">${sevBadge(p)}</span></div>
        <div class="card__body"><span class="card__common">${p.common}</span>
          <span class="card__sci">${p.scientific}</span></div></a>
      <button class="card__remove" ${onRemoveAttr}>${removeLabel}</button>
    </div>`;
  }

  async function renderFavorites() {
    const favs = await Store.favorites.list();
    const host = $("#favSection");
    host.innerHTML = `
      <div class="collection">
        <div class="collection__head">
          <h2>♥ Saved plants</h2><span class="count">${favs.length}</span>
        </div>
        ${favs.length
          ? `<div class="grid-plants">${favs.map(id => byId[id] ? plantCard(byId[id], "Remove", `data-fav="${id}"`) : "").join("")}</div>`
          : `<p class="note">No saved plants yet. Open any plant and tap <b>Save</b>.</p>`}
      </div>`;
    host.querySelectorAll("[data-fav]").forEach(b => b.addEventListener("click", async () => {
      await Store.favorites.remove(b.dataset.fav); renderFavorites();
    }));
    renderPlates();
  }

  async function renderLists() {
    const cols = await Store.collections.list();
    const host = $("#lists");
    host.innerHTML = cols.length ? cols.map(c => `
      <div class="collection" data-col="${c.id}">
        <div class="collection__head">
          <h2 class="collection__name" contenteditable="true" data-rename="${c.id}">${escapeHtml(c.name)}</h2>
          <span class="count">${c.items.length}</span>
          <button class="linkbtn danger del-col" data-col="${c.id}">Delete list</button>
        </div>
        ${c.items.length
          ? `<div class="grid-plants">${c.items.map(id => byId[id] ? plantCard(byId[id], "Remove", `data-rm="${c.id}" data-pid="${id}"`) : "").join("")}</div>`
          : `<p class="note">Empty list. Open a plant and use <b>Add to list</b>.</p>`}
      </div>`).join("") : `<p class="note">No lists yet — create one above, or use <b>Add to list</b> on any plant.</p>`;

    host.querySelectorAll(".del-col").forEach(b => b.addEventListener("click", async () => {
      if (confirm("Delete this list? The plants stay in the catalog.")) { await Store.collections.remove(b.dataset.col); renderLists(); }
    }));
    host.querySelectorAll("[data-rm]").forEach(b => b.addEventListener("click", async () => {
      await Store.collections.removeItem(b.dataset.rm, b.dataset.pid); renderLists();
    }));
    host.querySelectorAll("[data-rename]").forEach(el => {
      el.addEventListener("blur", async () => {
        const name = el.textContent.trim();
        if (name) await Store.collections.rename(el.dataset.rename, name);
      });
      el.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); el.blur(); } });
    });
    renderPlates();
  }

  $("#createList").addEventListener("click", async () => {
    const name = $("#newListName").value.trim();
    if (!name) return;
    await Store.collections.create(name);
    $("#newListName").value = "";
    renderLists();
  });

  function escapeHtml(s) { return (s || "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])); }

  document.addEventListener("DOMContentLoaded", async () => {
    await Store.init();
    renderFavorites(); renderLists();
    Store.onChange(() => { renderFavorites(); renderLists(); });
  });
})();
