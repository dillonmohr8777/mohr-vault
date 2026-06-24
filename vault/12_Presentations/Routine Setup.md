# Routine Setup: Arming the Sunday 5 PM Reminder

## Why this is a manual step
Recurring reminders run on Claude Code's native **Routines** feature. Routines **cannot be created from inside a web session** — the owner has to set this up once. Do it from the web UI or a local terminal, then it fires on its own every week.

## Setup via the web UI
1. Go to **claude.ai/code/routines**.
2. **New routine**.
3. Trigger type: **Schedule**.
4. Frequency: **Weekly**.
5. Day: **Sunday**.
6. Time: **17:00 local time** (5:00 PM).
7. Point the routine at the **`dillonmohr8777/mohr-vault`** repo.
8. Paste the routine prompt below.
9. Save / enable.

## Setup via the CLI (alternative)
From a local terminal in the repo, run:

```
/schedule every Sunday at 5pm, <paste the routine prompt below>
```

## How it behaves
- Each run spawns a **fresh cloud session** — it does not message an existing chat. So the routine prompt is written to **produce the deck and open a draft PR**, which is how you receive the result.
- Minimum routine interval is **1 hour**; weekly is well within that.
- Routines are a **research preview** and may be **gated by the alignhcm.com org admin** — if it's unavailable, ask the org admin to enable it.

## Routine prompt (ready to paste)

```
It's Sunday 5 PM — weekly presentation time. Read CLAUDE.md and vault/04_SOPs/Sunday Presentation SOP.md first. Gather this week's activity from vault/01_Clients/*/Reporting Log.md, vault/02_Campaigns/, and vault/Reports/system-insights.md, plus any info Dillon left for this week in vault/00_Inbox/. Copy vault/12_Presentations/_Presentation Template.md, fill it in for the week, and save it as vault/12_Presentations/<YYYY-MM-DD> Weekly Presentation.md, matching the format of the prior decks already in that folder. Do NOT invent client data — use only what's in the vault and what Dillon provided. Commit on a new branch and open a draft PR with the deck.
```
