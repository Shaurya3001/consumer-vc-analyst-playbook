# Session Progress

## 2026-06-04 — Session 1 (scaffold)

### Actions
- LLM Council (5 members × 5 reviewers) ran on: taxonomy design, brand dashboard signals, additional applet sections
- Council aggregate ranking: Domain Rigorist (1.0) > Red-teamer (2.2) > First-principles (3.2) > Pragmatist (3.8) > Generalist (4.8)
- Key council findings adopted:
  - Three-axis taxonomy: Sector (11) × GTM model × Income tier
  - QC as GTM tag only — not a sector
  - Momentum Score must decompose on hover; labeled as "discovery tool"
  - Meta Ads rewards burn, not quality — flag inverse signal
  - Depth on 3 core applets before expanding to 6
- Scaffolded Next.js 14 project at C:\Users\shaur\india-consumer-vc
- Installed: recharts, framer-motion, shadcn/ui
- Created: lib/data/taxonomy.ts, brands.ts, funding-rounds.ts, investors.ts, cohorts.ts, unit-economics-defaults.ts
- Created: lib/utils/momentum-score.ts (computeMomentumScore, computeLtvCac)
- Created: app/page.tsx (homepage with 6 applet cards)
- Created: app/applets/*/page.tsx (6 stub routes)
- Created: .claude/CLAUDE.md, tasks/todo.md, tasks/lessons.md, tasks/progress.md

### Next session start
- Phase 1: expand brands.ts to 50 brands + funding-rounds.ts to 50+ rounds
- Then Phase 2: Funding Explorer (FundingFilters + FundingTable)
- Then Phase 3: Momentum Dashboard (the hero applet)

## 2026-06-06 — Session A (computed momentum signals)

### Actions
- Created lib/utils/brand-signals.ts: computeFundingRecencyScore (from lastRound.date, -2pts/mo decay) + computeInvestorQualityScore (INVESTORS AUM tier lookup)
- Updated lib/utils/momentum-score.ts: new SignalDetail { value, type, derivation } type; MomentumResult.components now uses 4 SignalDetails; 2 computed, 2 estimated
- Updated lib/data/taxonomy.ts: renamed qcDistributionScore->fundingRecencyScore, operatorQualityScore->investorQualityScore in SignalWeights
- Updated SignalWeightSliders: green "computed" badge vs grey "est." badge per slider
- Updated MomentumRow: expanded row shows cmp/est badge + derivation string under each signal bar
- tsc clean, preview verified (Bombay Shaving Company: Recency 86 "2025-11 (7mo ago)" + Investor 85 "Sixth Sense Ventures · $500M AUM")
- Committed feat(momentum-dashboard) + pushed to main; Vercel auto-deploying

## 2026-06-06 — Brand expansion (research agent)

### Actions
- Research agent found 36 verified brands; 34 added after dropping Petsy (weak sourcing) and Classplus (B2B SaaS)
- Coverage: Consumer FinTech (7), Consumer Internet (3), Consumer Services (3), F&B Foodservice +3, Home & Living +3, Consumer Electronics +2, F&B Packaged +5, Health & Wellness +4, Baby/Kids/Pets +2
- Fixed: Wakefit moved to Home & Living (agent had Consumer Internet); Third Wave Coffee amount corrected to $38M (WestBridge ₹326 Cr round)
- tsc clean; 60 brands showing in preview; committed and pushed
- Total brands: 64 (was 30)

## 2026-06-06 — Session A finished (2 remaining computed signals)

### Actions
- Added computeStageVelocityScore (stages/yr since founding vs roundCadence median base rate from FUNDING_ROUNDS) and computeCoInvestmentCentralityScore (lead investor realized-affinity centrality, reuses investor-affinity.ts rankCounterparts, normalised to max=100)
- Extracted shared findInvestorByName helper; SignalWeights now 6 keys (defaults 20/15/20/20/15/10 = 100)
- momentum-score.ts MomentumResult.components now 6 SignalDetails (4 computed, 2 estimated); sliders + MomentumRow bars + mini-bars all render 6
- Page text updated to "4 signals computed ... 2 estimated"; sidebar note updated
- Verified on a FRESH dev server (restarted to clear stale HMR buffer that was emitting false NaN warnings): console clean, all 73 rows valid scores, live re-sort works (max Stage Velocity surfaces Comet/Jar/CHK)
- Comet derivation sample: Velocity 100 "Series A in 1y (founded 2023) = 3.0 stages/yr vs 0.9 base (3.3x)"; Co-invest 100 "Elevation Capital · 10 realized links"
- Committed + pushed; todo.md Session A moved RESERVED -> DONE
- LESSON: restart dev server (not just reload) after multi-file signal-shape changes - HMR buffer surfaced stale NaN console warnings even though render output was clean

### Next session start (Session B)
- Validation / base-rates backtest: using 86-round dataset, compute real base rates per sector & stage
- Extend Graduation Funnel or add "Base rates" panel showing observed vs modeled cohort numbers
- See todo.md Session B for full spec

## 2026-06-06 — Session B done (base-rates backtest) + Vercel build fix

### Actions
- BEFORE Session B: caught that Session A commit 1b8edef FAILED Vercel build (ESLint: unescaped apostrophe in page.tsx + unused REFERENCE_YEAR). tsc passed but next build runs ESLint. Fixed in 93f634e, deploy green, 6-signal momentum live. Lesson captured.
- Session B: added stageProgression() to funding-analytics; built BaseRatesPanel.tsx on graduation funnel
- DATA-MODEL CORRECTION mid-build: first panel design compared "observed seed->A vs modeled seed->A" — but the 89-round dataset is ~92% Series A+ with only 7 seed rounds and just 4 companies captured at 2+ stages (Honasa/Pilgrim/Foxtale/The Whole Truth). Observed seed->A came out 0/1 = meaningless. Scrapped the head-to-head; redesigned to show stage mix + bias-resistant timing (13mo median gap, step-up) and frame the *uncomputability* as the structural-selection-bias insight. Far more honest and impressive.
- tsc + next build clean (stopped preview first); committed b7fcc28; Vercel green; live verified
- Both reserved sessions (A + B) now DONE. The two "last ~1 point" rigor items from the shipped plan are complete.

### Possible next work (no longer reserved)
- White-space map could get the same observed-vs-modeled treatment
- Momentum stage-velocity edge case: brand founded long ago + recent first raise reads as "slow" (flagged in Session A handoff)
