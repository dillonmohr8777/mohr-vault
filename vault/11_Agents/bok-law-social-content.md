---
routine: bok-law-social-content
cadence: Sunday
writes_to: 01_Clients/Bok Law/weekly-content-YYYY-MM-DD.md
tier: 2
---

# BOK Law Social Content

## Trigger
Every Sunday. Produces next week's content for BOK Law family law practice.

## Inputs
- `01_Clients/Bok Law/brand-guidelines.md`
- `01_Clients/Bok Law/content-calendar.md`
- `01_Clients/Bok Law/Agent Memory.md`
- `System/writing-rules.md` (hard rules — no em dashes, no banned openers, contractions)

## Content Recipe
Three posts per week:

1. **Wednesday Wisdom** — Practical family-law guidance, delivered warmly. Topic pool: talking to kids about divorce, co-parenting communication, protecting children emotionally, age-appropriate conversations. ~120-180 words.
2. **Turn the Page Thursday** — Motivational, healing-focused. Topic pool: quiet moments of healing, small wins, rebuilding identity, first-morning-that-feels-normal style content. ~120-180 words.
3. **Family Fridays** — Pittsburgh community focus. Topic pool: local spots (Eliza Furnace Trail, Bloomfield Market, Duquesne Incline, Frick Park, Phipps Conservatory), seasonal activities, family-friendly reconnection ideas. ~120-180 words.

## Steps
1. Check content-calendar for any locked topics for the upcoming week
2. Pull two recent post titles from prior `weekly-content-*.md` files to avoid repetition
3. Generate all three posts following writing rules
4. Write to `01_Clients/Bok Law/weekly-content-YYYY-MM-DD.md` (date = upcoming Monday)
5. Ping approvers (Dorothy, Aleksandra, Rachael) per the usual cadence

## Output format
```
# Week of [Monday date]

## Wednesday Wisdom — [date]
### [Title]
[post body]

## Turn the Page Thursday — [date]
### [Title]
[post body]

## Family Fridays — [date]
### [Title]
[post body]
```

## Success criteria
- All three posts produced and saved
- Every post passes writing-rules.md (grep for em dashes, banned openers)
- No topic repeats within last 4 weeks

## Known blocker
- Dorothy / Aleksandra / Rachael approval cadence is slow
- Default rule: if no response by Wednesday AM, publish with note to the team
