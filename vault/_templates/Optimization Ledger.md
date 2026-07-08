# {{Client}} — Optimization Ledger

The learning record. Every change the orchestrator applies is logged here as a **hypothesis** with an
expected outcome and a review date — then read back and labeled win/loss so the agents stop repeating
what failed and lean into what worked for THIS client.

Append only. Never overwrite. Managed by the `campaign-intel` skill.

## How to use
1. On applying a Tier-1 change → add a row with `verdict: pending` and a `review_on` date (~7 days out).
2. On/after `review_on` → pull the actual result, set `verdict` win/loss/neutral with the measured delta.
3. Losses roll up into "Mistakes Not To Repeat" and feed the next brief.

## Mistakes Not To Repeat (rolled up from losses)
- _(e.g. broad-match "affordable ___" burned $340 at 0 conv — keep exact/phrase)_

## What Works (rolled up from wins)
- _(e.g. call-only extensions on mobile lifted conv rate ~20%)_

## Change Log

| Date | Account | Change | Tier | Hypothesis / Expected | Review on | Verdict | Measured delta |
|------|---------|--------|------|-----------------------|-----------|---------|----------------|
|      |         |        |      |                       |           | pending |                |

## Machine-readable (jsonl — one object per change)
```jsonl
{"date":"","client":"{{Client}}","account":"","change":"","hypothesis":"","expected":"","tier":1,"review_on":"","verdict":null,"measured_delta":null}
```
