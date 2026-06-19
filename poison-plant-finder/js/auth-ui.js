/* ============================================================================
   POISON PLANT FINDER — account UI
   Renders the header account control + a sign-in / create-account modal, and
   reflects auth state. Works in cloud mode (real Supabase auth) and guest mode
   (set a display name; data saved on this device).
   ============================================================================ */
(function () {
  let acctSlot;

  function initials(name) { return (name || "?").trim().slice(0, 1).toUpperCase(); }

  function renderAccount(user) {
    if (!acctSlot) return;
    if (user && (Store.isCloud() ? true : false)) {
      // signed-in cloud user
      acctSlot.innerHTML = `
        <div class="acct-menu">
          <button class="acct-btn" id="acctBtn" aria-haspopup="true" aria-expanded="false">
            <span class="avatar">${initials(user.name)}</span><span class="acct-name">${user.name || user.email}</span>
          </button>
          <div class="acct-pop" id="acctPop" hidden>
            <a href="account.html">Your dashboard</a>
            <a href="collections.html">Collections</a>
            <a href="sightings.html">Sightings</a>
            <button id="signOutBtn">Sign out</button>
          </div>
        </div>`;
      $("#acctBtn").addEventListener("click", togglePop);
      $("#signOutBtn").addEventListener("click", async () => { await Store.auth.signOut(); });
    } else if (!Store.isCloud()) {
      // guest mode
      acctSlot.innerHTML = `
        <div class="acct-menu">
          <button class="acct-btn" id="acctBtn" aria-haspopup="true" aria-expanded="false">
            <span class="avatar guest">${initials(user && user.name)}</span><span class="acct-name">${(user && user.name) || "Guest"}</span>
          </button>
          <div class="acct-pop" id="acctPop" hidden>
            <span class="acct-pop__label">Guest — saved on this device</span>
            <a href="account.html">Your dashboard</a>
            <a href="collections.html">Collections</a>
            <a href="sightings.html">Sightings</a>
            <button id="setNameBtn">Set display name</button>
          </div>
        </div>`;
      $("#acctBtn").addEventListener("click", togglePop);
      $("#setNameBtn").addEventListener("click", () => openModal("guest"));
    } else {
      // cloud configured but signed out
      acctSlot.innerHTML = `<button class="btn btn--ghost acct-signin" id="signInBtn">Sign in</button>`;
      $("#signInBtn").addEventListener("click", () => openModal("signin"));
    }
  }

  function togglePop() {
    const pop = $("#acctPop"), btn = $("#acctBtn");
    const open = pop.hasAttribute("hidden");
    pop.toggleAttribute("hidden", !open);
    btn.setAttribute("aria-expanded", String(open));
  }
  document.addEventListener("click", (e) => {
    const pop = document.getElementById("acctPop");
    if (pop && !pop.hasAttribute("hidden") && !e.target.closest(".acct-menu")) {
      pop.setAttribute("hidden", ""); document.getElementById("acctBtn")?.setAttribute("aria-expanded", "false");
    }
  });

  /* ---- modal ----------------------------------------------------------- */
  function openModal(mode) {
    closeModal();
    const cloud = Store.isCloud();
    const wrap = document.createElement("div");
    wrap.className = "modal"; wrap.id = "authModal";
    wrap.innerHTML = `
      <div class="modal__card" role="dialog" aria-modal="true" aria-labelledby="authTitle">
        <button class="modal__close" aria-label="Close" id="mClose">×</button>
        ${cloud ? cloudForm(mode) : guestForm()}
      </div>`;
    document.body.appendChild(wrap);
    wrap.addEventListener("click", (e) => { if (e.target === wrap) closeModal(); });
    $("#mClose").addEventListener("click", closeModal);
    document.addEventListener("keydown", escClose);

    if (cloud) {
      $$("#authModal [data-tab]").forEach(t => t.addEventListener("click", () => switchTab(t.dataset.tab)));
      $("#authForm").addEventListener("submit", submitCloud);
      switchTab(mode === "signup" ? "signup" : "signin");
    } else {
      $("#guestForm").addEventListener("submit", submitGuest);
      setTimeout(() => $("#gName")?.focus(), 30);
    }
  }
  function escClose(e) { if (e.key === "Escape") closeModal(); }
  function closeModal() { const m = document.getElementById("authModal"); if (m) m.remove(); document.removeEventListener("keydown", escClose); }

  function cloudForm() {
    return `
      <span class="eyebrow">Your field notebook</span>
      <h2 id="authTitle" style="margin:.4rem 0 1rem">Welcome back</h2>
      <div class="tabs">
        <button data-tab="signin" class="tab">Sign in</button>
        <button data-tab="signup" class="tab">Create account</button>
      </div>
      <form id="authForm" class="stack" style="margin-top:1rem">
        <label class="field-label" id="nameRow" hidden>Name
          <input class="field field--block" type="text" id="aName" autocomplete="name" placeholder="What should we call you?" />
        </label>
        <label class="field-label">Email
          <input class="field field--block" type="email" id="aEmail" autocomplete="email" required placeholder="you@example.com" />
        </label>
        <label class="field-label">Password
          <input class="field field--block" type="password" id="aPass" autocomplete="current-password" required minlength="6" placeholder="At least 6 characters" />
        </label>
        <p class="auth-error" id="authError" hidden></p>
        <button class="btn btn--block" type="submit" id="authSubmit">Sign in</button>
      </form>
      <p class="note" style="margin-top:.8rem">Your saved plants, notes, lists and sightings sync to every device you sign in on.</p>`;
  }
  function guestForm() {
    return `
      <span class="eyebrow">Guest mode</span>
      <h2 id="authTitle" style="margin:.4rem 0 .6rem">Saved on this device</h2>
      <p class="note">You're using Poison Plant Finder as a guest — your favorites, notes, lists and sightings
        are saved in <b>this browser only</b>. Pick a display name to personalize it.</p>
      <form id="guestForm" class="stack" style="margin-top:1rem">
        <label class="field-label">Display name
          <input class="field field--block" type="text" id="gName" placeholder="e.g. Dillon" value="${(Store.user()?.name && Store.user().name !== "Guest") ? Store.user().name : ""}" />
        </label>
        <button class="btn btn--block" type="submit">Save</button>
      </form>
      <p class="note" style="margin-top:1rem">Want it to sync to your phone and other computers? Add a free Supabase key in
        <code>js/config.js</code> to turn on real accounts — see the README.</p>`;
  }

  function switchTab(tab) {
    $$("#authModal .tab").forEach(t => t.classList.toggle("active", t.dataset.tab === tab));
    const signup = tab === "signup";
    $("#nameRow").toggleAttribute("hidden", !signup);
    $("#authTitle").textContent = signup ? "Create your account" : "Welcome back";
    $("#authSubmit").textContent = signup ? "Create account" : "Sign in";
    $("#aPass").setAttribute("autocomplete", signup ? "new-password" : "current-password");
    $("#authForm").dataset.mode = tab;
  }

  async function submitCloud(e) {
    e.preventDefault();
    const mode = $("#authForm").dataset.mode;
    const email = $("#aEmail").value.trim(), pass = $("#aPass").value, name = $("#aName").value.trim();
    const err = $("#authError"), btn = $("#authSubmit");
    err.setAttribute("hidden", ""); btn.disabled = true; btn.textContent = "…";
    try {
      if (mode === "signup") {
        const r = await Store.auth.signUp(email, pass, name);
        if (r.needsConfirm) { showInfo("Check your email to confirm your account, then sign in."); btn.disabled = false; switchTab("signin"); return; }
      } else {
        await Store.auth.signIn(email, pass);
      }
      closeModal();
    } catch (ex) {
      err.textContent = friendly(ex.message); err.removeAttribute("hidden");
      btn.disabled = false; btn.textContent = mode === "signup" ? "Create account" : "Sign in";
    }
  }
  function showInfo(msg) { const err = $("#authError"); if (err) { err.textContent = msg; err.classList.add("info"); err.removeAttribute("hidden"); } }
  function friendly(m) {
    if (/invalid login/i.test(m)) return "Email or password is incorrect.";
    if (/already registered/i.test(m)) return "That email already has an account — try signing in.";
    return m || "Something went wrong. Try again.";
  }

  async function submitGuest(e) {
    e.preventDefault();
    const name = $("#gName").value.trim() || "Guest";
    await Store.auth.signIn(name); // guest signIn just sets the display name
    closeModal();
  }

  /* ---- guest banner (shown once-ish) ----------------------------------- */
  function maybeBanner() {
    if (Store.isCloud()) return;
    if (localStorage.getItem("ppf_hide_guest_banner")) return;
    const b = document.createElement("div");
    b.className = "guest-banner";
    b.innerHTML = `<div class="wrap">
      <span>You're in <b>guest mode</b> — saves stay on this device. Turn on free accounts to sync everywhere.</span>
      <span class="guest-banner__actions">
        <a href="account.html">Learn how</a>
        <button id="dismissGuest" aria-label="Dismiss">Dismiss</button>
      </span></div>`;
    const header = $(".site-header");
    header.insertAdjacentElement("afterend", b);
    $("#dismissGuest").addEventListener("click", () => { localStorage.setItem("ppf_hide_guest_banner", "1"); b.remove(); });
  }

  /* ---- mount ----------------------------------------------------------- */
  window.mountAccount = function () {
    acctSlot = document.getElementById("acctSlot");
    Store.onChange(renderAccount);
    renderAccount(Store.user());
    maybeBanner();
  };
  window.openAuth = openModal;
})();
