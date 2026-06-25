# 07 — Production Specs, Reframes & QA Checklist

## 1. Master specs (match the reference, upgraded)
| Spec | Value |
|---|---|
| Primary aspect | **9:16 vertical** (matches reference) |
| Master resolution | **1080×1920** (finish at 2160×3840 if 4K assets allow; deliver 1080) |
| Frame rate | **30fps** (matches reference) |
| Duration | **60.00s** exactly (1800 frames) |
| Master codec | ProRes 422 HQ (archive) |
| Delivery codec | **H.264 / MP4**, high profile, ~12–16 Mbps @1080p |
| Color | Rec.709, 8‑bit |
| Loudness | −14 LUFS integrated, ≤ −1 dBTP |

## 2. Aspect-ratio reframes (produce all three)
Design so the **center 1080‑wide column** holds all text + logo, enabling clean crops:
| Ratio | Size | Use |
|---|---|---|
| **9:16** | 1080×1920 | Reels, Shorts, TikTok, Stories, site hero loop (**primary**) |
| **16:9** | 1920×1080 | YouTube, LinkedIn landscape, website embed, sales decks |
| **1:1** | 1080×1080 | Feed‑safe fallback (LinkedIn/IG feed) |

For 16:9, rebuild the background wider and re‑center the hero graphics (don't just letterbox). Keep type sizes legible per ratio.

## 3. Safe zones
- **Vertical:** keep critical text/logo in the center; lift any bottom text **above the bottom ~420px** (TikTok/Reels UI) and clear of the **right‑edge action rail** (~120px).
- **All ratios:** logo + CTA + URL inside title‑safe (inner ~90%).

## 4. Captions / accessibility
- The piece already *is* on‑screen text, but **burn‑in captions are largely unnecessary** since there's no speech. Provide an **SRT/closed‑caption stub** noting "[music]" + key on‑screen lines for platforms that reward caption tracks.
- Confirm the whole story reads **on mute** (it must).

## 5. Asset checklist (gather before build)
- [ ] Official **Momentum 360 medallion** logo (SVG/PNG, transparent) + `MOMENTUM 360` wordmark
- [ ] Confirmed brand **hex** values (reconcile with `03`)
- [ ] Brand **font** license (Poppins or client's font)
- [ ] Real Momentum 360 **sample assets** for Scene 3: a 360°/Matterport capture, photography, an HD video clip, a 3D render (use real client work if cleared; else high‑quality stand‑ins)
- [ ] **Google Street View Trusted** + **Matterport** badge art (official)
- [ ] Licensed **music** track (118–124 BPM, with build) + **SFX** pack
- [ ] Final **CTA/contact** line confirmed (URL, phone, handles, presenter line)
- [ ] **Stats sign‑off** per `08`

## 6. Final QA checklist
- [ ] Runtime is **exactly 60.00s** (1800 frames)
- [ ] **No voiceover** anywhere; story reads fully muted
- [ ] Blue + yellow used prominently and consistently; **one yellow payoff per card**
- [ ] Medallion: hero reveal at open, corner bug mid, hero lockup at close — **never restyled/recolored**
- [ ] Every on‑screen stat has its **source line** and is verified against `08`
- [ ] All text within safe zones in **9:16, 16:9, and 1:1**
- [ ] Two impact moments (0:03.18 logo, 0:55.0 CTA) hit cleanly with stinger
- [ ] Exports: 9:16 + 16:9 + 1:1, H.264 MP4, −14 LUFS
- [ ] Thumbnail variants (2–3) + static end‑card PNGs delivered
- [ ] Spelling/phone/URL proofed
