---
routine: gmail-to-vault-digest
cadence: Daily 7:00 AM
writes_to: System/urgent-replies.md, client overviews
tier: 1
---

# Gmail to Vault Digest

## Trigger
Daily 7:00 AM. Seeds the inbox-state for the day before work starts.

## Inputs
- Gmail inbox (unread + flagged threads, last 24 hours)
- Tracked contacts per client (see `System/m360-leadership-notes.md`)
- `System/urgent-replies.md` (prior state)

## Steps
1. For each tracked contact, fetch threads from last 24h
2. Classify: needs reply / informational / resolved
3. Merge with prior urgent-replies, mark resolved items as closed
4. For each client with new inbound, append a one-line intel note to `01_Clients/[Client]/overview.md` → "Recent Gmail" section
5. Rewrite `System/urgent-replies.md` with current urgent list

## Output format (urgent-replies.md)
```
---
last_updated: YYYY-MM-DD HH:MM
---

## Needs Reply Today
• [Client] — [contact] — [subject] — [days since inbound]

## Needs Reply This Week
• ...

## Waiting On External
• ...
```

## Success criteria
- Every unread thread from tracked contacts is classified
- No duplicate items (merge by thread ID, not subject)
- Resolved items moved to closed log, not deleted

## Edge cases
- Contacts with no email on file (Andy: info@barcrawlusa.com, Kim: kimberly@kimberlyjamesbridal.com) — now wired. Still: match on name as fallback.
- Kim's replies are short — "Thank you" counts as resolution on content-approval threads.
