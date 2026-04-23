---
purpose: Handoff brief to Dillon's personal-account Claude
from: mohr-vault work account (claude/obsidian-vault-access-BSrjT)
last_updated: 2026-04-23
---

# Handoff Brief to Personal Claude

You and I are both Claude instances working for Dillon. I run inside the `mohr-vault` git repo on his work/Align-focused account. You run in his personal account with the live routines, Gmail access, Slack webhooks, and the populated AlignHCM / Book / DBA sections. Different vaults, same operator. This brief aligns us so we compound in parallel instead of drifting.

## The two vaults

**Your vault (personal, production):**
- Live routines running: nightly-client-pulse, gmail-to-vault-digest, vault-integrity-sync, chat-to-vault-sync, bok-law-social-content, linkedin-growth-engine, book-site-seo-sweep
- Gmail access wired for 13+ contacts
- Slack webhooks for Obsidian Vault and Momentum 360 channels
- `System/slack-routine.py` built (sandbox currently blocks outbound HTTP)
- Populated: `02_FullTimeJob/AlignHCM/`, `05_Book/`, `07_DBA/`, 10 client Agent Memory files

**My vault (mohr-vault, structural):**
- Branch: `claude/obsidian-vault-access-BSrjT`
- Contains now:
  - `System/writing-rules.md`, `System/routine-health.md`, `System/claude-memory-sync.md`
  - 10 Agent Memory files ported from your work (Bar Crawl, KJB, Shadow HVAC, Hardwood, NKCDC, Omega, Fresh Blends, LinkEZE, Onsite, Jeff Hozias)
  - 7 routine definitions in `11_Agents/` reframed as context-engineered SOPs
  - 3 GitHub Actions workflows (`vault-integrity-sync`, `nightly-client-pulse`, `gmail-to-vault-digest`)
- Still empty on my side: Bok Law Agent Memory, AlignHCM/Book/DBA folder contents, Decision Logs per client
- Not yet scheduled. Needs `ANTHROPIC_API_KEY` secret + merge to main to activate GHA.

## Design rules (universal, apply in both accounts)

**Writing (non-negotiable):**
- No em dashes. Ever.
- Never start a sentence with: And, But, Or, It is, Do not, That is, This is
- Always use contractions
- Bullet character only for list markers
- No AI-sounding language (delve, tapestry, navigate the complexities of, furthermore)
- Direct operator voice: "Got this live," "Pulled the numbers," "Blocked on"

**Context engineering (Anthropic "Effective context engineering for AI agents"):**
1. Agent Memory = pilot checklist, max 3-5 high-signal bullets per section. Not a wiki.
2. Tiered loading: `00_Memory_File` → specific client Agent Memory → just-in-time Decision Log rows. Never load the whole vault.
3. Archive is not active context. Raw transcripts, CSVs, full email threads go to `09_Transcripts/` and `08_Assets/`. Only extracted decisions carry forward.
4. System prompts at the right altitude: specific inputs, numbered steps, exact output paths, success criteria. Concrete over longer.
5. Skills are compression. Reusable chunks referenced by multiple agents beat duplicated instructions.
6. Outputs structured. Tables and dated one-liners, not prose.

## Coordination protocol (we're not integrated)

1. **You are primary for live ops.** Routines, Gmail, daily pulses, Slack posts. Don't hand that off.
2. **I am primary for structural work.** Vault architecture, agent/SOP design, GHA workflows, git hygiene.
3. **Dillon brokers updates between us.** When you surface operational intel (new client state, shifted process, pattern), ask him to paste it to me and I'll port to `mohr-vault`. When I ship structural changes (new SOP, updated writing rules, schema change), he'll paste to you.
4. **`System/writing-rules.md` is canonical.** Apply in all output.
5. **`System/claude-memory-sync.md` is the shared operator snapshot.** When either of us meaningfully updates it, flag for cross-paste.

## What I'd like from you

- Acknowledge the writing rules and apply going forward.
- When you generate any output meant to persist (not just a chat response), format it as a paste-ready block with a filename suggestion so Dillon can port it to `mohr-vault` in one copy.
- Don't try to access the `mohr-vault` repo directly. You don't have access. Route through Dillon.
- Don't duplicate the `slack-routine.py` flow. That's yours. I have no equivalent yet and shouldn't.
- If Dillon asks you to produce content that Align HCM shouldn't see (M360 client work, Buzz Bull, freelance), keep it in your lane — never reference M360 from Align contexts.

## Open items (Dillon's action queue)

1. Merge `claude/obsidian-vault-access-BSrjT` to main (unblocks GHA schedule)
2. Set `ANTHROPIC_API_KEY` secret on mohr-vault repo
3. Wire Gmail OAuth for mohr-vault (`GMAIL_OAUTH_TOKEN` secret) — `gmail-to-vault-digest` stays manual-only until then
4. Port `slack-routine.py` to mohr-vault (low priority, can stay on personal)
5. Populate AlignHCM / Book / DBA contents in mohr-vault from personal
6. Roll out Decision Log per client (template exists in `_templates/`, not yet deployed)

## Operator snapshot

- Dillon Mohr
- Full-time: Align HCM (W2, ~40 hrs/week) — priority 1
- Agency: Momentum 360 (12 active clients) — priority 2
- Freelance: Meadow Creek + direct clients
- Writing: book "The Ironic Ineptocracy" (ironicineptocracy.com), target 2,000 subs / 4 months
- Graduate: DBA Strategic Media, Liberty University
- Comm style: concise, action-first, no hand-holding. Batch review. Operator voice.
