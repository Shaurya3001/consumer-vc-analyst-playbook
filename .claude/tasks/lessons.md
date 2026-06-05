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
- [SIGNALS] When replacing estimated signals with computed ones, keep the old fields in BrandSignals as context-only (don't remove them from all brand objects); just stop driving the score from them — the computation layer in brand-signals.ts handles the new values independently.
- [POWERSHELL] PowerShell heredoc syntax is `@'...'@` (single-quoted, column-0 closing), NOT bash `<<'EOF'`. Git commit messages must use this form on Windows. Avoid `->` in the body (parsed as redirection even inside the here-string in some cases) - prefer a `$msg` var with `` `n `` newlines.
- [PREVIEW] After changing the SHAPE of a shared computed object (e.g. adding signal keys to MomentumResult.components), the HMR console buffer can emit stale NaN/undefined warnings from intermediate renders even though the final DOM is clean. Verify by inspecting the actual DOM (rings/bars/dasharrays), and if warnings persist, RESTART the dev server (preview_stop + preview_start) rather than trusting the rolling console buffer.
