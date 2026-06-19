# 🌿 Poison Plant Finder

A **free** field guide to dangerous plants. Identify a poisonous plant by its
**leaf vein pattern, flower, sunlight, water and climate**, or by photo — then
learn whether it's **invasive**, **whether you should pull it** (and how to do
it safely), and exactly **what to do if you're exposed**.

Built as a static site (plain HTML/CSS/JS) — no server, no build step, no
tracking, no cost.

## What's inside

| Page | What it does |
| --- | --- |
| `index.html` | Home — the two identification methods + severity legend |
| `identify.html` | **Photo ID** via the free [Pl@ntNet](https://plantnet.org) API, cross-referenced to the poison database |
| `filter.html` | **Trait filter** — narrow by veins, flower color, sun, water, leaf arrangement |
| `catalog.html` | Browse/search every plant with severity & invasive flags |
| `plant.html?id=…` | Full specimen profile: ID, native range, invasive status, **safe-removal guidance**, danger profile (eaten / skin / eyes / animals / anaphylaxis) and **first aid** |

Each plant's botanical "plate" is drawn procedurally on a `<canvas>` keyed to
its vein pattern and flower color, so there are no image files to host.

## Photo ID setup (free)

The photo tool needs a free Pl@ntNet API key (≈500 IDs/day):

1. Sign up at [my.plantnet.org](https://my.plantnet.org/).
2. Copy your API key from account settings.
3. Paste it into the Photo ID page once — it's stored only in your browser
   (`localStorage`), never sent anywhere but Pl@ntNet.

The trait filter and catalog work with **no key at all**.

## Run locally

It's a static site, so just open `index.html` — or serve the folder:

```bash
cd poison-plant-finder
python3 -m http.server 8000   # then visit http://localhost:8000
```

## Deploy free on GitHub Pages

A workflow is included at
`.github/workflows/deploy-poison-plant-finder.yml`. After it runs once on the
default branch, enable Pages: **Settings → Pages → Source: "GitHub Actions"**.
The site publishes from the `poison-plant-finder/` folder.

## Adding or editing plants

All plant data lives in `js/data.js` as the `PLANTS` array. Copy an existing
entry and fill in the fields; the catalog, filter, photo cross-reference and
detail page all read from it. Keep the controlled-vocabulary values (`veins`,
`arrangement`, `flowerColor`, `sun`, `water`) matching `VOCAB` so the filter
works.

## ⚠️ Disclaimer

**Educational use only — not medical advice.** Plant identification is hard and
look-alikes are common. Never rely on this site to decide whether something is
safe to touch, eat, or feed to an animal. In an emergency contact Poison Control
(US **1-800-222-1222**), a doctor, or a vet. When unsure, treat an unknown plant
as dangerous and don't touch it.
