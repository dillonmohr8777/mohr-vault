# Campaign: The Ironic Ineptocracy — Lifecycle Newsletter

## Client
- Dillon Mohr (author) / The Ironic Ineptocracy (satirical thriller, pre-order)

## Objective
- Convert "launch list" signups into pre-orders, then into launch-day buyers and
  reviewers, with a durable first-reader relationship after launch.

## Platform(s)
- MailerLite (automations + broadcasts). Signup source: ironicineptocracy.com launch-list form.

## Budget
- $0 media (owned channel). MailerLite plan cost only.

## Timeline
- Start: on first signup (evergreen welcome flow)
- End: ongoing (launch flow is date-triggered; monthly broadcast thereafter)

## KPIs
- Welcome open rate >55%, sequence click rate >8%
- Launch-list → pre-order conversion >15%
- Launch-day broadcast → sale conversion
- Review-request → review rate >5% of buyers
- Re-engagement win-back >10% of dormant

## Status
- DRAFT — copy complete, awaiting build in MailerLite (see SOP: *MailerLite — Ironic Ineptocracy Lifecycle (Hermes Runbook)*)

---

## Voice & canon (keep on-brand)

- **Book:** *The Ironic Ineptocracy* — "a sprawling satirical thriller about ambition, power, friendship, and the cost of surviving the machinery built around you."
- **Author:** Dillon Mohr
- **Cast:** Darnell Covington (wanted Harvard; "Harvard ballcap, hides the Philly bruise under hair"), Javon Whitfield ("reads the room when Darnell reacts… the person Darnell trusts most"), Alec Daheim ("Friend, threat, witness. The file keeps him close").
- **Tone lines to reuse:** *"Power moves first. Blame shows up late."* · *"A coming of age story inside a machine coming apart."* · *"Speeches are the front door. Darnell starts watching the rooms behind them."* · *"Every glowing line is a story someone will sell as emergency policy before breakfast."*
- **The promise (from the site):** "Get the release date, book drop notice, and first reader updates from Dillon Mohr."

## Groups / tags (set up in MailerLite)

| Group/Tag | Meaning | Set when |
| :-- | :-- | :-- |
| `II — Launch List` | Active subscriber, entry point | Form signup (automation trigger) |
| `II — Preordered` | Has pre-ordered | Manually / via purchase webhook; **exits the pre-order push** |
| `II — Customer` | Bought the book | Launch day / purchase |
| `II — Dormant` | No opens in 60 days | Activity segment → re-engagement |

## Lifecycle map

```
Signup ─▶ [1] Welcome (0d)
            ▼
        [2] Why this book (2d)
            ▼
        [3] The hook (4d)
            ▼
        [4] Darnell (7d)
            ▼
        [5] Javon & Alec (10d)
            ▼
        [6] Excerpt (14d)
            ▼
        [7] Pre-order push (18d) ──skip if `II — Preordered`
            ▼
        (holds until release date)
            ▼
        [8] LAUNCH DAY  (date-triggered broadcast)
            ▼
        [9] Review request (+5d, `II — Customer`)
            ▼
        [10] Monthly "Field Note" broadcast (ongoing)

   Parallel: no opens 60d ─▶ [11] Re-engagement ─▶ stay / sunset
```

---

# The emails

> Each email below is MailerLite-ready: **A/B subjects**, **preview text**, **body**, and **primary CTA**. Replace `{{PREORDER_URL}}` and `{{RELEASE_DATE}}` at build time. Personalization token: `{$name}` (falls back to "reader").

---

## [1] Welcome — *trigger: joins `II — Launch List`, delay 0*

**Subject A:** You're on the file.
**Subject B:** Welcome to the launch list — watch your inbox
**Preview:** Power moves first. Blame shows up late. Here's what you just signed up for.

You dropped one address. That's all it takes to get drafted into something.

You're officially on the launch list for **The Ironic Ineptocracy** — a satirical thriller about ambition, power, friendship, and the cost of surviving the machinery built around you.

Here's the deal, and the whole deal:

- The **release date**, the second it's locked.
- A **book-drop notice** the day it goes live.
- **First-reader updates** you won't get anywhere else.

No daily noise. Just the file, opening one page at a time.

A taste of where we're headed:

> *It starts with a school file. Then come the pressure points, the favors, and the people Darnell can barely afford to lose.*

— Dillon Mohr

**[Preorder the novel →]({{PREORDER_URL}})**

*P.S. Reply and tell me how you found the book. I read every one.*

---

## [2] Why this book — *delay 2 days*

**Subject A:** Why I wrote a thriller about competence
**Subject B:** The book started with one ugly question
**Preview:** What happens when the people running things are in over their heads — and it works for them?

{$name},

I kept circling one question until it turned into a novel: *what happens when failing upward becomes the actual job?*

Not cartoon villainy. Something quieter and worse — a system where looking capable beats being capable, where **every glowing line is a story someone will sell as emergency policy before breakfast.** That's the ironic ineptocracy. It runs better than it has any right to, right up until it doesn't.

So I built a coming-of-age story inside a machine coming apart, and dropped a kid named Darnell into the gears to see what survives.

Over the next couple of weeks I'll introduce you to the people in the file — and let you read some of it before anyone else.

— Dillon

**[See the book →]({{PREORDER_URL}})**

---

## [3] The hook — *delay 4 days*

**Subject A:** A school file. That's how it starts.
**Subject B:** Darnell wanted Harvard. He got drafted instead.
**Preview:** Speeches are the front door. Darnell starts watching the rooms behind them.

Darnell Covington wanted Harvard. What he got was a crash course in who writes the rules, who gets drafted into them, and what it costs to survive either.

It starts with a school file. Then come the pressure points, the favors, and the names he can't afford to cross.

