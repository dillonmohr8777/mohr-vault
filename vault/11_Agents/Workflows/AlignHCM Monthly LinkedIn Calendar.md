# Workflow — AlignHCM Monthly LinkedIn Content Calendar

> A worked end-to-end example of the roster running one real job. Shows the exact agent graph, who runs on
> which model tier, what each node returns, where the gates are, and what ships. Use it as the template for
> any "build a month of content for client X" directive.

**Job:** Produce next month's AlignHCM LinkedIn content calendar — themed, written in AlignHCM's B2B
voice, with visual briefs, loaded into the content queue, ready to schedule.
**Trigger:** a line in `Morning Directives.md` → `Build the AlignHCM {month} LinkedIn calendar #recurring`.
**Owner:** [[Master Agent]] (L0). **Lanes touched:** comms/content, seo, web, reporting.
**Gate:** everything below is Tier 0 (autonomous) until *publish/schedule*, which is Tier 2.

---

## The agent graph

```
L0  Master Agent (Heavy) ── reads the directive, loads AlignHCM context, sets the month's goal
      │
      ├─ L1  Research lead (Balanced) ─── spawns:
      │       ├─ L2 trend scout (Fast)        → deep-research/autoresearch: HR/HCM + SmartCare topics trending on LinkedIn
      │       ├─ L2 competitor scout (Fast)   → competitive-intel: what HCM competitors are posting + gaps
      │       └─ L2 performance scout (Fast)  → metrics-pull/social-media-analyzer: which past AlignHCM posts won, and why
      │
      ├─ L1  SEO/AEO lead (Balanced) ──────── ai-seo: the entities/keywords/questions to seed so posts get cited
      │
      ├─ L1  Strategy synthesist (Heavy) ──── consumes the 4 returns → the month's themes + posting cadence
      │
      ├─ L1  Content lead (Balanced) ── per post, spawns:
      │       ├─ L2 copywriter (Balanced)     → copywriting + alignhcm-brand voice: the post copy + hook
      │       └─ L2 visual-brief director (Balanced) → alignhcm-brand + ad-creative: exact visual brief (tokens, effect, format)
      │
      ├─ L1  Verifier panel (Heavy for brand/claims, Fast for format) ── refutes every post before it counts
      │
      └─ L0  Master Agent ── assembles the calendar artifact, loads the queue, drafts the recap
              └──► Tier-2 gate: scheduling/publishing waits for a live yes
```

Delegation depth ≤ 3, per `agent-protocol.md`. Model tiers per `model-routing/references/routing-matrix.md`:
gather cheap, decide dear, verify to the stakes.

---

## Step by step

### 0. Intake + context (L0, Heavy)
Master reads the directive, then loads AlignHCM context once (front-loaded so it caches for every child):
- `01_Clients/Align HCM.md` + prior calendars/reports
- `alignhcm-brand` skill (exact tokens, fonts, signature effects, voice) — and `alignhcm-smartcare` for
  positioning if SmartCare is in scope
- last month's `Reporting Log.md` (what performed)

Sets the month's **goal** (e.g. "drive SmartCare demo requests; establish AlignHCM as the HR-ops
authority") and the cadence (e.g. 12 posts: 4 thought-leadership, 4 product/SmartCare, 2 proof/case, 2
engagement).

### 1. Research fan-out (L2 scouts, Fast — read-only, Tier 0)
Three scouts in parallel, each returns the structured handoff:
- **Trend scout** — `deep-research` / `autoresearch-agent`: trending HCM/HR-ops/compliance topics + the
  angles LinkedIn is rewarding this month.
- **Competitor scout** — `competitive-intel`: what competing HCM brands are posting; the whitespace.
- **Performance scout** — `metrics-pull` / `social-media-analyzer`: AlignHCM's own top posts + the pattern
  behind them (format, hook, topic).

