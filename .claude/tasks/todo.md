# India Consumer VC — Task Plan

## Phase 0: Scaffold ✅
- [x] Next.js 14 + TypeScript + Tailwind + shadcn/ui + Recharts + Framer Motion
- [x] .claude/ directory with CLAUDE.md, rules, tasks
- [x] lib/data/ — taxonomy.ts, brands.ts, funding-rounds.ts, investors.ts, cohorts.ts, unit-economics-defaults.ts
- [x] lib/utils/momentum-score.ts — computeMomentumScore + computeLtvCac
- [x] app/page.tsx — homepage with all 6 applet links
- [x] app/applets/*/page.tsx — stub routes for all 6 applets

## Phase 1: Data completeness
- [ ] Expand brands.ts to 50 brands (currently 5 seeds)
- [ ] Expand funding-rounds.ts to 50+ rounds across all 11 sectors
- [ ] Add whitespace data structure (funding density per sector × tier grid)
- [ ] Add GTM-model breakdown to cohorts

Success criterion: `tsc --noEmit` passes; all 6 applet routes load without errors.

## Phase 2: Funding Explorer
- [ ] FundingFilters component (sector, GTM, tier, stage, city, investor multi-select)
- [ ] FundingTable component (sortable, paginated)
- [ ] Mobile-responsive layout

Success criterion: All filter combinations render correct subsets; no console errors.

## Phase 3: Momentum Dashboard (hero applet)
- [ ] SignalWeightSliders (Framer Motion; 4 sliders, sum to 100%)
- [ ] MomentumTable (sorted by computeMomentumScore; India 1/2/3 badge)
- [ ] BrandCard hover state showing signal decomposition
- [ ] "Data as of" label visible on page

Success criterion: Re-weighting sliders re-sorts the table in real time; hover shows sub-scores.

## Phase 4: White-space Map
- [ ] WhitespaceHeatmap (Recharts; 11 sectors × 5 tiers; color = funding density)
- [ ] Tooltip showing round count + gap narrative

Success criterion: Heatmap renders correctly with responsive container; no fixed pixel widths.

## Phase 5: Investor Map + Graduation Funnel
- [ ] InvestorTable with sector + stage filters
- [ ] CoInvestmentBadges showing frequent co-investors
- [ ] GraduationFunnelChart (grouped bar by sector cohort year)

## Phase 6: Unit Economics Sandbox
- [ ] Category preset selector (loads defaults from unit-economics-defaults.ts)
- [ ] 5 sliders (AOV, repeat rate, CAC, contribution margin, return rate)
- [ ] Live LTV, LTV/CAC ratio, payback months output
- [ ] "Category benchmark" disclaimer visible

Success criterion: Adjusting any slider updates outputs in <100ms; no layout shift.
