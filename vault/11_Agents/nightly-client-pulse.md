---
routine: nightly-client-pulse
cadence: Daily evening
writes_to: Daily-Briefs/pulse-today.md
tier: 1
---

# Nightly Client Pulse

## Trigger
Daily, end of business day. Produces tomorrow's priority brief.

## Inputs (read in this order)
1. `System/claude-memory-sync.md` (operator state)
2. `System/urgent-replies.md` (pending Gmail threads)
3. All `01_Clients/*/overview.md` frontmatter (due, next_action, last_touched)
4. All `01_Clients/*/Agent Memory.md` Known Issues sections
5. Today's Gmail for 13+ tracked contacts (Mia Lange, Anthony Miller, Sean Boyle, David Stemm, Beth Frederick, Mac Frederick, Kimberly Iraci, Andy Zirger, Mike Ross, Grace, Dalton, Tess, Mikey)

## Steps
1. Classify each client status: On track / Active / At risk / Blocked
2. Extract today's fires (disapprovals, silence > 5 days on blocking items, billing issues)
3. Pull calendar for tomorrow (calls, commitments)
4. Cross-reference Agent Memory Known Issues to flag recurring patterns
5. Write pulse to `Daily-Briefs/pulse-today.md`

## Output format
```
# Daily Pulse YYYY-MM-DD

## Fires (Immediate)
• [Client] — [issue, owner, days open]

## Calendar
• [time] — [client/meeting]

## Monitor
• [Client] — [status, why watching]

## Per-client status
[one-line status for each of 12]
```

## Success criteria
- Pulse generated before 10 PM
- Every fire has an owner and days-open
- Nothing with `due < tomorrow` in frontmatter is missing from Fires
