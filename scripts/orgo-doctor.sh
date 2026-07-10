#!/usr/bin/env bash
#
# orgo-doctor.sh — health-check the Orgo MCP connection from any shell.
#
# Runs the same `orgo_doctor` check the Orgo MCP exposes as a tool, but over
# plain HTTP so it works even in a session where the Orgo MCP server is not
# loaded (e.g. a multi-repo session where mohr-vault is not the root — see
# ORGO_MCP_SETUP.md, "Which session"). Verifies: key present, endpoint
# reachable, auth accepted, and reports latency.
#
# Usage:
#   ORGO_API_KEY=sk_live_... ./scripts/orgo-doctor.sh
#
# Exit codes: 0 = healthy, 1 = misconfigured/unreachable/auth failure.

set -euo pipefail

# Endpoint: read from .mcp.json next to the repo root if present, else default.
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
MCP_JSON="$REPO_ROOT/.mcp.json"
URL="https://orgo-mcp.onrender.com/mcp"
if [ -f "$MCP_JSON" ]; then
  parsed="$(grep -oE 'https?://[^"]+/mcp' "$MCP_JSON" | head -1 || true)"
  [ -n "$parsed" ] && URL="$parsed"
fi

fail() { echo "orgo_doctor: FAIL — $1" >&2; exit 1; }

[ -n "${ORGO_API_KEY:-}" ] || fail "ORGO_API_KEY is not set (add it to the environment; never commit it)."

echo "orgo_doctor — Orgo MCP health check"
echo "  endpoint : $URL"
echo "  key      : ${ORGO_API_KEY:0:8}… (len=${#ORGO_API_KEY}, from ORGO_API_KEY)"
echo

common=(-sS -m 90
  -H "Content-Type: application/json"
  -H "Accept: application/json, text/event-stream"
  -H "X-Orgo-API-Key: $ORGO_API_KEY")

# 1) initialize (capture the MCP session id from the response headers)
hdr="$(mktemp)"
trap 'rm -f "$hdr"' EXIT
curl "${common[@]}" -D "$hdr" -o /dev/null -X POST "$URL" \
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"orgo-doctor","version":"1.0.0"}}}' \
  || fail "could not reach $URL (network/proxy or the hosted server is down/cold-starting — retry once)."
sid="$(grep -i '^mcp-session-id:' "$hdr" | awk '{print $2}' | tr -d '\r' || true)"

sidhdr=()
[ -n "$sid" ] && sidhdr=(-H "Mcp-Session-Id: $sid")

# 2) notifications/initialized (protocol handshake completion)
curl "${common[@]}" "${sidhdr[@]}" -o /dev/null -X POST "$URL" \
  -d '{"jsonrpc":"2.0","method":"notifications/initialized"}' || true

# 3) tools/call orgo_doctor
resp="$(curl "${common[@]}" "${sidhdr[@]}" -X POST "$URL" \
  -d '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"orgo_doctor","arguments":{}}}')" \
  || fail "orgo_doctor tool call failed to return."

# The result is JSON-RPC over SSE; the doctor payload is a JSON string inside
# result.content[0].text. Pull it out and pretty-print.
payload="$(printf '%s' "$resp" | sed -n 's/^data: //p' | tail -1)"

if command -v python3 >/dev/null 2>&1; then
  python3 - "$payload" <<'PY'
import json, sys
try:
    env = json.loads(sys.argv[1])
    doc = json.loads(env["result"]["content"][0]["text"])
except Exception:
    print("orgo_doctor: FAIL — unexpected response:\n" + sys.argv[1], file=sys.stderr)
    sys.exit(1)
print("Result:")
print(json.dumps(doc, indent=2))
ok = doc.get("ok") and doc.get("api", {}).get("reachable")
if not ok:
    print("\norgo_doctor: FAIL", file=sys.stderr); sys.exit(1)
lat = doc.get("api", {}).get("latency_ms")
src = doc.get("auth", {}).get("source")
print(f"\norgo_doctor: PASS — auth OK (source={src}), API reachable, latency={lat}ms")
PY
else
  echo "$payload"
  printf '%s' "$payload" | grep -q '"ok":true' \
    && echo "orgo_doctor: PASS" \
    || fail "doctor reported not-ok."
fi