**Power moves first. Blame shows up late.** By the time Darnell learns the difference, the favor's already been called in.

Speeches are the front door. He starts watching the rooms behind them — and that's where the book lives.

— Dillon

**[Preorder *The Ironic Ineptocracy* →]({{PREORDER_URL}})**

---

## [4] Meet Darnell — *delay 7 days*

**Subject A:** Meet Darnell Covington
**Subject B:** Harvard ballcap, Philly bruise underneath
**Preview:** The kid the whole machine is built to use.

Every file has a name on the front. This one's Darnell's.

Harvard ballcap pulled low — hides the Philly bruise under the hair. He's smart enough to read the room and proud enough to think reading it is the same as being safe in it. It isn't.

What I love about writing Darnell: he's not naïve, he's *early*. He sees the play a half-beat after it's run, which is exactly long enough to owe somebody.

Next, the two people who decide how far he falls — and how far back he can climb.

— Dillon

**[Preorder →]({{PREORDER_URL}})**

---

## [5] Javon & Alec — *delay 10 days*

**Subject A:** The friend, the threat, the witness
**Subject B:** The two people who decide Darnell's fate
**Preview:** One reads the room. One keeps the file close.

Darnell doesn't make it or break it alone. Two people hold the other ends of the rope.

**Javon Whitfield** reads the room when Darnell reacts. Once the world tilts, he becomes the person Darnell trusts most — which is its own kind of risk, because trust is leverage and everybody in this book knows it.

**Alec Daheim** shows up early and lingers. Friend, threat, witness — sometimes in the same scene. The file keeps him close, and so does Darnell, because the alternative is worse.

Three of them, standing under a fire-lit sky in front of the Capitol. That image is the whole book in one frame.

— Dillon

**[Preorder →]({{PREORDER_URL}})**

---

## [6] Excerpt — *delay 14 days*

**Subject A:** Read the first pages — before anyone else
**Subject B:** Here's a piece of the file
**Preview:** Depth I held back from the marketing. Not from you.

{$name}, you've waited two weeks and read my pitch three times. Here's the actual thing.

Below is an early excerpt — a scene I held back from everywhere else, because launch-list readers should get the depth, not the slogans.

> *[Paste 200–400 word excerpt here at build time — recommend the school-file scene or Darnell's first "favor."]*

If this is your kind of trouble, the best way to get the rest the day it lands is to preorder. Which brings me to a small ask in a few days.

— Dillon

**[Read more — preorder the novel →]({{PREORDER_URL}})**

---

## [7] Pre-order push — *delay 18 days · SKIP if `II — Preordered`*

**Subject A:** Preorders decide which books get seen
**Subject B:** Be first when the book drops
**Preview:** A small thing from you moves this more than you'd guess.

I'll be straight with you, the way the book is straight about everything else.

Preorders are the single most useful thing a reader can do for a book like this. They tell the algorithms and the stores that *The Ironic Ineptocracy* has people waiting — before it even ships. A handful of early orders changes who the book gets shown to next.

You've read the file. You know the cast. If you're in, **now** is the moment that counts double.

> *Power moves first. Blame shows up late.* Be the one who moved first.

**[Preorder *The Ironic Ineptocracy* →]({{PREORDER_URL}})**

— Dillon

*Already ordered? Ignore me, and thank you — genuinely.*

---

## [8] Launch day — *date-triggered broadcast on {{RELEASE_DATE}}*

**Subject A:** It's live. The book just dropped.
**Subject B:** *The Ironic Ineptocracy* is here
**Preview:** The file's open. Go.

It's out.

**The Ironic Ineptocracy** is live as of today. Every page I've been teasing — Darnell, Javon, Alec, the school file, the rooms behind the speeches — is now yours to read end to end.

You were on the list first, so you hear it first: **go get it.**

**[Get the book now →]({{PREORDER_URL}})**

Thank you for being here before there was anything to buy. That's not nothing to me.

— Dillon

---

## [9] Review request — *launch +5 days · segment `II — Customer`*

**Subject A:** One sentence would help more than you'd think
**Subject B:** Tell me what you thought
**Preview:** A line or two. That's the whole ask.

{$name}, you read it. That already means a lot.

If you've got 30 seconds: a short review — even one honest sentence — does more for an independent book than any ad I could buy. It's the difference between the next reader finding it or scrolling past.

**[Leave a quick review →]({{PREORDER_URL}})**

And if something landed — a line, a character, a moment you didn't see coming — hit reply and tell me. I keep those.

— Dillon

---

## [10] Monthly "Field Note" — *ongoing broadcast (not automated)*

**Format (reusable template):**
- **Subject:** Field Note — {topic}
- **Preview:** {one teasing line in book voice}
- **Body:** one short dispatch (a deleted scene, the real-world headline that inspired a chapter, what I'm writing next), one personal line, one CTA (book, or "reply and tell me").
- **Cadence:** monthly. Keep it to a 2-minute read. The point is to stay in the inbox as a *voice*, not a *promo*.

---

## [11] Re-engagement — *trigger: no opens in 60 days (`II — Dormant`)*

**Subject A:** Still want the file?
**Subject B:** Should I stop sending these?
**Preview:** No hard feelings — just tell me to stay or go.

{$name}, I haven't seen you open these in a while, and I'd rather send to people who actually want them.

So, one button. Are you still in for release news and first-reader updates from *The Ironic Ineptocracy*?

**[Yes — keep me on the list →]({{PREORDER_URL}})**

If I don't hear back, I'll quietly take you off in a couple of weeks so I'm not cluttering your inbox. No drama. The file closes; it doesn't slam.

— Dillon

---

## Results
- (to be filled after launch: opens, CTR, pre-orders, sales, reviews)
