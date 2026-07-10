# 📊 Weekly Presentation System — #fresh-blends

> **Persistent memory for the recurring Sunday presentation routine.**
> Read this FIRST before generating a weekly deck. It is the source of truth so the routine survives across Claude sessions (sessions are ephemeral; this file is not).

## Purpose
Dillon runs a weekly presentation cadence out of the Slack channel **#fresh-blends**. Each week he feeds information into the channel; Claude studies it and produces a presentation that reflects what's in the channel that week ("reflecting the ones in here").

## Cadence & Reminder
- **When:** Every **Sunday at 5:00 PM** (see timezone note).
- **Reminder mechanism:** GitHub Actions scheduled workflow `.github/workflows/sunday-presentation-reminder.yml` opens a reminder issue every Sunday. The cron lives in the repo (not in a single chat) so it actually recurs.
- **Timezone:** Cron is currently set to 5 PM **US Eastern**. GitHub Actions cron runs in **UTC and does NOT auto-adjust for daylight saving**, so it fires at 5 PM EDT in summer / 4 PM EST in winter. Edit the `cron:` line in the workflow to change the time or zone.

## Weekly Workflow
1. **Before Sunday** — Dillon feeds the week's info into #fresh-blends (updates, metrics, wins, blockers, topics).
2. **Sunday 5 PM** — reminder issue fires.
3. **Generate** — Claude:
   - Reads the latest info from the channel / this vault.
   - Copies `_Weekly_Presentation_Template.md`.
   - Saves it as `YYYY-MM-DD_Fresh-Blends_Weekly.md` (date = that Sunday) in this folder.
   - Fills each section from the week's fed info, keeping the same structure as prior weeks.
   - Commits it under `vault/12_Presentations/`.
4. **Review** — Dillon reviews and requests edits.

## Conventions
- One dated file per week.
- Keep the section structure consistent week to week so decks are comparable.
- The template is **Marp-compatible** (YAML `marp: true` + `---` slide breaks) so it can render as actual slides.
- Pull supporting data from relevant client folders in `01_Clients/` when applicable.

## Source
Initiated from Slack #fresh-blends on 2026-06-24.

## Change log
- 2026-06-24 — System created: persistent memory, Marp template, first scaffold deck, and Sunday 5 PM reminder workflow added.
