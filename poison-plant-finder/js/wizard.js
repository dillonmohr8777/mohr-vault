/* Guided ID wizard: ask one trait at a time and narrow the plant list. The
   user can skip any step or jump to results whenever the list is short enough. */
(function () {
  const QUESTIONS = [
    { key: "veins", multi: false, q: "How do the veins run on a single leaf?",
      help: "Look at one leaf (or leaflet) and trace the veins from the stalk.",
      hints: { "Pinnate (feather)": "One central rib with veins branching off like a feather.",
               "Palmate (hand)": "Several main veins spreading from one point, like fingers from a palm.",
               "Parallel": "Veins run side by side down the leaf, like a blade of grass.",
               "Needle / scale": "Needles or tiny scales instead of a flat leaf (conifers)." } },
    { key: "arrangement", multi: false, q: "How are the leaves arranged on the stem?",
      help: "Where leaves attach to the stem.",
      hints: { "Alternate": "One leaf at a time, staggered up the stem.",
               "Opposite": "Leaves in matched pairs across from each other.",
               "Whorled": "Three or more leaves circling the stem at one point.",
               "Basal rosette": "A low circle of leaves at the base, near the ground.",
               "Compound leaflets": "Each 'leaf' is made of several leaflets on one stalk." } },
    { key: "flowerColor", multi: true, q: "What color are the flowers (if any)?",
      help: "Skip if it isn't flowering.", hints: {} },
    { key: "sun", multi: true, q: "How much sun does it get where it's growing?", help: "", hints: {} },
    { key: "water", multi: true, q: "How wet is the ground there?", help: "", hints: {} },
  ];

  const answers = {};
  let step = 0;

  function matches() {
    return PLANTS.filter(p => {
      const t = p.traits;
      for (const Q of QUESTIONS) {
        const a = answers[Q.key];
        if (!a) continue;
        if (Q.multi) { if (!a.some(v => (t[Q.key] || []).includes(v))) return false; }
        else { if (t[Q.key] !== a) return false; }
      }
      return true;
    }).sort((a, b) => b.severity - a.severity || a.common.localeCompare(b.common));
  }

  const stage = $("#stage"), progress = $("#progress"), countEl = $("#count");

  function render() {
    const m = matches();
    progress.style.width = `${(step / QUESTIONS.length) * 100}%`;
    countEl.innerHTML = `<strong>${m.length}</strong> plant${m.length === 1 ? "" : "s"} still match`;

    if (step >= QUESTIONS.length) return renderResults(m);

    const Q = QUESTIONS[step];
    const opts = VOCAB[Q.key];
    stage.innerHTML = `
      <div class="wizard__q reveal in">
        <span class="step-no">Step ${step + 1} of ${QUESTIONS.length}</span>
        <h2>${Q.q}</h2>
        ${Q.help ? `<p class="note">${Q.help}</p>` : ""}
        <div class="wizard__opts">
          ${opts.map(o => `<button class="wopt" data-val="${o}">
            <span class="wopt__t">${o}</span>
            ${Q.hints[o] ? `<span class="wopt__h">${Q.hints[o]}</span>` : ""}
          </button>`).join("")}
        </div>
        <div class="wizard__nav">
          ${step > 0 ? `<button class="btn btn--ghost" id="backBtn">← Back</button>` : "<span></span>"}
          <div class="wizard__nav-right">
            <button class="btn btn--ghost" id="skipBtn">Not sure — skip</button>
            ${m.length <= 6 ? `<button class="btn" id="seeBtn">See ${m.length} matches →</button>` : ""}
          </div>
        </div>
      </div>`;

    stage.querySelectorAll(".wopt").forEach(b => b.addEventListener("click", () => {
      const v = b.dataset.val;
      if (Q.multi) {
        const cur = answers[Q.key] || [];
        answers[Q.key] = cur.includes(v) ? cur.filter(x => x !== v) : [...cur, v];
        b.classList.toggle("on");
        // multi: update count but let user pick several, then Next
        const m2 = matches(); countEl.innerHTML = `<strong>${m2.length}</strong> plant${m2.length === 1 ? "" : "s"} still match`;
        ensureNext();
      } else {
        answers[Q.key] = v; step++; render();
      }
    }));
    $("#backBtn")?.addEventListener("click", () => { step--; render(); });
    $("#skipBtn")?.addEventListener("click", () => { delete answers[Q.key]; step++; render(); });
    $("#seeBtn")?.addEventListener("click", () => { step = QUESTIONS.length; render(); });
  }

  function ensureNext() {
    if ($("#nextBtn")) return;
    const right = $(".wizard__nav-right");
    const btn = document.createElement("button");
    btn.className = "btn"; btn.id = "nextBtn"; btn.textContent = "Next →";
    btn.addEventListener("click", () => { step++; render(); });
    right.appendChild(btn);
  }

  function renderResults(m) {
    progress.style.width = "100%";
    const picked = QUESTIONS.filter(Q => answers[Q.key]).map(Q => {
      const a = answers[Q.key]; return `${Array.isArray(a) ? a.join(" / ") : a}`;
    });
    stage.innerHTML = `
      <div class="reveal in">
        <span class="step-no">Result</span>
        <h2>${m.length ? `${m.length} possible match${m.length === 1 ? "" : "es"}` : "No exact match"}</h2>
        <p class="note">${picked.length ? "Based on: " + picked.join(" · ") : "You skipped every question — here's the full list."}
          ${m.length ? " Tap one to see its full danger profile." : " Try again and skip a trait — real plants vary, and one wrong call can hide the right plant."}</p>
        <div class="grid-plants" style="margin-top:1.2rem">
          ${m.map(p => `<a class="card" href="plant.html?id=${p.id}">
            <div class="card__plate"><canvas data-plant="${p.id}"></canvas><span class="card__sev">${sevBadge(p)}</span></div>
            <div class="card__body"><span class="card__common">${p.common}</span>
              <span class="card__sci">${p.scientific}</span>
              <div class="card__meta">${invasiveBadge(p)}${contactBadge(p)}</div></div></a>`).join("")}
        </div>
        <div class="wizard__nav" style="margin-top:1.6rem">
          <button class="btn btn--ghost" id="restartBtn">↺ Start over</button>
          <a class="btn btn--ghost" href="filter.html">Switch to full filter →</a>
        </div>
      </div>`;
    renderPlates();
    $("#restartBtn").addEventListener("click", () => { Object.keys(answers).forEach(k => delete answers[k]); step = 0; render(); });
  }

  render();
})();
