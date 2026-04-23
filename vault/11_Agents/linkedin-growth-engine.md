---
routine: linkedin-growth-engine
cadence: Sunday
writes_to: 02_FullTimeJob/AlignHCM/linkedin-drafts/YYYY-WW.md
tier: 1
priority: Align HCM (primary employer)
---

# LinkedIn Growth Engine

## Trigger
Every Sunday. Produces the coming week's LinkedIn content for all 5 Align HCM profiles.

## Inputs
- `02_FullTimeJob/AlignHCM/linkedin-calendar.md`
- `02_FullTimeJob/AlignHCM/brand-guidelines.md`
- `02_FullTimeJob/AlignHCM/smartcare-notes.md` (content pillar)
- `System/writing-rules.md`

## The 5 Author Voices
1. **Maher El-Abdallah (CEO)** — visionary, strategic, industry-level POV
2. **Barbara Tonelli** — operational, process-focused, implementation depth
3. **Joann Scolaro, CPP** — people-focused, payroll/HR practitioner perspective
4. **Moe El-Abdallah** — technical implementation, integration/config expertise
5. **Align HCM Company Page** — authoritative brand voice, announcements + thought leadership

## Content Pillar
**SmartCare maturity ladder:** Stabilize → Essentials → Accelerate → Transform
Every post ties to one rung. Mix across the 5 authors and the 4 stages.

## Steps
1. Check linkedin-calendar for the week's theme and locked topics
2. Generate drafts per author per schedule (typically 2-3 posts per author per week)
3. Match voice + pillar + writing rules
4. Write to `02_FullTimeJob/AlignHCM/linkedin-drafts/YYYY-WW.md`
5. Organize output by author, each post labeled with day + pillar stage

## Output format
```
# LinkedIn Drafts — Week of [Monday date]

## Maher El-Abdallah (CEO)
### [Day] — [Pillar Stage]
[post body]

## Barbara Tonelli
### [Day] — [Pillar Stage]
[post body]

[...continue for all 5]
```

## Writing constraints (Align-specific)
- Speak to decision-makers + implementation leaders who already know UKG, Workday, payroll ops
- No Align HCM → Momentum 360 bleed. Never mention M360, Buzz Bull, freelance work, or any client.
- No AI-sounding phrases (see writing-rules.md)
- Contractions required, em dashes forbidden

## Success criteria
- All 5 authors get drafts for every scheduled day
- Every post names one SmartCare stage
- Zero references to non-Align work
