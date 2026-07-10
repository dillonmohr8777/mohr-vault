# Orgo MCP Setup

Connects Claude to an Orgo virtual computer (cloud desktop for computer-use:
clicking, typing, screenshots, shell) so marketing workflows can drive tools
that have no clean API — ad managers, posting flows, dashboards.

Server: https://github.com/nickvasilescu/orgo-mcp

## 1. Get an API key
At https://www.orgo.ai/ → log in → Settings / Workspaces → **Generate API Key**.
Format: `sk_live_...`. Treat it like a password.

## 2. Store the key — NEVER in the repo
There is no value committed here; the repo only references `${ORGO_API_KEY}`.

**On Claude Code on the web (current setup):**
Add it as an environment variable in the environment settings
(claude.ai/code → environment selector → Edit → Environment variables):

```
ORGO_API_KEY=sk_live_your_real_key
```

**On the local Claude Code CLI:** export it in your shell instead:
```bash
export ORGO_API_KEY=sk_live_your_real_key
```

## 3. How the connection is wired
`.mcp.json` (repo root) uses Orgo's **hosted** endpoint, so no local install or
network-allowlist changes are needed — traffic goes to the hosted MCP and the
key travels in the `X-Orgo-API-Key` header, read from `ORGO_API_KEY`:

```json
{
  "mcpServers": {
    "orgo": {
      "type": "http",
      "url": "https://orgo-mcp.onrender.com/mcp",
      "headers": { "X-Orgo-API-Key": "${ORGO_API_KEY}" }
    }
  }
}
```

(Alternative — run it locally over stdio instead of the hosted endpoint:
`npx -y github:nickvasilescu/orgo-mcp` with `ORGO_API_KEY` in `env`.)

## 4. First call: health check
Once the key is saved and the session is restarted, run the `orgo_doctor`
tool first. It verifies auth source, API reachability, and latency, and tells
apart auth failures from network issues.

If the Orgo MCP is not loaded in the current session (see "Which session"
below), run the same check over plain HTTP instead — no MCP tool required:

```bash
ORGO_API_KEY=sk_live_... ./scripts/orgo-doctor.sh
```

A healthy result looks like `{"ok":true, "auth":{"configured":true,
"source":"http_header"}, "api":{"reachable":true,...}}`.

## Which session? (Orgo only loads when mohr-vault is the session root)
Claude Code loads the `.mcp.json` at the **root** of the session's working
directory. Orgo therefore connects automatically only when this repo,
`mohr-vault`, is the root — i.e. a **mohr-vault-only session**.

In a multi-repo session (where `mohr-vault` is just one subfolder under the
workspace root), `mohr-vault/.mcp.json` is not at the root, so the `orgo_*`
tools are not auto-registered. The config and key are still correct — verify
with `scripts/orgo-doctor.sh` above — but to use the Orgo tools natively
(e.g. Squarespace-via-Orgo), start a session pointed at `mohr-vault` alone.

## Autonomy / safety toggles
Runs full access by default. To tighten later (hosted endpoint accepts these as
headers; local stdio accepts them as env vars):

| Control | Effect |
|---|---|
| `ORGO_READ_ONLY=true` | Observation only (~10 tools: list/get, screenshot, download, doctor) |
| `ORGO_TOOLSETS=core,screen,files` | Limit enabled toolsets (core, admin, screen, shell, files) |
| `ORGO_DISABLED_TOOLS=orgo_bash` | Denylist specific tools |
| `ORGO_ENABLED_TOOLS=...` | Allowlist exact tools only |

## Security
Never commit `.env` files or a real `ORGO_API_KEY`. Environment variables in a
web environment are visible to anyone who can edit that environment — share
edit access accordingly.
