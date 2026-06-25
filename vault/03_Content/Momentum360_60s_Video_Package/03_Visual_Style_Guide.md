# 03 — Visual Style Guide

Everything here is tuned to match the reference and to satisfy the **blue + yellow** mandate. Values are matched **by eye to the reference** and are production‑ready — but reconcile the exact blues/yellows and the logo file against Momentum 360's official media kit before final master (see `README` flag).

---

## 1. Color system

### Core palette
| Role | Name | Hex | Use |
|---|---|---|---|
| Background base | Space Navy | `#070B16` | Darkest backdrop |
| Background mid | Deep Indigo | `#0C1530` | Bokeh field / gradient top |
| **Primary accent** | **Momentum Blue** | `#2EA8F0` | Most accent words, eyebrows, structure, rim‑light, schema chips |
| Deep brand blue | Royal Blue | `#1E6FE0` | Buttons, card edges, gradients |
| Logo sky highlight | Sky Cyan | `#7FD0FF` | Glow on medallion, light‑sweep |
| **Payoff accent** | **Momentum Yellow** | `#FFC21A` | Key numbers, "merge"/payoff words, CTA, top‑spot stamps |
| Warm gold (depth) | Amber | `#F5A300` | Yellow gradient shadow / 3D bar shading |
| Base text | White | `#FFFFFF` | Headline base, body |
| Small print | Muted Steel | `#9AA6B8` | Sources, captions, footers |
| Success tick | Keep brand blue/yellow | — | Use BLUE or YELLOW checks, **not** the reference's green, to stay on‑palette |

### The two‑color discipline (important)
- **Blue is the system color** — structure, eyebrows, most accent words, UI/schema, rim‑light.
- **Yellow is the payoff** — reserve it for the single thing you want remembered on each card: a key **number**, the **"merge"** idea, the **CTA**. *One yellow moment per card.* Don't split emphasis across both colors on the same line.
- Gradients allowed: Blue→Cyan for tech/UI; Blue→Yellow only at the **merge node** (Scene 4) and CTA, as the visual metaphor for "two things becoming one."

### Contrast / accessibility
- Yellow text only on dark navy (passes large‑text contrast). Never yellow on white or light.
- Body/caption text: white or `#9AA6B8` on navy. Add a subtle **scrim/blur** behind any text laid over busy footage.

---

## 2. Typography
- **Family:** heavy **rounded geometric sans** to match the reference. Recommended: **Poppins** (or Montserrat / Sora / Gilroy if licensed). Use ONE family, three weights.
- **Headlines:** Poppins **800 (ExtraBold)**, sentence case, tight leading (~1.0–1.05), slight negative tracking (−1 to −2%). Two‑tone: base WHITE + one accent word BLUE or YELLOW.
- **Eyebrow kicker:** Poppins **700**, ALL CAPS, **+8–12% letter‑spacing**, leading **◆** glyph (diamond/bullet), ~28–34px. Colored per scene (blue or yellow).
- **Body / list / labels:** Poppins **500–600**, sentence case.
- **Numbers (count‑ups):** Poppins 800, oversized, YELLOW (or BLUE for secondary).
- **Small print / sources:** Poppins 500, `#9AA6B8`, ~22–26px.

### Type sizing (for the 1080×1920 master)
| Element | Size (px) | Weight | Color |
|---|---|---|---|
| Hero headline (1–2 words/line) | 110–140 | 800 | White + accent |
| Standard headline | 78–104 | 800 | White + accent |
| Eyebrow kicker | 28–34 | 700 caps | Blue/Yellow |
| Support line | 44–56 | 600 | White + accent |
| List item / label | 34–42 | 500–600 | White |
| Big count‑up number | 130–170 | 800 | Yellow/Blue |
| Source / footer small print | 22–26 | 500 | Muted |
| CTA pill text | 46–56 | 700 | Navy on yellow |

Keep all critical text within the **center safe column** (see `07`) so 16:9 and 1:1 reframes survive.

