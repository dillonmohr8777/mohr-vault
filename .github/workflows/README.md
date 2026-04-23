# Routine Workflows

These GitHub Actions run the Claude routines defined in `vault/11_Agents/` on a schedule.

## Required secrets

Set these in **Settings → Secrets and variables → Actions**.

| Secret | Required for | How to get it |
|---|---|---|
| `ANTHROPIC_API_KEY` | all workflows | console.anthropic.com → API Keys |
| `GMAIL_OAUTH_TOKEN` | `gmail-to-vault-digest` only | Google Cloud Console + OAuth flow |

Until `ANTHROPIC_API_KEY` is set, none of these will succeed.

## Workflows

### `vault-integrity-sync.yml`
- **Schedule:** daily 06:00 UTC (≈02:00 ET)
- **Status:** enabled, no external deps
- **Safe to enable first.** Only reads/writes within the vault.

### `nightly-client-pulse.yml`
- **Schedule:** daily 02:00 UTC (≈22:00 ET the prior evening)
- **Status:** enabled, degrades gracefully without Gmail
- **Note:** Without `GMAIL_OAUTH_TOKEN`, step 5 is skipped and the output notes "Gmail not configured in CI."

### `gmail-to-vault-digest.yml`
- **Schedule:** DISABLED. `workflow_dispatch` only.
- **Blocker:** needs `GMAIL_OAUTH_TOKEN` secret + OAuth wiring.
- **To enable:** configure the secret, then uncomment the `schedule:` block in the workflow file.

## Time zones

GitHub Actions cron is **UTC only**. The times above assume Eastern Time:
- ET = UTC-4 during EDT (Mar-Nov)
- ET = UTC-5 during EST (Nov-Mar)

If you want a true 07:00 ET trigger year-round, you'll need two cron entries or just tolerate ±1hr drift across DST.

## How commits land

Each workflow commits to the default branch as `claude-routine-bot` with a message like `vault-integrity-sync: 2026-04-23`. If the routine produces no changes, no commit is made.

## Adding more routines

Copy `vault-integrity-sync.yml` as a template. Change:
1. Workflow `name:`
2. Cron schedule
3. Which routine file gets read (`11_Agents/<name>.md`)
4. Commit message prefix

## Troubleshooting

- **"command not found: claude"** — the npm install step failed. Check job logs.
- **API 401** — `ANTHROPIC_API_KEY` secret is missing or expired.
- **No commits being made** — run the routine once manually via `workflow_dispatch` and check the logs for what Claude actually wrote.
- **Routines running on the wrong branch** — scheduled runs only fire on the default branch. Merge this PR to main before expecting scheduled runs.
