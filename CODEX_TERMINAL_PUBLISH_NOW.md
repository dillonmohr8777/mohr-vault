# Zen Spa Terminal Publish Pass

Goal: publish a client-reviewable Zen Spa public site within 45 minutes.

## Do First

1. Open the live Squarespace editor for `zenspatropicana.com`.
2. Publish/save every page body that still has unpublished native-block changes.
3. Verify these public URLs on mobile width:
   - `/`
   - `/shop`
   - `/group-events`
   - `/contact`
   - `/spa-package-deals`
   - `/spa-memberships`
   - `/monthly-specials-and-offers`
   - `/faqs`
   - `/services`
   - all service pages listed below

## Visual Direction

Match the current homepage feel:
- ivory background
- deep navy sections
- gold buttons/dividers
- refined serif headings
- clean service imagery
- no raw black/default Squarespace body text pages
- no placeholder copy like "This page is live..." or "coming soon"
- no CBD anywhere

## Content Source

Use `ZEN_SPA_FINISH_PACKET.md` for final copy.

Every public page needs meaningful copy. If native content is not published yet, publish it now. If a page is awkward or blank, use the packet copy and the homepage style structure: navy hero, ivory content section, gold CTA.

## Service Images

Use the service image pack under:

`assets/service-pages/`

Mapping:
- `/massages` -> `assets/service-pages/massages-hero.jpg`
- `/facials` -> `assets/service-pages/facials-hero.jpg`
- `/head-spa` -> `assets/service-pages/head-spa-hero.jpg`
- `/waxing` -> `assets/service-pages/waxing-hero.jpg`
- `/foot-soaks` -> `assets/service-pages/foot-soaks-hero.jpg`
- `/makeup` -> `assets/service-pages/makeup-hero.jpg`
- `/lashes-brows` -> `assets/service-pages/lashes-brows-hero.jpg`
- `/day-pass` -> `assets/service-pages/tea-lounge-hero.jpg`
- `/couples-treatments` -> `assets/service-pages/couples-treatments-hero.jpg`
- `/body-treatments` -> `assets/service-pages/body-treatments-hero.jpg`

Upload them as native Squarespace media if possible. If time is tight, use the existing public override path or direct raw URLs after pushing the repo.

## Do Not Touch

- Do not break the homepage hero/service circles.
- Do not remove Boulevard booking.
- Do not test-submit the contact form.
- Do not delete pages. Hide from nav if needed.
- Do not touch mobile header injection unless it is actively broken.

## Acceptance Check

For each checked route:
- public page has the intended final title
- no placeholder "What to expect" fallback
- no "coming soon" fallback unless Ambika explicitly requested it
- no CBD mentions
- no mobile horizontal overflow
- nav and Book Now still work

If time runs out: prioritize publishable public presentation over perfect native editability, but leave a note of any pages that still need native cleanup later.
