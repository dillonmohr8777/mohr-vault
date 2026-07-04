# Graphify Setup

Turns this vault (notes, docs, and the MCP server code) into a queryable
**knowledge graph** so Claude Code *and* Codex can answer questions about the
vault by querying a compact graph instead of reading every note.

Project: https://graphify.net — https://github.com/safishamsi/graphify

## What was wired in

The Graphify skill is installed for **both** assistants, project-scoped and
committed to the repo:

| Path | Purpose | Used by |
|---|---|---|
| `.claude/skills/graphify/` | Skill (`SKILL.md` + `references/`) | Claude Code |
| `.claude/settings.json` | `PreToolUse` hooks: nudge toward `graphify query` before grep/read | Claude Code |
| `CLAUDE.md` / `.claude/CLAUDE.md` | Graphify usage rules | Claude Code |
| `.codex/skills/graphify/` | Same skill for Codex | Codex |
| `.codex/hooks.json` | `PreToolUse` hook → `graphify hook-check` | Codex |
| `AGENTS.md` | Graphify usage rules | Codex |
| `.mcp.json` → `graphify` server | `python3 -m graphify.serve graphify-out/graph.json` (stdio) | Claude Code MCP |

`graphify-out/` (the built graph) is **git-ignored** — it is generated,
machine-local data. Rebuild it wherever you clone the vault.

## 1. Install the CLI (once per machine)

```bash
uv tool install graphifyy      # or: pipx install graphifyy  /  pip install graphifyy
```

The PyPI package is `graphifyy` (double-y); the command it installs is `graphify`.

The CLI (`query` / `path` / `explain` / `update`) works on its own. The
`graphify` **MCP server** in `.mcp.json` additionally needs the MCP SDK:

```bash
pip install mcp        # required only for the .mcp.json graphify server
```

## 2. Build the graph

From the vault root:

```bash
graphify update .        # AST-only, no API cost — good for a first pass / refresh
```

For the richer multi-modal graph (semantic extraction over notes, docs, PDFs,
images) run `/graphify .` inside Claude Code or Codex, or `graphify build .`
with an LLM backend configured. See `.claude/skills/graphify/references/` for
backend options.

Once `graphify-out/graph.json` exists, the `PreToolUse` hooks activate and the
`graphify` MCP server has something to serve — until then they no-op safely.

## 3. Use it

Terminal or inside either assistant:

```bash
graphify query "where are client notes structured?"
graphify explain "daily_note"
graphify path "process_inbox" "01_Clients"
```

Codex note: type `$graphify` (Codex) rather than `/graphify` (Claude Code). For
parallel extraction set `multi_agent = true` under `[features]` in
`~/.codex/config.toml`.

## 4. Keep it fresh

`graphify update .` re-extracts changed files with no API cost. The installed
hooks already prompt the assistant to run it after edits, and `graphify watch .`
can rebuild automatically on save.

## Uninstall

```bash
graphify uninstall           # removes graphify from all detected platforms
graphify uninstall --purge   # also deletes graphify-out/
```
