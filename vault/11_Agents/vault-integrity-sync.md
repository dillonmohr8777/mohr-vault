---
routine: vault-integrity-sync
cadence: Daily 2:00 AM
writes_to: System/claude-memory-sync.md, Reports/system-insights.md
tier: 0
---

# Vault Integrity Sync

## Trigger
Daily 2:00 AM. Keeps the vault self-consistent.

## Inputs
- Entire vault tree
- Prior `System/claude-memory-sync.md`

## Steps
1. Check all `01_Clients/*/` folders have: Agent Memory.md, Reporting Log.md, Ads/, Reports/, SEO/
2. Check folder naming consistency (numbered prefix convention)
3. Check for stale frontmatter: any `due <` today, any `last_touched >` 14 days
4. Detect duplicate folders (case-mismatch, ads vs Ads)
5. Rewrite `System/claude-memory-sync.md` with current state
6. Append any issues detected to `Reports/system-insights.md`

## Output: claude-memory-sync.md rewrite
Full current state of operator + priorities + client statuses. See existing file for format.

## Output: system-insights.md append
```
## YYYY-MM-DD Sync
- Clients scanned: N
- Missing files: [list]
- Stale frontmatter: [list]
- Naming drift: [list]
- Actions taken: [list]
```

## Success criteria
- No client folder missing canonical files
- claude-memory-sync.md reflects current reality (not yesterday's)
- Any drift is logged, not silently fixed

## Safe writes
- Never overwrite Agent Memory or Reporting Log — append only
- If a file is missing, create from template, don't fabricate content
