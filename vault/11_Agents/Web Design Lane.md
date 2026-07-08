# Web Design Lane

Purpose: Turn the last two months of one-off page builds into a recurring, reusable workstream.
Extends the existing **Web Agent** from reactive audits to a real design lane the orchestrator can run
every morning. Covers mirror / improve / migrate across GHL, Wix, Squarespace, WordPress, Netlify, Vercel.

Backed by the `morning-orchestrator` web scout + core workflow #2 (Mirroring) and #3 (Remote Chrome).

## Daily role in the orchestra (Tier 0 scout)
- Which client pages need work today (from Slack/Gmail asks + open build queue).
- Tracking check: pixel/GA4/GTM present and firing on every live page.
- Mobile + CRO pass: flag broken CTAs, slow hero, weak forms; draft fixes.
- Output feeds the approval board: Tier-1 = reversible fixes (copy, link, CTA); Tier-2 = publish/deploy.

## Mirror vs Improve vs Migrate (decide first)
- **Mirror:** faithful rebuild. Preserve forms, links, phone numbers, tracking tags, CTAs, disclaimers exactly.
- **Improve:** keep structure, lift conversion (hero, form friction, proof blocks, mobile).
- **Migrate:** move platforms. Add a move log; preserve tracking + SEO (URLs, titles, redirects).

## Reusable Kit (stop rebuilding the same thing)
Extract from recent builds into `08_Assets/web-kit/` so every new page starts from proven parts:
- Hero patterns, lead-form patterns (with validation + tracking wired), CTA blocks, proof/testimonial blocks, FAQ/schema blocks, mobile nav.
- A build checklist and a **mobile QA checklist** (below).
- Per-platform notes: GHL quirks, Squarespace form handling, WordPress/SiteGround fallback.

## Mobile QA Checklist (gate before any deploy)
- [ ] Hero readable + CTA above the fold on 390px
- [ ] Forms submit; confirmation fires; lead lands in the real destination
- [ ] Tracking tags fire (GA4, pixel, conversion)
- [ ] Phone numbers tap-to-call; links resolve
- [ ] No layout break 320–430px; images not oversized
- [ ] Legal/disclaimer text preserved

## Rules
- Read the live page first (URL, title, screenshots, forms, scripts, tags, copy) before touching anything.
- Reuse the existing local project lane from PROJECTS.md; keep source files untouched.
- Use real Chrome for authenticated platforms; produce a paste-ready packet when dashboard control is flaky.
- Deploy is Tier 2 (live approval). Building/QA is Tier 0.

## Writes To
- 01_Clients/[Client]/Reporting Log.md
- 02_Campaigns/Landing Page Build Queue.md
- 08_Assets/web-kit/ (the reusable kit)
