# The Consumer VC Analyst Playbook — Task Plan

## Status: SHIPPED & LIVE
- **Live:** https://india-consumer-vc.vercel.app
- **Repo:** https://github.com/Shaurya3001/consumer-vc-analyst-playbook (Vercel git-connected → push = auto-deploy)
- All 8 applets built, deployed, verified. Daily 09:00 IST refresh cron + live countdown. Vercel Web Analytics enabled.
- 86 cited funding rounds, 30 brands, 29 investors, reports parsed (Bain/Redseer/Fireside/McKinsey/BCG/PwC), "The read" investor takeaway on each applet, bounded max-w-7xl layout, plain hyphens (no em/en dashes).
- Funding Explorer read is live-computed from data (`lib/utils/funding-analytics.ts`); round-cadence base rates shown.

## Objective rating (self-assessed)
- Portfolio/interview artifact: ~8/10.
- Real VC-product bar: ~6.5–7/10 (raised from 5.5 via the data expansion + computed funding analytics).
- The last ~1 point needs the two reserved projects below — both genuine rigor, not polish.

---

## DONE (2026-06-06) — Session A: Make the Momentum Score honest/computed
**Shipped.** Momentum score now decomposes into 6 signals: **4 computed** + 2 explicitly tagged "estimated". All success criteria met (every signal traces to a computed value with visible derivation OR is tagged estimated; tsc clean; sliders re-sort live; screenshot proof; clean console).
- `fundingRecencyScore` — months since last raise, -2pts/mo decay (`computeFundingRecencyScore`)
- `investorQualityScore` — lead investor AUM tier + consumer-fund bonus (`computeInvestorQualityScore`)
- `stageVelocityScore` — stages climbed/year vs dataset's median round cadence (`computeStageVelocityScore`, uses `roundCadence`)
- `coInvestmentCentralityScore` — lead investor's realized-affinity centrality (`computeCoInvestmentCentralityScore`, reuses `investor-affinity.ts`)
- Branded search + earned affinity remain estimated (no honest offline source) — tagged `est.` and visually separated.
- Bootstrapped brands score neutral/0 on funding-derived signals by design (surfaces them as scouting targets, not proven bets).
- Brand coverage expanded 30 → 73 (all 11 sectors, footwear, bootstrapped) during the same arc.

### Original spec (kept for reference)
**Why:** Momentum is the showpiece applet, but its 4 signals (branded search, QC distribution, earned affinity, operator quality) are hand-set *estimates*. A sharp investor discounts that. Replace estimated signals with ones genuinely derivable from data we already hold.

**Approach:**
- Recompute the score from *measurable* inputs instead of guessed 0-100s. Candidates derivable from `funding-rounds.ts` + `investors.ts`:
  - **Funding recency / velocity** — months since last raise, rounds in last 24mo (from round dates).
  - **Stage progression speed** — derived from `roundCadence` in `lib/utils/funding-analytics.ts`.
  - **Investor quality** — lead/co-investor AUM + check-size tier from `investors.ts`.
  - **Co-investment centrality** — how networked the cap table is (reuse `lib/utils/investor-affinity.ts`).
- Keep the re-weightable sliders, but each signal now traces to a real number with a tooltip showing the computation.
- For any signal that genuinely can't be measured offline (e.g. live Google Trends), either drop it or label it "estimated" explicitly and visually separate it — do NOT pass estimate off as measured.
- Update `lib/data/brands.ts` only where a field is now derived; keep "data as of" honesty.

**Files:** `lib/utils/momentum-score.ts`, `components/applets/momentum-dashboard/*`, `app/applets/momentum-dashboard/page.tsx`, possibly a new `lib/utils/brand-signals.ts`.

**Success criteria:** every signal in the decomposition either (a) traces to a computed value with a visible derivation, or (b) is explicitly tagged "estimated." `tsc` clean; sliders still re-sort live; screenshot proof.

---

## DONE (2026-06-06) — Session B: Validation / base-rates backtest
**Shipped & live** (commit b7fcc28). BaseRatesPanel on the graduation funnel computes, live from the 89 sourced rounds:
- Stage mix (Seed 7 / Series A 27 / Series B 27 / Series C+ 25) — `stageBreakdown`
- Median round gap 13mo (4 company pairs) + median step-up — `roundCadence`
- `stageProgression()` added to funding-analytics for the coverage counts
**Key finding (the real rigor):** ~92% of sourced rounds are Series A+ and only 7 are seed, so a seed→A graduation rate is *uncomputable* from press-sourced data (it would over-count survivors). The panel shows the modeled 27% seed→A beside this and flags the divergence as **structural selection bias, not an error** — and validates the bias-resistant timing base rate (13mo gap backs the "2023-24 cohorts still maturing" claim).
- NOTE: first design tried "observed seed→A vs modeled" head-to-head; scrapped after the data showed 0/1 — a meaningless rate. Redesigned around what the data can honestly support. Lesson captured.
- tsc + next build clean; deploy green; live verified.

### Original spec (kept for reference)
**Why:** Turns modeled claims (graduation funnel, white-space) into data-backed ones, and demonstrates the Momentum/funnel logic actually holds on history.
**Why:** Turns modeled claims (graduation funnel, white-space) into data-backed ones, and demonstrates the Momentum/funnel logic actually holds on history.

**Approach:**
- Using the 86-round dataset, compute real base rates per sector & stage: deal count & capital by year, median time-between-rounds, median round step-up, seed→A→B progression observed in the data (companies appearing at multiple stages).
- Surface as a small computed analysis (extend Graduation Funnel, or a compact "Base rates" panel) that *backs* the modeled cohort numbers with observed ones — and flag where modeled vs observed diverge (honesty).
- Optional stretch: a simple "does a recent raise + strong investor predict a follow-on within N months?" read on the historical rounds.

**Files:** `lib/utils/funding-analytics.ts` (extend), `app/applets/graduation-funnel/page.tsx` or a new panel, `lib/data/cohorts.ts` (annotate modeled vs observed).

**Success criteria:** at least one previously-modeled claim is now shown alongside a computed base rate from the real dataset, with divergence flagged. `tsc` clean; screenshot proof.

---

## Deploy/ops notes for any session
- `npx tsc --noEmit` before commit; do NOT run `npx next build` while the preview dev server is live (corrupts `.next` → 500s). Build only after stopping the preview, or rely on Vercel's cloud build.
- Push to `main` → Vercel auto-deploys; verify the live URL before claiming done.
- Daily cron needs `ANTHROPIC_API_KEY` repo secret (user adds it). Without it the cron just bumps the timestamp — non-fatal.
- All copy uses plain hyphens; no em/en dashes (a node script in history did the sweep — keep it that way).
</content>
