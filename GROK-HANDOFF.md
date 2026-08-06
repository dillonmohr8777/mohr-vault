# Grok handoff: Mohr Vault

Snapshot: 2026-08-06  
Repository: `dillonmohr8777/mohr-vault`  
Reviewed `main`: `4df22f56a1261e835f910b9cc815c826f230f0b0`

Mohr Vault is a historical/supporting Obsidian-style marketing vault with agent definitions and an Orgo MCP server package. It is not the current canonical client queue and must not supersede Dillon OS `12_Brain/` or Client Operations.

## Current structure

- `vault/`: historical client, campaign, content, SOP, session, agent, report, and template notes.
- `mcp-server/`: Orgo-related MCP implementation and dependencies.
- `.claude/`: repository-local agent/skill context.
- `system-prompt.md`, `SETUP.md`, `ORGO_MCP_SETUP.md`, `.mcp.json`, and `mcp-config.json`: runtime/setup documentation and non-secret configuration shape.

## Authority and privacy

- Current Dillon OS Git state and `12_Brain/` outrank this vault for Dillon's personal operating system.
- `client-operations-canonical` registry, queue, source evidence, approvals, and client folders outrank this vault for client work.
- Use this repository for historical context and recovery, then re-verify current facts.
- Never commit credentials, MCP secrets, raw communications, or direct identifiers.

## Open pull requests

There are 10 open draft PRs. The most relevant handoff inputs are:

- `#7`: Zen Spa competitor research agent and SOP.
- `#9`: Zen Spa Squarespace website build handoff.
- `#10`: Dillon OS/Obsidian second-brain wiring.
- `#12`: Morning Orchestrator, web-design lane, and optimization ledger; currently dirty against `main`.
- `#13`: repeatable Orgo MCP connection doctor.

The other drafts cover a plant identifier, Fresh Blends weekly presentation automation, and Momentum 360 video work. Review them by destination project; do not merge all historical vault content into current canonical systems.

## Local clone warning

The older reference clone under `C:\Users\dillo\Documents\Codex\2026-07-09\go\work\mohr-vault-ref` shows thousands of tracked deletions, mostly `mcp-server/node_modules` and old vault files. That is not a valid “latest” snapshot and must not be pushed. Use a clean clone of `main` plus selected reviewed PR content.

## Grok: next 48 hours

1. Use this handoff and the open PRs as an index into historical context.
2. Reconcile only still-current, redacted decisions into Dillon OS or Client Operations through their supported workflows.
3. For Zen Spa, first confirm the inactive registry status and current business identity before acting on PR `#7` or `#9`.
4. Run the Orgo doctor from PR `#13` only if that MCP route is actually needed; do not expose or invent credentials.
5. Close or archive superseded vault PRs after preserving unique, current-safe material.