### 2. SEO/AEO seed (L1, Balanced — Tier 0)
[[SEO Agent]] via `ai-seo`: the entities, questions, and keywords to weave in so posts are quotable by
answer engines and support the site's organic themes. Returns a seed list the copywriters must hit.

### 3. Strategy synthesis (L1, Heavy — Tier 0)
Consumes the four structured returns (never re-reads raw research) → the month's **theme plan**: each slot
gets a theme, objective, target angle, and the AEO seed to include. This is a decision node → Heavy.

### 4. Content production (L2 pairs, Balanced — Tier 0)
Per post, two workers in parallel:
- **Copywriter** — `copywriting` + `alignhcm-brand` voice: hook + body + CTA in AlignHCM's B2B voice
  (authoritative, plain, no fluff). Hits the AEO seed. Returns copy + rationale.
- **Visual-brief director** — `alignhcm-brand` + `ad-creative`: a precise visual brief, not vague vibes —
  format (single/carousel/motion), exact tokens (`#FF6B2B`, Inter/DM Sans/Syne), the signature effect to
  use, and the asset to hand off to the design pipeline (or to Grok/Imagine for generation).

### 5. Verify (panel — Heavy for brand/claims, Fast for format — Tier 0)
Every post is refuted before it counts (`verify-before-surface`):
- **Brand/voice verifier (Heavy)** — is this actually AlignHCM's voice? on-brand tokens? any off-tone
  claim? Default reject if uncertain.
- **Claim verifier (Heavy)** — any stat/claim re-derived from source; unverifiable claim → pulled.
- **Format verifier (Fast)** — length, hook strength, CTA present, hashtags sane.

Rejection rate over threshold → the whole calendar flags for Dillon instead of auto-assembling.

### 6. Assemble + load (L0, Heavy — Tier 0)
Master assembles the **calendar artifact** (below) and appends the posts to
`03_Content/` / the content queue. Ledger-pending entries logged so next month's performance scout can
label what worked.

### 7. Deliver (Tier 0 draft → Tier 2 send/schedule)
Master drafts the recap ("July calendar: 12 posts, themes X/Y/Z, N demo-driving") for Dillon.
**Scheduling/publishing to LinkedIn and any client-facing send are Tier 2 — prepared decision-ready,
executed only on a live yes.**

---

## The artifact (what ships)

```markdown
# AlignHCM — LinkedIn Calendar — {Month YYYY}
Goal: <the month's objective>   ·   Cadence: <N posts, mix>
AEO seed: <entities/questions to reinforce>

| # | Date | Theme | Format | Hook | CTA | AEO seed | Visual brief | Status |
|---|------|-------|--------|------|-----|----------|--------------|--------|
| 1 | ... | Thought leadership | Carousel | ... | Book a SmartCare demo | ... | tokens+effect+asset | draft |
...

## Per-post detail
### Post 1 — <theme>
- Copy: <full post>
- Visual brief: <format, exact tokens, signature effect, asset handoff>
- Why it works: <angle + the performance/trend evidence behind it>
- Verify: brand ✓ · claims ✓ · format ✓
```

Output location: `03_Content/AlignHCM/{Month} LinkedIn Calendar.md` (+ queue entries).

---

## Model + cost notes (per `model-routing`)

- Heavy nodes: L0, strategy synthesis, brand/claim verify, final assembly. ~4 nodes.
- Balanced: leads + copy/visual builders. Fast: the 3 research scouts + format verify.
- Cache AlignHCM brand tokens + context once (Step 0) → every child reuses it; don't resend per post.
- Budget guard: 12 posts × (copy + visual + 3 verifies) stays well under a builder-tier run ceiling
  because scouts and format-verify are Fast. Log the run's cost line per `eval-checklist.md`.

## Reuse

Swap the client + brand skill and this same graph builds a calendar for any client (Zen Spa → luxury
voice; IMMOHRTAL → artist voice). The graph is fixed; the voice, seed, and cadence are the variables.
