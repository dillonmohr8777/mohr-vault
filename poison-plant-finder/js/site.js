/* ============================================================================
   POISON PLANT FINDER — shared site behavior
   - injects header, poison-control banner, disclaimer + footer
   - draws procedural botanical "plates" on <canvas> so every plant has a
     distinct field-guide illustration with no image files to host
   - small helpers used by every page
   ========================================================================== */

const PC_PHONE = "1-800-222-1222"; // US Poison Help line

/* ---- tiny helpers ------------------------------------------------------- */
const $  = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const params = () => new URLSearchParams(location.search);
function severityOf(p) { return (window.SEVERITY || {})[p.severity] || { label: "—", tag: "" }; }

/* deterministic RNG so each plant's plate is stable across reloads */
function seedFrom(str) { let h = 2166136261; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
function rng(seed) { let s = seed || 1; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }

/* ---- chrome injection --------------------------------------------------- */
const LEAF_MARK = `<svg class="mark" viewBox="0 0 32 32" aria-hidden="true">
  <path d="M16 2C9 7 4 13 4 21c0 5 4 9 9 9 9 0 15-9 15-19 0-3-1-6-2-9-4 3-7 4-10 4z" fill="#3F5E45"/>
  <path d="M16 6c-2 6-3 14-3 22" fill="none" stroke="#E2DAC4" stroke-width="1.4" stroke-linecap="round"/>
  <path d="M13 16c2-1 4-2 7-2M13 22c2-1 3-2 6-3" fill="none" stroke="#E2DAC4" stroke-width="1.1" stroke-linecap="round"/>
</svg>`;

function injectChrome() {
  const page = document.body.dataset.page || "";
  const nav = [
    ["index.html", "Home"],
    ["identify.html", "Photo ID"],
    ["filter.html", "By traits"],
    ["catalog.html", "All plants"],
  ];
  const navHTML = nav.map(([href, label]) => {
    const file = href.split("/").pop().replace(".html", "");
    const cur = (page === file) ? ' aria-current="page"' : "";
    return `<a href="${href}"${cur}>${label}</a>`;
  }).join("");

  const header = document.createElement("div");
  header.innerHTML = `
    <div class="pc-banner">
      Plant emergency? In the US call <strong>Poison Control ${PC_PHONE}</strong> ·
      life-threatening symptoms → call <strong>911</strong>
    </div>
    <header class="site-header">
      <div class="wrap">
        <a class="brand" href="index.html">${LEAF_MARK}<span>Poison&nbsp;Plant&nbsp;Finder</span></a>
        <button class="nav-toggle" aria-label="Menu" aria-expanded="false">Menu</button>
        <nav class="nav">${navHTML}</nav>
      </div>
    </header>`;
  document.body.prepend(header);

  const toggle = $(".nav-toggle");
  toggle.addEventListener("click", () => {
    const n = $(".nav");
    const open = n.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });

  const footer = document.createElement("div");
  footer.innerHTML = `
    <section class="disclaimer">
      <div class="wrap">
        <strong>Educational use only — not medical advice.</strong>
        Plant identification is hard and look-alikes are common, so never rely on this site
        to decide whether something is safe to touch, eat, or feed to an animal. If exposure
        is possible, contact Poison Control (US ${PC_PHONE}), a doctor, or a vet. When unsure,
        treat an unknown plant as dangerous and don't touch it.
      </div>
    </section>
    <footer class="site-footer">
      <div class="wrap">
        <span>Poison Plant Finder — a free field guide to dangerous plants.</span>
        <span class="mono">Poison Control (US): ${PC_PHONE} · Emergency: 911</span>
      </div>
    </footer>`;
  document.body.append(footer);
}

/* ---- reveal on scroll --------------------------------------------------- */
function initReveal() {
  const els = $$(".reveal");
  if (!els.length || !("IntersectionObserver" in window)) { els.forEach(e => e.classList.add("in")); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { threshold: .12 });
  els.forEach(e => io.observe(e));
}

/* ---- badge builders ----------------------------------------------------- */
function sevBadge(p) {
  const s = severityOf(p);
  return `<span class="badge-sev sev-${p.severity}">${p.severity} · ${s.label}</span>`;
}
function invasiveBadge(p) {
  return `<span class="badge-invasive">${p.invasive.status}</span>`;
}
function contactBadge(p) {
  return p.contactHazard ? `<span class="badge-contact">⚠ harmful to touch</span>` : "";
}

/* ---- procedural botanical plate ---------------------------------------- */
const FLOWER_HEX = {
  "White": "#F3EEE0", "Yellow": "#D9B53C", "Pink / Purple": "#9C6CA0",
  "Red / Orange": "#B5562A", "Green / none": "#7E8B5E",
};

function drawPlate(canvas, plant) {
  const ctx = canvas.getContext("2d");
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const rect = canvas.getBoundingClientRect();
  const W = Math.max(rect.width, 240), H = Math.max(rect.height, W * 1.25 / 1);
  canvas.width = W * dpr; canvas.height = H * dpr;
  ctx.scale(dpr, dpr);

  const r = rng(seedFrom(plant.id));
  const INK = "#2C4131", INK2 = "#6E5438", LEAFFILL = "#CBD3B0";

  // parchment background
  ctx.fillStyle = "#FAF6EC"; ctx.fillRect(0, 0, W, H);
  // faint grid like a herbarium sheet
  ctx.strokeStyle = "rgba(110,84,56,.07)"; ctx.lineWidth = 1;
  for (let x = 0; x < W; x += 22) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
  for (let y = 0; y < H; y += 22) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

  const cx = W / 2, cy = H / 2;
  const flowerHex = FLOWER_HEX[(plant.traits.flowerColor || [])[0]] || "#7E8B5E";
  const kind = plant.traits.veins;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate((r() - 0.5) * 0.25);

  if (kind === "Needle / scale") drawConifer(ctx, W, H, r, INK, LEAFFILL, flowerHex);
  else if (kind === "Palmate (hand)") drawPalmate(ctx, W, H, r, INK, INK2, LEAFFILL, flowerHex);
  else if (kind === "Parallel") drawStrap(ctx, W, H, r, INK, INK2, LEAFFILL, flowerHex);
  else drawPinnate(ctx, W, H, r, INK, INK2, LEAFFILL, flowerHex, plant);
  ctx.restore();

  // corner specimen index, drawn straight
  ctx.font = "10px 'IBM Plex Mono', monospace";
  ctx.fillStyle = "rgba(81,96,74,.7)";
  ctx.fillText("No. " + (seedFrom(plant.id) % 900 + 100), 12, 20);
}

function leafBlade(ctx, len, wid, fill, ink) {
  ctx.beginPath();
  ctx.moveTo(0, -len / 2);
  ctx.quadraticCurveTo(wid, -len * 0.15, wid * 0.2, len / 2);
  ctx.quadraticCurveTo(-wid * 0.2 + 0, len * 0.62, -wid * 0.2, len / 2);
  ctx.quadraticCurveTo(-wid, -len * 0.15, 0, -len / 2);
  ctx.closePath();
  ctx.fillStyle = fill; ctx.fill();
  ctx.lineWidth = 1.6; ctx.strokeStyle = ink; ctx.stroke();
}

function drawPinnate(ctx, W, H, r, ink, ink2, fill, flowerHex, plant) {
  const len = H * 0.62, wid = W * 0.22;
  leafBlade(ctx, len, wid, fill, ink);
  // midrib
  ctx.lineWidth = 1.6; ctx.strokeStyle = ink;
  ctx.beginPath(); ctx.moveTo(0, -len / 2 + 4); ctx.lineTo(0, len / 2 - 4); ctx.stroke();
  // feather veins
  ctx.lineWidth = 1; ctx.strokeStyle = "rgba(44,65,49,.6)";
  const n = 7;
  for (let i = 1; i < n; i++) {
    const t = i / n, y = -len / 2 + len * t;
    const reach = wid * (0.85 - Math.abs(t - 0.45)) ;
    ctx.beginPath(); ctx.moveTo(0, y); ctx.quadraticCurveTo(reach * 0.6, y - 6, reach, y - 12); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, y); ctx.quadraticCurveTo(-reach * 0.6, y - 6, -reach, y - 12); ctx.stroke();
  }
  drawFlowerCluster(ctx, wid * 1.05, -len * 0.28, flowerHex, ink2, r);
}

