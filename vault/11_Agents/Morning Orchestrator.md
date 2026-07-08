# Morning Orchestrator (Order-Shooter)

Purpose: Run the daily pass on its own. Wake → pre-flight → fan out every agent in parallel across all
clients → build one approval board → send one push. On one approval, execute the reversible batch
across parallel remote Chrome tabs (one client per tab). Drives the existing agents; does not replace them.

Runs the `morning-orchestrator` + `campaign-intel` skills. Full spec:
`claude-skills-repo/skills/morning-orchestrator/SKILL.md`.

## Daily Loop
1. Wake (scheduled, no human).
2. Pre-flight per client: authorization valid? tracking tags/versions current? real conversion intent behind the ads?
3. Fan out scouts in parallel (read-only, Tier 0), all clients at once.
4. Synthesize the ranked approval board.
5. Push once to Dillon's phone.
6. On approval: execute Tier-1 batch across parallel Chrome tabs (start 3, up to 6).
7. Readback every change + log to the client's Optimization Ledger as a hypothesis.
8. Draft recaps (sends stay gated).

## Agents It Activates (parallel scouts)
- **Google Ads Agent** + `campaign-intel` → mistakes-not-to-repeat, ranked changes per client
- **Web Agent** / Web Design Lane → pages needing work, tracking gaps, mobile/CRO drafts
- **Reporting Agent** → what's due, dashboard/Slack/Gmail reconciliation, metric QA
- **SEO Agent** → content due, schema/extractability, authority tasks
- **Comms** (Gmail/Slack read) → client asks/approvals/dates → drafts only
- **Master Agent** → the commander role (routing, logs, summaries)

## Approval Tiers
- **Tier 0 — auto:** read, analyze, find mistakes, draft, QA, build artifacts. No gate.
- **Tier 1 — one morning approval:** reversible ads/web tweaks (negatives, pause a wasteful keyword, fix a broken CTA, tighten schedule, swap a QA'd creative). Batched onto the push. Executes for all clients on one yes.
- **Tier 2 — live only:** budget/bid up, new campaigns, changing conversion goals, Gmail send, Slack post, publish/deploy, billing, credentials/2FA. Never in the batch.

Rule: if Dillon can undo it in 30 seconds it's Tier 1; irreversible or outbound is Tier 2.

## Rules
- Evidence beats memory. Verify live state before acting.
- Never overwrite client source notes; append to logs and the ledger only.
- One commander; one level of delegation (scouts don't spawn scouts).
- One tab = one client = one CDP context; never two writers on the same account.
- If a session is expired, mark `needs-reauth` and continue other clients — never auto-login or 2FA.
- Tier-2 waits for a live yes. No timeout auto-apply.
- Authenticated Chrome work runs on the 64GB machine; analysis/board/reports are cloud-safe.

## Run Artifacts
`automation-runs/morning-orchestrator/YYYY-MM-DD/` → `run-state.json`, `approval-board.md`,
`tier1-batch.json`, `tier2-queue.md`, `evidence-log.md`, `ledger-updates.jsonl`.
