# SOP: Sunday Weekly Presentation

## When to Use
Every Sunday at 5:00 PM. A recurring reminder fires for this. To arm the recurring reminder, see `vault/12_Presentations/Routine Setup.md`.

## Inputs
- Owner-provided info for the week (Dillon feeds this in before each Sunday).
- The week's vault activity:
  - `01_Clients/*/Reporting Log.md` - per-client performance and changes
  - `02_Campaigns/` - campaign status and updates
  - `Reports/system-insights.md` - trends, gaps, opportunities
- Prior decks in `12_Presentations/` - match their format.

## Steps
1. **Gather.** Pull Dillon's provided info + the week's reporting logs, campaign updates, and system insights. Do NOT invent client data - use only what's provided or in the vault.
2. **Copy template.** Duplicate `12_Presentations/_Presentation Template.md`.
3. **Fill.** Replace `{{variables}}` - date, presenter, per-client status, wins, problems/patterns, next-week priorities, asks/decisions. Repeat the client status slide per active client.
4. **Save.** Write to `12_Presentations/YYYY-MM-DD Weekly Presentation.md` (date of that Sunday).
5. **Stay consistent.** Keep the slide structure identical to prior decks in the folder.
6. **Notify.** Send Dillon a Slack summary with the deck link.

## Tools Needed
- Obsidian vault (MCP)
- `marp` CLI for export: `marp "YYYY-MM-DD Weekly Presentation.md" --pptx` (or `--pdf` / `--html`)

## Output Format
Marp-compatible Markdown (front matter `marp: true`, slides split by `---`), convertible to PPTX / PDF / HTML.

## Notes
- Each deck reflects the prior ones - format consistency week over week is the point.
- Skip clients with no activity rather than padding with empty placeholders.

## Last Updated
2026-06-24
