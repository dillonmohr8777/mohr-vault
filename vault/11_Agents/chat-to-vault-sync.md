---
routine: chat-to-vault-sync
cadence: Every 2 hours
writes_to: Agent Memory, Decision Logs, Reporting Logs
tier: 2
---

# Chat to Vault Sync

## Trigger
Every 2 hours during working hours. Captures decisions and intel from recent Claude conversations into the vault before they decay.

## Inputs
- Recent Claude conversation transcripts (last 2 hours)
- Current Agent Memory and Decision Log for any client mentioned

## Steps
1. Parse recent conversations for: decisions made, client intel, commitments, blockers
2. For each client touched:
   - Append new intel to `01_Clients/[Client]/Agent Memory.md` relevant section
   - Append dated row to `01_Clients/[Client]/Decision Log.md` for any decision
3. For any cross-client pattern mentioned (e.g. "video beat static across 3 accounts"), append to `Reports/Patterns.md`
4. Never duplicate: check if the insight already exists before appending

## Success criteria
- No decision from the last 2 hours lives only in chat history
- Every vault append cites the source conversation (timestamp)

## Things to Avoid
- Capturing speculation as fact ("maybe," "probably" stays in chat, doesn't go to vault)
- Duplicating intel that's already in Agent Memory
- Writing to Reporting Log — that's performance data only, not operational notes
