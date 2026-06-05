# Lessons

## Format
Each entry: `[CATEGORY] Pattern — Rule`

## Entries

- [TAXONOMY] QC (quick commerce) is a GTM channel, not a sector — rule: never add "Quick Commerce" as a Sector type; it belongs in GtmModel only. Enforced by TypeScript const arrays.
- [DATA] Momentum Score must show sub-components on hover — rule: never expose a single composite number without a breakdown; "black-box score = failure mode" (Domain Rigorist, LLM Council 2026-06-04).
- [DATA] Label all brand signal data with "as of [date]" — rule: never imply live data; static-but-dated is credible, fake-live destroys VC credibility.
- [SIGNAL] Meta Ads ad-velocity is a burn signal, not a quality signal — rule: flag high Meta ad-velocity + low branded-search-score as a negative indicator, not a positive one.
- [SIGNAL] Instagram follower count is noise — rule: never include absolute follower count in the Momentum Score; only follower growth rate from sub-10k accounts (earned affinity proxy).
- [ARCHITECTURE] Z-score signals within sector cohort — rule: raw signal scores are not cross-sector comparable (snack brand vs. wearables brand); always normalize within sector before compositing.
- [SCOPE] Depth on 3 applets beats breadth on 6 shallow ones — rule: finish Funding Explorer, Momentum Dashboard, White-space Map to full quality before starting the others.
- [STYLE] No fixed pixel widths on Recharts — rule: always wrap in ResponsiveContainer; chart components max ~150 lines.
