# Orgo MCP Setup

Connects Claude to an Orgo virtual computer (cloud desktop for computer-use:
clicking, typing, screenshots, shell) so marketing workflows can drive tools
that have no clean API — ad managers, posting flows, dashboards.

Server: https://github.com/nickvasilescu/orgo-mcp

## 1. Get an API key
Create a key in your Orgo dashboard (format `sk_live_...`).

## 2. Add the key
The key is **not** committed. Replace the placeholder in `mcp-config.json`
(`REPLACE_WITH_YOUR_ORGO_API_KEY`) locally, or export it before launch:

```bash
export ORGO_API_KEY=sk_live_xxx
```

`ORGO_DEFAULT_COMPUTER_ID` is optional — set it to skip passing a computer id
on every call.

## 3. First call: health check
Run the `orgo_doctor` tool first. It verifies auth source, API reachability,
and round-trip latency, and distinguishes auth failures from network issues.

## Autonomy / safety toggles
Current config runs **full access** (all toolsets) per the hands-off setup.
The server ships graduated controls if you ever want to tighten it:

| Env var | Effect |
|---|---|
| `ORGO_READ_ONLY=true` | Observation only (~10 tools: list/get, screenshot, download, doctor) |
| `ORGO_TOOLSETS=core,screen,files` | Limit enabled toolsets (options: core, admin, screen, shell, files) |
| `ORGO_DISABLED_TOOLS=orgo_bash` | Denylist specific tools |
| `ORGO_ENABLED_TOOLS=...` | Allowlist exact tools only |

Note: this config makes Orgo available to the **local Claude Code CLI**. To use
it inside a Claude Code on the web session, register the same server at the
environment/MCP level — repo config alone is not loaded by web sessions.

## Security
Never commit `.env` files or a real `ORGO_API_KEY`. The placeholder stays in
version control; the real key lives only in your local env.
