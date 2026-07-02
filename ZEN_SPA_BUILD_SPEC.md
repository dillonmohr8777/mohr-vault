# Zen Spa at Tropicana — Website Build Spec & Handoff

**Source of truth:** Client (Ambika Vig) update list of 13 items + 3 homepage mockups
(homepage / brand-logos / group-events), received 2026-07-01.
**Live site:** https://zenspatropicana.com  ·  **Editor:** zenspatropicana.squarespace.com (Squarespace 7.1)
**Logged in as:** Dillon.

> This doc is the durable record of the brief + everything discovered while driving the
> Squarespace editor, so the build can proceed fast in any stable session. Update statuses
> inline as items are completed.

---

## ⚠️ Blockers / decisions needed from Dillon

1. **RESOLVED (2026-07-02): full service menu + all page copy received.** See
   **`ZEN_SPA_FINISH_PACKET.md`** (committed alongside this spec) — it contains the complete service
   menu with pricing, final copy for all 25 routes, the 13 transparent brand-logo PNG URLs (verified
   live on GitHub), and the Boulevard booking URL
   (`https://www.joinblvd.com/b/zenspatropicana/widget`). **The packet is the content source of truth**;
   this spec remains the design/brief source of truth.
   - Pricing display rule from client: **do NOT** list times as "50/80/100 + prices" (confusing).
     Display each duration/price spelled out tastefully (the packet's "50 minutes – $145; 80 minutes –
     $220" format satisfies this; a stacked per-line layout is even cleaner on mobile).
   - ⚠️ **Nav-order conflict to resolve with the client:** Ambika's email specified 8 hamburger items
     (Book Now, Shop, Full Service Menu, Group Events, FAQs, About Us, Careers, Gallery); the finish
     packet specifies 11 (adding Spa Package Deals, Spa Memberships, Monthly Specials and Offers after
     Book Now). Packet is newer — default to the packet's 11 unless Ambika says otherwise.

2. **Re item #4 (native-only) — RESOLVED: strip it, go fully native.** Dillon approved (2026-07-01)
   removing the external code injection. Action: in **Settings → Code Injection (Header)**, **delete the
   Netlify favicon script** (`setZenSpaFavicon()` + the three `blissful-zen-spa-tropicana.netlify.app`
   `<link>` tags). **Keep** the `google-site-verification` meta (harmless, needed for Search Console). Set
   the favicon **natively** under **Design → Logo & Title** by uploading the Zen Spa logo. After this the
   site is buildable as fully native drag-and-drop, satisfying item #4.
   - Client emphasis: **"make it look good" + use the EXACT official brand logos** (see #8).

3. **Environment stability.** These are 4GB editor VMs that crash ("Aw Snap") on heavy editor pages,
   and the automation session itself has been restarting ~every 2 min (MCP disconnects). A full build
   needs an uninterrupted, stable window. Plan work in short atomic steps and **Save often**.

---

## 🎨 Item #1 — Color palette (EXACT hex, no other colors site-wide)

Set in **Design → Site Styles → Colors** (edit each theme's palette + swatches).

| Role | Name | Hex |
|---|---|---|
| Primary background | Ivory | `#F7F2E9` |
| Mood/dark sections ONLY | Navy | `#1B2F54` |
| Logo ONLY (never altered) | Logo Navy | `#000564` |
| Body text | Soft Navy | `#3A4A6B` |
| Borders & dividers | Gold | `#A98B52` |
| Hairlines & highlights | Light Gold | `#CDB37E` |
| Captions & footer text | Muted Gold | `#9A8859` |

Notes: Squarespace 7.1 uses color *themes* (Lightest/Light/Bright/Dark/Darkest). Configure the
"Light/Lightest" themes on Ivory `#F7F2E9` bg with Soft-Navy text + Gold accents; configure "Dark/Darkest"
themes on Navy `#1B2F54` bg with Ivory text + Gold accents. Buttons = Gold `#A98B52` fill, navy text.

## 🔤 Item #7 — Font

Mockup headings are a high-contrast elegant **Didone/transitional serif**; body is a classic readable serif.
**Recommendation (Squarespace-available):**
- **Headings:** *Canela* or *Cormorant Garamond* (display, high-contrast). If matching the mockup's very
  high contrast display face, *Cormorant Garamond* is the closest free option; *Marcellus* is a good
  all-caps alternative for eyebrows/nav.
- **Body:** *Cormorant Garamond* pairs with a cleaner serif body — use *PT Serif* or *Lora* for readability.
Set under **Design → Site Styles → Fonts** (Base font + heading assignments). Adjustable on request.

## 📱 Item #2 — Mobile optimization (TOP PRIORITY — ~90% of traffic is mobile)

- Test in Squarespace mobile preview AND on real Chrome + Safari (iOS).
- Header: hamburger + Book Now must fit and be tappable on small screens (see #3/#5).
- Service circles (10): ensure they reflow to 2-across on mobile, remain tappable, labels legible.
- Hero text scales (no clipping); buttons stack; brand-logo grid reflows (e.g., 2–3 across).
- Verify tap targets ≥44px, no horizontal scroll, popup form usable on mobile.

## 📌 Items #3 & #5 — Sticky header + Book Now + hamburger

- **Design → Site Styles → Header:** enable **Fixed/sticky** position so header stays on scroll.
- Header layout (per mockup #1): **Logo left; right side = [ BOOK NOW gold button ] [ ☰ hamburger ]**,
  Book Now directly to the LEFT of the hamburger.
- **Current bug:** on the live site the gold "BOOK NOW" button overlaps the nav ("CAREERS **BOOK NOW**
  GALLERY" collide). Switch the header nav to a **hamburger/collapsed** style so the full link list lives
  in the menu, leaving only Book Now + ☰ visible — this also fixes the overlap.
- Book Now button links to the booking system (see #13 — confirm platform/URL).

## 🔗 Item #6 — Service circles clickable (homepage "Services Designed For You")

10 circles, each links to its category description page:
Massage · Medical Grade Facials · Head Spa · Waxing · Foot Soak · Makeup · Lash & Brows ·
Tea Lounge Experience · Couples Treatments · Body Wraps & Scrubs.
(Client's note referenced "Curated for You"; mockup label is "SERVICES DESIGNED FOR YOU" — confirm wording.)
Each circle = image + caption + link. Use native Image blocks with click-through, or a Summary/link block.

## 🖼️ Item #8 — Brand logos section (mockup #2)

Section title **"Explore Our Professional Brands"** — "Tap a brand to learn more and shop their collection."
Logo grid (official logos, each links to that brand's collection/shop):
1. **FarmhouseFresh (FHF)** — farmhousefresh.com
2. **SkinCeuticals** — skinceuticals.com
3. **OBAGI Medical** — obagi.com
4. **Dermalogica** — dermalogica.com
5. **GrandeLASH-MD (Grande Cosmetics)** — grandecosmetics.com
6. **Olaplex** — olaplex.com
7. **amika** — loveamika.com
8. **Redken** — redken.com
9. **K18** — k18hair.com
10. "**& more!**" tile
**Background image behind this section:** a **SkinCeuticals product image** (per client note on the mockup).
Also present in mockup product photo (not necessarily logos): IMAGE Skincare, Circadia by Dr. Pugliese,
Medik8, skinbetter science.
Supporting rows in this section:
- Value row: Professional Quality · Results You Can See · Therapist Approved · Shop Online or In Spa · Beauty That Gives Back.
- Trust row: Shipped With Care · Authentic Guarantee · Need Help?
- Intro block: "Bring the Zen Spa Experience Home" + "Shop Our Collection" button + "Shop online or visit us in person — Inside Zen Spa at Tropicana Atlantic City."
> Sourcing note: use each brand's official logo (nominative use for a retailer that carries them, per client
> request). Save to the VM (existing pattern stores images in `/tmp/za/`) then upload via native Image blocks.

## 🎉 Item #10 — Group Events footer section (mockup #3)

Section **"Group Bookings — Celebrate Together."** Copy: Zen Spa for corporate events, bridal parties,
birthdays, spa retreats; **parties of 8+ get a discount + reserved Tea Lounge area.**
CTA: **"Inquire About Group Bookings."**
Sub-section **"Perfect For Any Occasion"** icon row: Corporate Events · Bridal Parties · Birthdays ·
Spa Retreats · And More. Discount banner: "Groups of eight or more receive a discount on services plus a
reserved area in our Tea Lounge."
**Action:** replace the current left-hand image with an **on-brand Buddha image**.

## 🧭 Item #9 — Navigation pages (hamburger menu, EXACT order)

Create/confirm these pages and set this order in the header nav (hamburger):
**Book Now · Shop · Full Service Menu · Group Events · FAQs · About Us · Careers · Gallery**
Client will send content per page later → create as **styled placeholders** now.
(Existing pages already present: Book Now, Spa Package Deals, Spa Memberships, Monthly Specials and Offers,
Shop, Full Service Menu, Group Events, FAQs, About Us, Careers, Gallery. Reorder to the list above; the
extra pages — Spa Package Deals/Memberships/Monthly Specials — are not in the client's requested nav order,
confirm whether to keep them in nav or move to Not Linked.)

## 📨 Item #12 — Mailing list pop-up form

Popup exists and renders ("Join our mailing list… Be the first to know… Subscribe… We respect your privacy.").
**Verify:** it's connected to a storage destination (Squarespace Email Campaigns list / Google Sheet /
Mailchimp) and a test submission is captured. Fix connection if submissions aren't stored.

## 📄 Item #13 — Footer privacy policy (booking-site requirements)

**Booking platform CONFIRMED: Boulevard** (the native Book Now nav link points to Boulevard —
verified in the 2026-07-02 Codex pass). Add footer links: **Privacy Policy, Terms of Service**, plus
Boulevard-required disclosures (booking data/SMS consent per Boulevard's client-data terms). Footer
text uses Muted Gold `#9A8859`.

## 🏠 Homepage assembly (per client: ONLY the content in the 3 mockups, in order)

1. **Sticky header** — logo left; Book Now + ☰ right (#3/#5).
2. **Hero (mockup #1)** — Navy section, seated-Buddha image w/ candles+massage bed; headline
   "Bliss begins inside Zen Spa at Tropicana."; sub "A sanctuary of stillness and renewal."; paragraph;
   buttons "Book a Treatment" + "Explore Services". (Live hero currently shows a different image — update to match.)
3. **Value row (5 icons)** — Luxury Experiences · Ancient Inspiration · Modern Wellness · Tea Lounge Retreats · Shop Our Curated Skin Care & Hair Care Products.
4. **"Services Designed For You"** — 10 clickable service circles (#6).
5. **Retail / Professional Brands (mockup #2)** (#8).
6. **Group Events "Celebrate Together" (mockup #3)** (#10).
7. **Footer** (#13) + mailing-list popup (#12).

---

## 🖥️ Infrastructure & operating notes

**VMs (Orgo, workspace `blissful-zen-spa`, same Squarespace login — concurrent editing works):**
- `zenspa-social-setup` `158749df-d455-4e1e-8f7b-e23c601ee0e4` — **primary editor**. ⚠️ renders at
  **1920×1080** while `orgo_click` uses **1280×720 model space** → **multiply screenshot coords by 2/3**
  before clicking. (This was the cause of early mis-clicks.)
- `hermes` `b22f684f-330c-4aab-9846-eb6e65b0e2c3` — done: About, FAQs, Careers, Gallery. Screens are 1280×720.
- `mohr-media` `f53ed1b7-a0e4-43ba-9d40-8a0d10607221` — Massages/Facials/Head Spa/Waxing. **Zen Spa tab ONLY** (has Google Ads tabs).
- `ii-launch-control` `ce749da9-2687-431f-a807-cfe39492008a` — Body Treatments/Couples/Day Pass/Foot Soaks. **Zen Spa tab ONLY** (has FB/Meta tabs). Foot Soaks page was still empty.

**Already done & live (prior work):** Buddha hero swap (was ginger); removed 2 fake testimonial sections;
removed CBD text from Home; removed 3 fitness images; global palette started (red→Gold `#A98B52`, sage→Navy).

**Codex pass, 2026-07-02 (local session on Dillon's machine):**
- Removed the duplicate injected desktop **Book Now** button that overlapped the nav (native Book Now
  nav link remains, pointing to **Boulevard**).
- Newsletter/contact form copy updated from generic "health insights/program updates" text to
  Zen Spa-specific copy. Form renders First Name / Last Name / Email / SIGN UP (no test submission made —
  **item #12 still needs a test submission verified end-to-end**).
- Public QA across 25 routes: all 200, all populated, no CBD references, no old filler, no
  "Made with Squarespace" visible, no mobile horizontal overflow on key pages.
- Remaining known gaps after this pass: **Home, Shop, and Group Events are not yet fully broken into
  separate native image/button blocks** (i.e., not yet a 100% native rebuild); homepage still needs the
  full 3-mockup assembly. QA snapshots on Dillon's machine under
  `Desktop\Codex\handoffs\zen-spa-site-update-2026-06-29\`.

**Build discipline:** native blocks only; type/paste content directly; Save frequently; reload on crash;
keep tabs minimal on the 4GB VMs; restart a VM to clear memory if it gets sluggish.

## ▶️ How to run this build in a stable, long-running session

The Orgo VMs, the Squarespace login, and this spec are all **persistent** — only the automation
*session* needs to be stable. Run Claude Code from a host that doesn't recycle (your own computer):

1. **Install Claude Code** — desktop app from https://claude.ai/code, or CLI: `npm install -g @anthropic-ai/claude-code`.
2. **Clone the repo + check out this branch:**
   ```bash
   git clone https://github.com/dillonmohr8777/mohr-vault.git
   cd mohr-vault
   git checkout claude/zen-spa-squarespace-handoff-c8nk6a
   ```
3. **Export the Orgo API key** (same key used in the web env; format `sk_live_...`):
   ```bash
   export ORGO_API_KEY=sk_live_your_real_key
   ```
   `.mcp.json` already points at the hosted Orgo endpoint and reads this var — no install needed.
4. **Launch** `claude` in the repo dir; approve the `orgo` MCP server when prompted; run `orgo_doctor` to verify auth.
5. **Kick off the build:**
   > "Read ZEN_SPA_BUILD_SPEC.md and execute the whole build on the Zen Spa Squarespace site via the
   > Orgo VMs. Start by stripping the Netlify code injection (#4), then palette (#1), font (#7), sticky
   > header + Book Now + hamburger (#3/#5), then the homepage per the 3 mockups. Save often; reload on crash."

**Gotchas for the driver:** primary VM `zenspa-social-setup` renders 1920×1080 but `orgo_click` uses
1280×720 space → multiply screenshot coords by **2/3**. Worker VMs are 1280×720 (no scaling). Keep tabs
minimal on the 4GB VMs; use only the Zen Spa tab on `mohr-media` / `ii-launch-control`.

## ✅ Status checklist

- [ ] #1 Palette exact hex applied site-wide (Site Styles)
- [ ] #7 Font set (headings + body)
- [ ] #2 Mobile optimization (Chrome + Safari) — TOP PRIORITY
- [ ] #3/#5 Sticky header + Book Now + hamburger — overlap FIXED (duplicate injected button removed,
      2026-07-02); sticky position + hamburger layout still to do
- [ ] #4 Native build — strip Netlify code injection (keep google-site-verification), set favicon natively
- [ ] #6 Service circles clickable → category pages
- [ ] #8 Brand logos section + SkinCeuticals background
- [ ] #9 Nav placeholder pages in exact order
- [ ] #10 Group Events section + Buddha image
- [ ] #11 Deadline confirmation (by Wednesday) — see instability note
- [ ] #12 Mailing-list popup verified collecting data
- [ ] #13 Footer privacy policy — platform confirmed: **Boulevard**; add footer links + disclosures
- [ ] Homepage = only the 3 mockups, in order
- [x] ~~BLOCKER: obtain final service menu for pricing/copy~~ RESOLVED — see `ZEN_SPA_FINISH_PACKET.md`
      (full menu + 25-route copy + 13 logo PNGs + Boulevard URL). Nothing is blocked anymore.
