# Codex Task — Finish Zen Spa homepage + site copy

You are in the **live Squarespace editor** for **zenspatropicana.com** (Boulevard booking). First:
`git pull origin claude/zen-spa-squarespace-handoff-c8nk6a`, then read `ZEN_SPA_BUILD_SPEC.md` and
`ZEN_SPA_FINISH_PACKET.md`. Everything you need is committed in this repo.

## ⛔ DO NOT touch (already done & live — leave alone)
- Mobile menu is now **single column**, the **hamburger is navy**, and there's a **gold Book Now in the
  mobile top bar**. These live in **Header code injection** as `<style id="zen-mobile-menu-fix">` and
  `<style id="zen-burger-booknow">` (+ its small script). Do **not** remove or rebuild them, and don't
  rebuild the header/nav.
- Full injection backup is on the primary VM at `/root/injection_backup_*.json` if you ever need it.

## ✅ Tasks, in priority order

### 1) Swap in the real homepage photos (match the mockups)
Files are in the repo at **`assets/homepage/`** after you pull. Upload each to Squarespace Media and set
it natively (section background / image block), replacing what's there now:
- `hero-buddha-massage-room.png` → **Home HERO** (replaces the meditating-people image) — mockup #1.
- `shop-retail-products.png` → **Shop** "Bring the Zen Spa Experience Home" retail image / brand-section bg — mockup #2.
- `group-events-tea-lounge.png` → **Group Events** "Celebrate Together" left image — mockup #3.

### 2) Homepage service circles — make them bigger + clearer
The "Services Designed For You" circles are too small / don't fit. Enlarge them so they're crisp and
legible (match mockup #1: ~5 across on desktop, 2 across on mobile). 10 circles, each **linking to its
category page**: Massage, Medical Grade Facials, Head Spa, Waxing, Foot Soak, Makeup, Lash & Brows,
Tea Lounge Experience, Couples Treatments, Body Wraps & Scrubs.

Use Dillon's final replacement service images from `assets/homepage/service-circles/crops/`. These are
1200x1200 square crops prepared for circular display. Exact upload/link mapping is documented in
`assets/homepage/service-circles/README.md`.

### 3) Add the missing icons (native Squarespace icons/image blocks — NO code)
Match the mockups. Two spots are currently **bare**:
- **Homepage value row** (mockup #1): Luxury Experiences = lotus · Ancient Inspiration = leaf ·
  Modern Wellness = water drop · Tea Lounge Retreats = teacup · Shop Our… = shopping bag.
- **Group Events "Perfect For Any Occasion"** (mockup #3) — bare now, add: Corporate Events = briefcase ·
  Bridal Parties = ring · Birthdays = cake · Spa Retreats = lotus · And More = people.
- **Shop trust row** (mockup #2): Shipped With Care = truck · Authentic Guarantee = shield/check ·
  Need Help = chat bubble.

### 4) Finish the page copy — 24 pages (Home is already done)
Replace the current older/interim copy with the **final wording in `ZEN_SPA_FINISH_PACKET.md`** (each page
under its own heading). Pages needing it:
about · services · full-service-menu · shop · group-events · contact · faqs · spa-memberships ·
spa-package-deals · monthly-specials-and-offers · gallery · careers · privacy-policy · terms · massages ·
facials · head-spa · waxing · foot-soaks · makeup · lashes-brows · day-pass · couples-treatments · body-treatments.
Use **native blocks** (text / heading / image / button / accordion). Never put page copy in code blocks.
**Save after each page.** No CBD anywhere. Preserve Boulevard booking and the contact/newsletter form
(don't submit test leads). Full Service Menu pricing: show times/prices tastefully (packet format is fine).

### 5) Brand logo grid (your existing task)
10 tiles = 9 logos + "& more!" per mockup #2, on the SkinCeuticals-style product background. URLs in the packet.

## Rules
- **Native drag-and-drop only** for page content — no code blocks for copy/images/buttons.
- Palette (exact): Ivory `#F7F2E9` background · Navy `#1B2F54` mood sections · Soft Navy `#3A4A6B` body text ·
  Gold `#A98B52` borders/dividers · Light Gold `#CDB37E` hairlines · Muted Gold `#9A8859` footer/captions ·
  Logo Navy `#000564` logo only.
- **Pause before deleting** anything — replace/hide rather than delete; keep one homepage, no duplicate slugs.
- Verify each page **desktop + mobile**; no horizontal overflow on Home/Shop/Full Service Menu/Group Events/Contact.
- If a step is impractical in the editor, note it and move on — don't stay blocked.
