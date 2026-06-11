# The Consumer VC Analyst Playbook

Interactive tools for analysing India's consumer startup ecosystem — built the way an early-stage VC analyst actually works a market. Funding rounds, brand momentum, category white-space, investor syndicates, cohort funnels, unit economics, exits, and the canonical research reports — each surfaced with a decision-relevant "so what."

**Live:** https://india-consumer-vc.vercel.app
**By:** [Shaurya Gulati](https://www.linkedin.com/in/shaurya-gulati/) · shauryagulati3001@gmail.com

Next.js 14 (App Router) + a typed static data layer + a daily Claude-powered refresh pipeline. No backend; every applet works fully offline.

---

## The eight applets

| Applet | Route | The question it answers |
|---|---|---|
| **Funding Rounds Explorer** | `/applets/funding-explorer` | Where is capital concentrated vs. thin? Filter 160+ real rounds by sector × GTM × tier × stage × city × investor, with a live-computed concentration read and round-cadence base rates. |
| **Momentum Dashboard** | `/applets/momentum-dashboard` | Which emerging brands are growing — and is it bought or earned? Re-weightable composite score with signal decomposition. |
| **Category White-space Map** | `/applets/whitespace-map` | Where are the under-funded gaps? Sector × income-tier heatmap with report-sourced market backdrop. |
| **Investor Activity Map** | `/applets/investor-map` | Who co-invests with whom? Anchor a fund → Natural Ally / Untapped Fit / Parallel Player bands + affinity matrix. |
| **Graduation Funnel** | `/applets/graduation-funnel` | What % of seed brands reach Series A/B? Cohort base rates by sector. |
| **Unit Economics Sandbox** | `/applets/unit-economics` | Do the unit economics work? Live LTV/CAC + payback with editable inputs and category benchmarks. |
| **Exits & Acquisitions Tracker** | `/applets/exits-tracker` | How do consumer VCs actually exit? FMCG M&A leaderboard (HUL, ITC, Marico, Emami). |
| **Research & Reports** | `/applets/research` | What do the canonical reports say? 20 reports with parsed figures, plus a chat that answers from the corpus (bring your own Claude key). |

Each applet leads with a measured **"The read"** takeaway (the investor "so what") before the data.

## Stack

- **Framework:** Next.js 14 (App Router), TypeScript (strict)
- **UI:** Tailwind CSS, Recharts (charts), Framer Motion (interactions), shadcn/ui
- **Data:** None external — typed TS/JSON constants in `/lib/data/`
- **Analytics:** Vercel Web Analytics
- **Deploy:** Vercel (auto-deploy on push)
- **Pipeline:** Node 18+ for the daily refresh script only

## Project structure

```
app/
  page.tsx                     Home — applet cards + live freshness countdown
  layout.tsx                   Root layout (footer, analytics)
  applets/<slug>/page.tsx      One route per applet (8)
components/
  applets/<slug>/              Applet-specific components (sliders, tables, charts, matrix)
  layout/
    SiteFooter.tsx             Byline + links, on every page
    LastUpdated.tsx            "Data updated" + live countdown to next 09:00 IST refresh
    TheRead.tsx                The reusable investor-takeaway strip
lib/
  data/
    taxonomy.ts                The MECE spine: 11 sectors × 6 GTM tags × 5 income tiers
    funding-rounds.ts          160+ verified rounds (merges auto-rounds.json)
    brands.ts                  73 brands across all 11 sectors (funded + bootstrapped)
    investors.ts               89 India consumer investors (VC, PE, strategic, sovereign, angel)
    whitespace.ts              Sector × tier gap grid (derived + editorial)
    cohorts.ts                 Graduation-funnel base rates
    acquisitions.ts            FMCG M&A deals
    reports.ts                 20-report registry (Bain, Redseer, Fireside, Blume, Bessemer, ...)
    market-context.ts          Macro stats, report-sourced
    unit-economics-defaults.ts Per-category benchmark inputs
    sources.ts                 Source URL registry
    site-meta.json             lastUpdated / lastChecked — bumped by the cron
    auto-rounds.json           Daily-detected rounds (starts empty, tagged "new")
    covered-companies.json     Dedupe list for the cron
  utils/
    momentum-score.ts          Composite + LTV helpers
    investor-affinity.ts       Co-investment / overlap scoring
    unit-economics.ts          Transparent LTV/CAC model
scripts/
  daily-update.mjs             Claude + web search → new rounds → data + timestamp
.github/workflows/
  daily-update.yml             Daily 09:00 IST cron → runs the script → commits → redeploys
```

## The taxonomy (the MECE spine)

Three orthogonal axes — every brand and round is tagged once per axis:

- **Sector** (11): F&B Packaged, F&B Foodservice, Beauty & Personal Care, Fashion & Accessories, Health & Wellness, Home & Living, Consumer Electronics, Baby/Kids/Pets, Consumer Services, Consumer FinTech, Consumer Internet
- **GTM model** (multi-select tag): D2C-first, Marketplace-led, QC-native, Omnichannel, General Trade, Platform
- **Income tier**: Value, Mass, Mass-premium, Premium, Bharat/Tier-2+

Quick commerce is a **GTM tag, not a sector** — a hard invariant.

## Run it locally

```bash
npm install
npm run dev
# open http://localhost:3000
```

`npm run build` for a production build, `npx tsc --noEmit` to type-check.

## Deploy

The repo is connected to Vercel — **every push to `main` auto-deploys**. No build command needed (Next.js default). For a fresh setup: import the repo on Vercel, framework auto-detected, deploy.

## Daily data refresh (09:00 IST)

A GitHub Action checks daily for newly-announced India consumer rounds, validates each against a real source URL, dedupes, appends verified ones to `lib/data/auto-rounds.json` (surfaced with a "new" tag in the Funding Explorer), and bumps the timestamp the homepage countdown reads.

**To enable the data-fetching half** (the cron runs regardless and keeps the timestamp honest, but only adds rounds with an API key):

1. Get an API key from the [Anthropic Console](https://console.anthropic.com).
2. Repo → Settings → Secrets and variables → Actions → New repository secret → name `ANTHROPIC_API_KEY`.
3. Done. Runs daily at 03:30 UTC (09:00 IST); also on demand from the **Actions** tab.

It is deliberately conservative: anything without a verifiable source URL, or already covered, is dropped. If the key is missing or a call fails, it records the check ran and adds nothing — it never breaks the build.

> **Recommended for a VC-facing product:** flip the workflow's commit step to open a **pull request** instead of committing to `main`, so you eyeball auto-detected rounds before they go public. One hallucinated round costs more credibility than daily freshness buys.

## Editing data by hand

All content is typed constants in `/lib/data/`. Add or edit an object (e.g. a round in `funding-rounds.ts`, a brand in `brands.ts`), keep it within the `taxonomy.ts` types, and cite sources in the `sources` array. The site picks it up on reload; `tsc` enforces the shape.

## What's built vs. what you do

**Built and ready:** the eight applets, the typed data layer, the daily pipeline + workflow, the live countdown, analytics wiring.
**Yours (one-time):** add the `ANTHROPIC_API_KEY` secret, and enable Vercel Web Analytics in the dashboard. Credentials and account toggles are yours to set — they can't be scripted from here.

## A model-string note

`scripts/daily-update.mjs` uses `claude-sonnet-4-6` and a web-search tool version string. Model names and tool versions move; if a call 404s, the run still completes (timestamp only) — update the constants at the top of the script per the current strings at https://docs.claude.com.

## Data integrity

Figures are compiled from public sources (Inc42, Entrackr, YourStory, Business Standard, Tracxn) and the named industry reports, **labelled where modeled vs. sourced**. Momentum signals measure attention and distribution, not unit economics. Built as a portfolio artifact — not investment advice.
