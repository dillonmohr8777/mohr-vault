# 11_Agents — The Marketing Agent Roster

The agent definitions the [[Master Agent]] (L0 commander) drives. This folder is the *who* — the roles,
delegations, decision logic, and escalation rules for each lane. The *how* — swarm topology, worker
contract, budgets, scheduling — lives in the runtime skill:
`claude-skills-repo/skills/morning-orchestrator/`.

## The roster

| Level | Agent | Lane | Reaches for first |
|-------|-------|------|-------------------|
| L0 | [[Master Agent]] | command | routes everything; owns the board + the one push |
| L1 | [[Google Ads Agent]] | ads | `campaign-intel`, `paid-ads` |
| L1 | [[Web Agent]] | web | `mirror`, `landing-page-generator`, `page-cro` |
| L1 | [[SEO Agent]] | seo | `ai-seo`, `seo-audit` |
| L1 | [[Reporting Agent]] | reporting | `client-report`, `metrics-pull` |
| L1 | [[Comms Agent]] | comms | `inbox-brief`, `email-sequence` |

L2 = one worker per client per lane. L3 = analyst facets (e.g. `campaign-intel`'s history / postmortem /
opportunity / creative). Delegation depth capped at 3; no agent below L3 spawns.

## The three rules that make it safe

1. **Route before build** — check `skill-map.json` for a matching skill before reinventing; pinned skills
   win ties; unmapped jobs get logged to `Morning Directives.md`, not guessed.
2. **Verify before surface** — nothing reaches the board or a report until a *separate verifier* has tried
   to refute it and failed. Default reject if uncertain; ties escalate to gated.
3. **Autonomy is total on everything reversible; the only gate is the irreversible last inch** — Tier 0
   auto, Tier 1 one morning approve-all, Tier 2 (spend/sends/publishes/credentials/moves) a live yes only.

## How a morning runs

`Morning Directives.md` (intake) → wake → pre-flight → the five lane leads fan out read-only scouts in
parallel → each output is adversarially verified → commander builds one ranked board → **one push** → on
one approval, the Tier-1 batch executes across parallel client tabs → readback + ledger → drafts delivered
(sends gated).

Steps intake→push run with no human. Dillon touches it once, at execution approval.

## Model routing

Who runs which node is cost-routed per `claude-skills-repo/skills/model-routing/`: heavy
reasoning/synthesis/final-QA on the top tier (Sol / Fable), high-volume research/drafting/formatting on
cheaper tiers or Claude workers. The commander is single-threaded; workers are cheap and parallel.

## Related

- `Morning Directives.md` — the drop-box you fill with freeform tasks (this folder).
- `memory-log.md` — append-only vault integrity sync log.
- `campaign-intel` skill — the ads learning engine + per-client optimization ledger.
