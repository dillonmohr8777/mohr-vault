# SOP: MailerLite — Ironic Ineptocracy Lifecycle (Hermes Runbook)

> **Purpose:** step-by-step runbook for the **Hermes** computer-use agent (on the
> Orgo computer) to build the *Ironic Ineptocracy* lifecycle newsletter in
> MailerLite. Copy lives in: `02_Campaigns/Ironic Ineptocracy - Lifecycle Newsletter.md`.
>
> **Why a runbook and not a direct push:** the cloud session that drafted this
> can't reach Hermes, Orgo, or the MailerLite account. Hermes runs this locally.

## Prereqs (do these once, before building)

1. **MailerLite account** with a **verified sender** (`dillon@ironicineptocracy.com` or chosen from-address) and **authenticated sending domain** (SPF/DKIM). Deliverability tanks conversions otherwise.
2. **Pre-order URL** locked → fill `{{PREORDER_URL}}` everywhere.
3. **Release date** locked → fill `{{RELEASE_DATE}}`.
4. **Excerpt** (200–400 words) chosen for Email [6].
5. The site launch-list form must add subscribers to the **`II — Launch List`** group (see step 1).

## Step 1 — Groups & fields

In **Subscribers → Groups**, create: `II — Launch List`, `II — Preordered`, `II — Customer`, `II — Dormant`.
Confirm the website form (ironicineptocracy.com) assigns new signups to **`II — Launch List`**. If it currently posts elsewhere, repoint it (form integration or MailerLite embedded form).

## Step 2 — Main automation (the 7-email nurture)

**Automations → Create → "II — Lifecycle Nurture"**

- **Trigger:** *When subscriber joins a group* → `II — Launch List`.
- Build these steps in order (Email = the numbered email; Delay = wait before it):

| Step | Type | Setting |
| :-- | :-- | :-- |
| 1 | Email | [1] Welcome |
| 2 | Delay | 2 days → Email [2] Why this book |
| 3 | Delay | 2 days → Email [3] The hook |
| 4 | Delay | 3 days → Email [4] Darnell |
| 5 | Delay | 3 days → Email [5] Javon & Alec |
| 6 | Delay | 4 days → Email [6] Excerpt |
| 7 | Delay | 4 days → **Condition** (see below) → Email [7] Pre-order push |

- **Pre-order skip logic (step 7):** add a **Condition** step: *if subscriber is in group `II — Preordered`* → **Yes branch:** end automation (skip the push). **No branch:** send Email [7]. This stops pestering buyers.
- For each Email step: paste **Subject A** as the subject, set **Subject B** as the **A/B split** (MailerLite: enable A/B on subject, 50/50, pick winner by clicks after 4h). Paste **preview text** and **body** from the campaign doc. Convert `**[text](url)**` lines into a real **button block** pointing at `{{PREORDER_URL}}`.

## Step 3 — Launch-day broadcast (Email [8])

This is date-based, not part of the join automation.
- **Campaigns → Create campaign → Regular** (or schedule).
- Recipients: groups `II — Launch List` **+** `II — Preordered` (everyone).
- Subject A/B [8], schedule for **{{RELEASE_DATE}}** morning (recipient timezone if available).

## Step 4 — Review-request automation (Email [9])

- **Automations → Create → "II — Review Request"**
- **Trigger:** *When subscriber joins group* → `II — Customer`.
- Step: **Delay 5 days → Email [9]**.
- (Populate `II — Customer` from your store's purchase webhook/Zapier, or tag manually post-launch.)

## Step 5 — Re-engagement automation (Email [11])

- MailerLite doesn't trigger on "no opens" directly, so use a **segment + scheduled send**, or the activity-based automation if available on your plan:
  - Create **Segment** `II — Dormant`: in `II — Launch List` **AND** *did not open* in last 60 days.
  - Either: monthly **campaign** to that segment with Email [11], **or** an automation triggered when added to `II — Dormant` (if you tag dormancy via an external scheduler).
- Add an unsubscribe/sunset: if still no open 14 days after [11], remove from `II — Launch List` (keeps list healthy → better inbox placement → better conversion).

## Step 6 — Monthly Field Note (Email [10])

Not automated. Each month, **Campaigns → Regular** to `II — Launch List`, using the Field Note template in the campaign doc.

## Conversion checklist (do not skip — this is the point)

- [ ] **Every email has ONE primary CTA button** to `{{PREORDER_URL}}` (buttons convert better than text links; one ask per email).
- [ ] **A/B every subject line** (both provided). Let opens/clicks pick the winner.
- [ ] **Preview text filled** on all (it's the second subject line — drives opens).
- [ ] **From-name = "Dillon Mohr"**, not a brand. Author newsletters convert on the person.
- [ ] **Mobile preview** every email; keep the button above the fold.
- [ ] **UTM tags** on every `{{PREORDER_URL}}`: `?utm_source=mailerlite&utm_medium=email&utm_campaign=ii_lifecycle&utm_content=email{N}` — so you can see which email actually drives pre-orders.
- [ ] **Skip-if-preordered condition live** (step 2.7) so buyers don't get the hard sell.
- [ ] **Authenticated domain** confirmed (SPF/DKIM) before first send.
- [ ] Set automation to **re-entry off** (one pass per subscriber).
- [ ] After launch, **read the report**: kill the lowest-CTR email, double down on the best subject pattern.

## Optional — API path (faster than clicking)

If Hermes has the MailerLite API key, groups/subscribers/automations can be created via the MailerLite API (`https://connect.mailerlite.com/api/`) instead of the UI. The email *copy* still comes from the campaign doc. **Never commit the API key to git** — keep it in the Orgo computer's local env only.

## Hand-off note for Hermes

> Build steps 1–6 in order. Pause and confirm with Dillon before the **first
> live send** and before scheduling the **launch broadcast** (step 3). Report
> back: groups created, automations live, A/B enabled, and a screenshot of each
> email's mobile preview.
