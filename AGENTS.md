# AGENTS.md — instructions for coding agents (Codex, Claude Code, etc.)

This repo drives the **Zen Spa at Tropicana** website build on Squarespace.

## Start here
1. Read **`ZEN_SPA_BUILD_SPEC.md`** — the full build spec (client's 13-item brief, 3 homepage mockups,
   exact color palette, fonts, header/hamburger layout, homepage assembly, brand-logo grid, nav order,
   mobile checklist, and per-item status).
2. Read **`RUN.md`** — how to launch and connect to the browser (attach to a local Chrome via Playwright
   MCP on `localhost:9222`) and the kickoff prompt.

## What you're doing
Building/finishing the Squarespace site at **zenspatropicana.squarespace.com** (live: zenspatropicana.com),
controlling a real logged-in Chrome via the **playwright** MCP server.

## Hard rules
- **Fully native** Squarespace drag-and-drop only. First task: strip the external Netlify code injection
  (keep the `google-site-verification` meta; set the favicon natively).
- Use the **exact color palette** and the **exact official brand logos** named in the spec — nothing else.
- Homepage = **only** the content in the 3 mockups, in order.
- **Save frequently.** Squarespace keeps version history, but **pause and ask the human before Publishing
  live or deleting existing sections.**

## Still-needed inputs (ask the human if not provided)
- The **final service menu** (service names, times, pricing) — blocks service-page copy/pricing.
- The **booking platform** (Book Now target) — for buttons + footer privacy requirements.
