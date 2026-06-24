# Weekly Presentation Automation

This folder builds a branded PowerPoint deck from your weekly notes — automatically, every Sunday.

## What it does

Every Sunday the automation reads your notes from [`input/next.md`](input/next.md) and generates a branded `.pptx` deck. The generated deck is committed back into the repo (under [`output/`](output/)) so you can download it straight from GitHub, and — if you've configured Slack — it can also be posted to a Slack channel or DM.

## How the weekly loop works

1. **You edit the notes.** Open [`input/next.md`](input/next.md) and fill it in with the week's information before **Sunday 5 PM**. A ready-to-edit template lives there already.
2. **The deck builds itself.** On the schedule (or whenever you trigger a manual run), GitHub Actions installs the Python dependencies and runs the generator.
3. **Output lands in the repo.** The finished deck is written to `output/<date>-weekly.pptx` and committed back to the branch, so you can download it from the GitHub UI.
4. **The input is archived.** A copy of that week's `next.md` is saved under [`input/archive/`](input/archive/) so you keep a record of what each deck was built from.
5. **Memory is updated.** A log line is appended to [`MEMORY.md`](MEMORY.md) recording the run.

After a run, just edit `input/next.md` again for the following week.

## Input format

The generator parses a small, predictable subset of Markdown. Conventions:

| Markdown | Becomes |
| --- | --- |
| `# Title` | The deck title (use exactly one) |
| `> Subtitle` | The subtitle on the title slide |
| `## Section` | A new content slide, titled with the section name |
| `- bullet` or `* bullet` | A bullet on the current slide |
| `  - sub-bullet` | An indented sub-bullet (two leading spaces) |

Tiny example:

```markdown
# Weekly Update

> Week of June 24, 2026

## Wins This Week
- Closed the Q3 retainer
  - Two-year term, starts in July
- Shipped the new landing page

## Next Week's Focus
- Launch the summer email campaign
```

That input produces a title slide plus one content slide per `##` section, with nested bullets indented under their parents.

## Running it manually

**Locally:**

```bash
pip install -r presentations/requirements.txt
python presentations/generate.py
```

The deck is written into `presentations/output/`.

**Via GitHub Actions:** open the **Actions** tab, select the **Sunday Presentation** workflow, and click **Run workflow** (this is the `workflow_dispatch` trigger). The run does exactly what the scheduled run does.

## The schedule

The workflow runs on cron `0 21 * * 0` — every Sunday at **21:00 UTC**.

A few things to know about GitHub Actions cron:

- **Cron is always in UTC.** GitHub does not adjust for your local time zone.
- `21:00 UTC` is roughly **5 PM US Eastern during daylight saving time** (summer) and about **4 PM Eastern in winter** (standard time). GitHub won't shift this for you across the DST change — if you want a fixed local hour year-round you have to edit the cron when the clocks change.
- **To change the time/zone:** edit the `cron:` line in [`.github/workflows/sunday-presentation.yml`](../.github/workflows/sunday-presentation.yml). The five fields are `minute hour day-of-month month day-of-week`. For example, `0 22 * * 0` moves it an hour later (to 22:00 UTC).
- **Scheduled workflows only run from the repository's default branch.** This workflow will not fire on its schedule while it lives on a feature branch — it must be merged to `main` first. Until then, use a manual run (above) to test it.

## Slack delivery (optional)

By default the deck is committed to the repo and the Slack step is skipped. To also push the deck to Slack, add these repository secrets (**Settings → Secrets and variables → Actions**):

- `SLACK_BOT_TOKEN` — a Slack **bot** token with the `files:write` and `chat:write` scopes.
- `SLACK_CHANNEL_ID` — the destination: a channel ID, or your own user/DM ID if you want it delivered privately.

If either secret is missing, the workflow skips Slack gracefully and still commits the deck to the repo. Note that "for your eyes only" Slack delivery isn't a no-setup feature — it requires creating a Slack app / bot and granting it those scopes. Without that, downloading the committed `.pptx` from GitHub is the way to get your deck.

## Memory

[`MEMORY.md`](MEMORY.md) persists context across runs. It holds **Standing Notes** (durable preferences like tone, recurring sections, and branding) plus an append-only **Generation Log** that the generator adds to on every run.

## Files in this folder

| File / folder | Purpose |
| --- | --- |
| `generate.py` | The Python generator (uses `python-pptx`); reads `input/next.md` and writes a deck to `output/`. |
| `requirements.txt` | Python dependencies for the generator. |
| `input/next.md` | The template you edit each week with the deck's contents. |
| `input/archive/` | Archived copies of each week's input. |
| `output/` | Generated `.pptx` decks, committed back to the repo. |
| `MEMORY.md` | Standing notes plus the append-only generation log. |
| `README.md` | This file. |