---

## 3. Logo treatment (the medallion)
**Asset:** the circular **Momentum 360 medallion** — concentric thin rings + soft outer halo, interior filled with a **bright blue cloudy‑sky** texture, centered **white cursive lowercase "m"**. Plus the **`MOMENTUM 360`** wordmark for lockups. *(Pull the official SVG/PNG from the client; do not recreate the m by hand.)*

**Three forms (responsive logo system):**
1. **Hero reveal** — Scenes 0 & 6. Scales 12%→100% center, **3D Y‑tilt −15°→0°**, rings draw‑on, glow bloom, **light‑sweep** across the m, soft idle float + slow shimmer in the sky texture. Land on an audio stinger.
2. **Corner bug** — Scenes 1–5. Small medallion, **lower‑center‑left, ~22% opacity**, static. Persistent brand presence; never competes with the hero graphic.
3. **End‑card lockup** — Scene 6 final 3s: medallion + `MOMENTUM 360` wordmark + CTA, **locked static**.

**Rules:** never restyle, recolor, skew, or crop the medallion or the cursive m. Animate *around* it (glow, rings, sweep) — the mark itself stays locked. Keep clear‑space = 1× ring width on all sides.

---

## 4. Background recipe ("space")
Layered, always gently moving, never busy:
1. **Base gradient:** Space Navy `#070B16` (edges) → Deep Indigo `#0C1530` (center‑top).
2. **Bokeh field:** 4–6 large, heavily blurred orbs in **blue + yellow** (occasional cyan), ~10–25% opacity, drifting slowly (~20–30s loops), additive/screen blend.
3. **Starfield:** sparse white dots, subtle parallax + occasional twinkle.
4. **Geometric line‑art:** thin (1–2px) open **triangles / arrowheads / constellation lines** in blue at ~15–30% opacity, slow drift in the corners.
5. **Vignette:** soft dark vignette to push focus center.
6. **Grain:** very light film grain (2026 texture trend) to avoid banding on the gradients.

Per‑scene, tint the dominant bokeh toward that scene's accent (blue for "reality/AI," yellow for "Momentum's solution/results").

---

## 5. Motion system
- **Default entrance:** slide‑up 24–40px + fade, **ease‑out** (~0.4–0.6s). **Exit:** faster, ease‑in (~0.25s).
- **Headlines:** word‑by‑word or line‑by‑line build, not all at once.
- **Cards / panels:** assemble in **3D perspective** with soft floor reflections + contact shadow; glassmorphic frost for UI/AI panels (blur + 1px blue rim‑light + subtle inner glow).
- **3D objects** (medallion, bar chart, merge node): glossy material, specular highlight, reflective floor, slow idle rotation/float.
- **Count‑ups:** numbers roll from 0 → value over ~0.8–1.2s, ease‑out, land on a tick.
- **Transitions between scenes:** light‑streak / whoosh wipe or a quick push; reserve a true "hard cut + impact" for entering Scene 3 (the solution) and the CTA.
- **Easing:** everything eased (no linear). Premium, calm, confident — only the two designated impacts snap.

---

## 6. Per-scene accent map (keeps blue+yellow disciplined)
| Scene | Eyebrow color | Headline accent | Yellow "payoff" element |
|---|---|---|---|
| 0 Hook | — | Blue (`+ AI Visibility`) | "wins" + nothing else |
| 1 New reality | Blue | Blue | the `69%` number |
| 2 How AI chooses | Blue | Blue | `+ rich visuals` + `✓ CITED` |
| 3 Premium visuals | **Yellow** | Yellow (`choosing.`) | headline word + checks stay blue |
| 4 The merge | Blue | Blue | `× AI SEO` + `Content that converts.` |
| 5 Proof | **Yellow** | Yellow (`works harder.`) | the key numbers + outcome line |
| 6 CTA | — | Yellow (`Get chosen.`) | the CTA pill |
