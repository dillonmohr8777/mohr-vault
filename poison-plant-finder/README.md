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
| `index.html` | Home — the identification methods + severity legend |
| `identify.html` | **Photo ID** via the free [Pl@ntNet](https://plantnet.org) API, cross-referenced to the poison database |
| `wizard.html` | **Guided ID wizard** — answers one trait at a time and narrows the list live |
| `filter.html` | **Trait filter** — narrow by veins, flower color, sun, water, leaf arrangement |
| `catalog.html` | Browse/search every plant with severity & invasive flags |
| `plant.html?id=…` | Full specimen profile + **save / notes / add-to-list / log-a-sighting** |
| `sightings.html` | **Sightings log + map** — pin where you found a plant on a free OpenStreetMap |
| `collections.html` | **Saved plants + custom lists** ("My yard", "To remove", …) |
| `account.html` | Account dashboard, stats, data export, and Supabase setup |

Each plant's botanical "plate" is drawn procedurally on a `<canvas>` keyed to
its vein pattern and flower color, so there are no image files to host.

## Accounts & saved data

The app works two ways with the **same code**:

- **Guest mode (default, zero setup):** favorites, notes, lists and sightings
  are saved in your browser (`localStorage`). Great for one device.
- **Real accounts (free, optional):** add a [Supabase](https://supabase.com)
  project and your data syncs across every device you sign in on, kept private
  per-user by row-level security.

### Turning on real accounts

1. Create a free project at [supabase.com](https://supabase.com).
2. In **Project Settings → API**, copy your **Project URL** and **anon public key**.
3. Paste both into `js/config.js`.
4. In Supabase open **SQL Editor**, paste the contents of `supabase-schema.sql`,
   and run it (creates the tables + row-level security).
5. Reload the site — you'll get real sign-in / sign-up, and the "guest" banner
   disappears.

The anon key is meant to be public in front-end code; row-level security is what
keeps each user's rows private.

> Map tiles come from OpenStreetMap and the map library (Leaflet) loads from a
> CDN — both are free and need no key. Photo ID still uses your own Pl@ntNet key.

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