function drawPalmate(ctx, W, H, r, ink, ink2, fill, flowerHex) {
  const R = Math.min(W, H) * 0.34, lobes = 5;
  ctx.save();
  // lobed star leaf
  ctx.beginPath();
  for (let i = 0; i <= lobes * 2; i++) {
    const a = (Math.PI * 2 * i) / (lobes * 2) - Math.PI / 2;
    const rad = (i % 2 === 0) ? R : R * 0.45;
    const x = Math.cos(a) * rad, y = Math.sin(a) * rad * 1.05;
    i === 0 ? ctx.moveTo(x, y) : ctx.quadraticCurveTo(Math.cos(a) * rad * 1.05, Math.sin(a) * rad * 1.05, x, y);
  }
  ctx.closePath();
  ctx.fillStyle = fill; ctx.fill(); ctx.lineWidth = 1.6; ctx.strokeStyle = ink; ctx.stroke();
  // radiating veins from base
  ctx.lineWidth = 1.1; ctx.strokeStyle = "rgba(44,65,49,.6)";
  for (let i = 0; i < lobes; i++) {
    const a = (Math.PI * 2 * i) / lobes - Math.PI / 2;
    ctx.beginPath(); ctx.moveTo(0, R * 0.15); ctx.lineTo(Math.cos(a) * R * 0.92, Math.sin(a) * R * 0.92); ctx.stroke();
  }
  // stem
  ctx.lineWidth = 2; ctx.strokeStyle = ink2; ctx.beginPath(); ctx.moveTo(0, R * 0.15); ctx.lineTo(0, R * 1.25); ctx.stroke();
  ctx.restore();
  drawFlowerCluster(ctx, R * 0.8, -R * 0.9, flowerHex, ink2, r);
}

