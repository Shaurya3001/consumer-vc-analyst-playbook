# Project context

India Consumer VC Intelligence — an interactive applet site for early-stage VCs focused on the Indian consumer market. Visitors filter real-looking data across funding rounds, emerging brands, white-space gaps, investor activity, cohort funnels, and unit-economics. All data is static/dummy in `/lib/data/`; no backend, no external API calls.

## Stack
- Language: TypeScript (strict)
- Framework: Next.js 14 (App Router)
- Database: None — all data in `/lib/data/` as typed TS constants
- Deploy: Vercel
- Critical dependencies: Tailwind CSS, Recharts, Framer Motion, shadcn/ui

## Taxonomy (the MECE spine)
Three orthogonal axes — every brand and round is tagged with one value per axis:
- **Sector** (primary, 11 buckets): F&B Packaged, F&B Foodservice, Beauty & Personal Care, Fashion & Accessories, Health & Wellness, Home & Living, Consumer Electronics, Baby/Kids/Pets, Consumer Services, Consumer FinTech, Consumer Internet
- **GTM model** (multi-select tag): D2C-first, Marketplace-led, QC-native, Omnichannel, General Trade, Platform
- **Income tier**: Value, Mass, Mass-premium, Premium, Bharat/Tier-2+

QC (quick commerce) is a GTM tag, NOT a sector. This is a hard constraint.

## Code style
- All interactive state lives in React hooks; no global state manager.
- Dummy data goes in `/lib/data/<applet-name>.ts` — never hardcoded inline.
- Component files max ~150 lines; split before growing past that.
- Applet pages at `/app/applets/<slug>/page.tsx`.
- Recharts components must have ResponsiveContainer; never fixed pixel widths.
- All props interfaces named `<ComponentName>Props`.
- No inline styles — Tailwind classes only.
- Momentum Score must show sub-scores on hover; never a black-box single number.
- Label brand data as "as of [date], compiled from public sources" — no fake-live tickers.

## Do's and don'ts
- Check `/components/` before creating new components.
- Never create documentation files unless explicitly asked.
- Never add console.log to committed code.
- Ask before adding any new npm dependency.
- Never fake a Vercel deploy.
- Each applet must work fully offline.
- QC as a sector category is a taxonomy violation — always a GTM tag.

## Workflow orchestration
1. Plan mode for any task with 3+ steps or touching multiple applets. Re-plan when stuck.
2. Use subagents for research, parallel applet builds, and code review.
3. After ANY correction, add a lesson to `tasks/lessons.md`.
4. Never mark a task done without showing rendered output or passing test.

## Task management
- Plan first → `tasks/todo.md`. Confirm plan. Track progress. Capture lessons.

## Core principles
- Simplicity first. Every applet should be explainable in one sentence.
- No laziness. If a chart looks wrong, fix the data model, not the label.
- Minimal impact. A change to one applet must not break another.

## Linked rules
- @rules/planning.md
- @rules/git-practices.md
- @rules/code-quality.md
- @rules/session-persistence.md

## Adversarial framing
Lead with the strongest counterargument. Calibrated confidence only. Never claim a component renders correctly without proof.
