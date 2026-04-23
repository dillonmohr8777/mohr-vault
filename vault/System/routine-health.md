---
last_updated: 2026-04-23
status: ported from personal account, not yet scheduled on this vault
---

# Routine Health

Source of truth for every recurring routine that reads/writes this vault.

## Active Routines (ported from personal account)

| Routine | Cadence | Trigger | Reads | Writes | Status |
|---|---|---|---|---|---|
| `vault-integrity-sync` | Daily 2:00 AM | cron | entire vault | `System/claude-memory-sync.md`, `Reports/system-insights.md` | Defined, not scheduled |
| `gmail-to-vault-digest` | Daily 7:00 AM | cron | Gmail (13+ contacts) | `System/urgent-replies.md`, client overviews | Defined, not scheduled |
| `nightly-client-pulse` | Daily evening | cron | client overviews, Gmail, calendar | `Daily-Briefs/pulse-today.md` | Defined, not scheduled |
| `chat-to-vault-sync` | Every 2 hours | cron | recent Claude conversations | Agent Memory, Decision Logs | Defined, not scheduled |
| `bok-law-social-content` | Sunday | cron | `01_Clients/Bok Law/` | `01_Clients/Bok Law/weekly-content-YYYY-MM-DD.md` | Defined, not scheduled |
| `linkedin-growth-engine` | Sunday | cron | `02_FullTimeJob/AlignHCM/linkedin-calendar.md` | LinkedIn drafts per author | Defined, not scheduled |
| `book-site-seo-sweep` | Thursday | cron | `05_Book/seo-strategy.md` | book SEO reports | Defined, not scheduled |

## Proposed Additions (this vault)

| Routine | Cadence | Purpose |
|---|---|---|
| `daily-morning-kickoff` | 7 AM weekdays | aggregate priorities, calendar, overdue actions |
| `daily-evening-wrap` | 6 PM weekdays | prompt for wins/blockers, append to Decision Logs |
| `weekly-monday-planner` | Mon 7 AM | cross-client week view, set 3 focus areas |
| `weekly-friday-review` | Fri 4 PM | patterns, graduation of insights into SOPs |
| `monthly-rollup` | Last day of month | cross-client Reporting Log rollup |
| `monthly-vault-health` | 1st of month | integrity sync, naming drift check, gap detection |
| `align-hubspot-audit` | Weekly | HubSpot workflow + property hygiene |
| `align-semrush-rank-snapshot` | Weekly | rank delta vs prior snapshot |

## Scheduling Options

1. **GitHub Actions** (recommended) — this vault is a git repo. Each routine becomes a `.github/workflows/*.yml` with cron + headless Claude invocation.
2. **Local cron** — runs from an always-on machine against a local clone.
3. **Claude Code on web scheduled sessions** — newer option.

## Dependencies

- `ANTHROPIC_API_KEY` as GitHub secret (for GHA path)
- Slack webhooks: Obsidian Vault + Momentum 360 (webhook URLs live in `.claude/secrets.json`, gitignored)
- Gmail API access (OAuth, configured on personal account only currently)