function drawStrap(ctx, W, H, r, ink, ink2, fill, flowerHex) {
  const len = H * 0.66, wid = W * 0.12;
  for (let k = -1; k <= 1; k += 2) {
    ctx.save(); ctx.translate(k * wid * 1.2, 0); ctx.rotate(k * 0.12);
    ctx.beginPath();
    ctx.moveTo(0, -len / 2);
    ctx.quadraticCurveTo(wid, 0, 0, len / 2);
    ctx.quadraticCurveTo(-wid, 0, 0, -len / 2);
    ctx.closePath(); ctx.fillStyle = fill; ctx.fill(); ctx.lineWidth = 1.5; ctx.strokeStyle = ink; ctx.stroke();
    // parallel veins
    ctx.lineWidth = .9; ctx.strokeStyle = "rgba(44,65,49,.55)";
    for (let i = -2; i <= 2; i++) {
      ctx.beginPath(); ctx.moveTo(i * wid * 0.28, -len / 2 + 12); ctx.lineTo(i * wid * 0.28, len / 2 - 12); ctx.stroke();
    }
    ctx.restore();
  }
  drawFlowerCluster(ctx, 0, -len * 0.5 - 6, flowerHex, ink2, r);
}

function drawConifer(ctx, W, H, r, ink, fill, flowerHex) {
  const len = H * 0.6;
  ctx.lineWidth = 2.2; ctx.strokeStyle = "#6E5438";
  ctx.beginPath(); ctx.moveTo(0, -len / 2); ctx.lineTo(0, len / 2); ctx.stroke();
  ctx.lineWidth = 1.4; ctx.strokeStyle = ink;
  const n = 16;
  for (let i = 0; i < n; i++) {
    const y = -len / 2 + (len) * (i / n) + 6;
    const l = 20 + 8 * Math.sin(i);
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(l, y + 8); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(-l, y + 8); ctx.stroke();
  }
  // red aril berry
  ctx.fillStyle = flowerHex; ctx.beginPath(); ctx.arc(10, len * 0.18, 7, 0, Math.PI * 2); ctx.fill();
}

function drawFlowerCluster(ctx, x, y, hex, ink2, r) {
  // stem
  ctx.lineWidth = 1.4; ctx.strokeStyle = ink2;
  ctx.beginPath(); ctx.moveTo(x * 0.2, y + 30); ctx.quadraticCurveTo(x * 0.7, y + 10, x, y); ctx.stroke();
  for (let i = 0; i < 5; i++) {
    const px = x + Math.cos(i * 1.3) * 10, py = y + Math.sin(i * 1.7) * 9 - i * 2;
    ctx.fillStyle = hex;
    ctx.beginPath(); ctx.arc(px, py, 5 + (r() * 2), 0, Math.PI * 2); ctx.fill();
    ctx.lineWidth = .8; ctx.strokeStyle = "rgba(44,65,49,.4)"; ctx.stroke();
  }
}

/* draw every canvas with data-plant on the page */
function renderPlates() {
  const byId = Object.fromEntries((window.PLANTS || []).map(p => [p.id, p]));
  $$("canvas[data-plant]").forEach(c => { const p = byId[c.dataset.plant]; if (p) drawPlate(c, p); });
}

/* ---- boot --------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  injectChrome();
  initReveal();
  renderPlates();
});
let _rt; window.addEventListener("resize", () => { clearTimeout(_rt); _rt = setTimeout(renderPlates, 200); });
