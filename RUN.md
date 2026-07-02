# RUN — Drive the Zen Spa build from your own computer (stable, hours-long)

This runs Claude Code **on your machine** and lets it control **your real Chrome** (already logged
into Squarespace) via **Playwright MCP** — DOM-level control, no crashes, no coordinate guessing.
The build instructions live in `ZEN_SPA_BUILD_SPEC.md`.

> Everything below runs on YOUR computer. It's ~5 minutes, mostly copy-paste. Claude cannot do these
> steps remotely — they need your local machine — but the repo is pre-wired so there's nothing to configure.

---

## Prerequisites (one time)
- **Node.js 18+** (for `npx`). Check: `node -v`. Install from https://nodejs.org if missing.
- **Google Chrome**, logged into your Squarespace account.
- **Claude Code** — desktop app from https://claude.ai/code, or CLI: `npm install -g @anthropic-ai/claude-code`.

## Step 1 — Get the repo
```bash
git clone https://github.com/dillonmohr8777/mohr-vault.git   # or: cd into your existing clone
cd mohr-vault
git checkout claude/zen-spa-squarespace-handoff-c8nk6a
git pull
```

## Step 2 — Launch Chrome with a debugging port
Fully quit Chrome first (Cmd/Ctrl-Q — not just close the window), then relaunch with the port so
Claude can attach to your logged-in session:

- **macOS:**
  ```bash
  /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222
  ```
- **Windows (PowerShell):**
  ```powershell
  & "C:\Program Files\Google\Chrome\Application\chrome.exe" --remote-debugging-port=9222
  ```
- **Linux:**
  ```bash
  google-chrome --remote-debugging-port=9222
  ```
In that Chrome window, open **zenspatropicana.squarespace.com** and confirm you're logged in.

## Step 3 — (Optional) Orgo fallback
If you also want the cloud VMs available, export your Orgo key first (same `sk_live_...` key from your
web environment settings). Not required for the Chrome path:
```bash
export ORGO_API_KEY=sk_live_your_real_key
```

## Step 4 — Launch Claude Code and connect
From the `mohr-vault` folder:
```bash
claude
```
- Approve the **playwright** MCP server when prompted (and **orgo** if you set the key).
- The Playwright server auto-attaches to your Chrome on port 9222 (configured in `.mcp.json`).

## Step 5 — Kick off the build (paste this)
```
Attach to my Chrome via Playwright, open the Zen Spa Squarespace editor
(zenspatropicana.squarespace.com), and read ZEN_SPA_BUILD_SPEC.md. Execute the build in order:
(1) strip the Netlify code injection under Settings → Code Injection, keeping the
google-site-verification meta and setting the favicon natively;
(2) apply the exact color palette in Site Styles;
(3) set the fonts (Cormorant Garamond headings / PT Serif body, or confirm with me);
(4) make the header sticky with Book Now + hamburger and fix the Book Now/nav overlap;
(5) build the homepage to match the 3 mockups only, in order;
(6) create the nav placeholder pages in the exact order.
Work in the editor, Save frequently, and check the mobile preview as you go. Pause and ask me before
Publishing anything live, and before deleting existing sections.
```

---

## Safety notes
- **Reversible:** Squarespace keeps page **version history** and Site Styles can be reverted, so edits
  are recoverable. Still, the kickoff prompt tells Claude to **pause before Publishing** and **before
  deleting** existing content — approve those explicitly.
- **The debug port is local-only** (`localhost:9222`) — not exposed to the internet. Still, close that
  Chrome window (and reopen Chrome normally) when the session is done.
- **Keep the machine awake** for the duration (disable sleep) so the session runs uninterrupted.
- **Don't drive that Chrome window yourself** mid-run — let Claude have it; open a separate browser/profile
  for your own use if needed.

## Still needed to finish the build (hand these to the session)
1. **The final service menu** — never arrived; service pricing/copy is blocked without it. Attach the file.
2. **Booking platform** (Book Now target: Vagaro / Boulevard / etc.) — for the buttons + footer privacy (#13).

## Troubleshooting
- *Playwright can't connect:* make sure Chrome was launched with `--remote-debugging-port=9222` and is
  still open; visit `http://localhost:9222/json/version` in another browser to confirm the port responds.
- *`npx` not found:* install Node.js (see prerequisites).
- *Squarespace editor sluggish:* it's a heavy app; give pages a moment to load. Your machine's RAM avoids
  the 4GB "Aw Snap" crashes the cloud VMs hit.
