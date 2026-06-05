/**
 * Unit economics model for the sandbox.
 *
 * Deliberately simple and fully transparent - every intermediate is surfaced
 * in the UI so a VC can audit the chain rather than trust a black-box LTV.
 *
 * Model:
 *   effectiveAOV   = AOV × (1 − returnRate)
 *   contribPerOrder = effectiveAOV × contributionMargin
 *   annualContrib  = contribPerOrder × ordersPerYear
 *   lifespanYears  = 1 / (1 − retentionRate), capped at 5y   (geometric retention)
 *   LTV            = annualContrib × lifespanYears
 *   LTV:CAC        = LTV / CAC
 *   paybackMonths  = CAC / (annualContrib / 12)
 *
 * retentionRate here = ANNUAL retention (share of customers who buy again next year).
 */

export interface UnitEconInputs {
  aov: number;                // INR
  returnRate: number;         // 0-1
  contributionMargin: number; // 0-1
  ordersPerYear: number;      // orders per active customer per year
  retentionRate: number;      // 0-1 annual retention
  cac: number;                // INR
}

export interface UnitEconResult {
  effectiveAov: number;
  contribPerOrder: number;
  annualContrib: number;
  lifespanYears: number;
  ltv: number;
  ltvCacRatio: number;
  paybackMonths: number;      // 999 sentinel = never
  firstOrderMargin: number;   // contribution on order 1 minus CAC (acquisition economics)
  verdict: "strong" | "viable" | "marginal" | "unprofitable";
}

const LIFESPAN_CAP_YEARS = 5;

export function computeUnitEconomics(inp: UnitEconInputs): UnitEconResult {
  const effectiveAov = inp.aov * (1 - inp.returnRate);
  const contribPerOrder = effectiveAov * inp.contributionMargin;
  const annualContrib = contribPerOrder * inp.ordersPerYear;

  const lifespanYears =
    inp.retentionRate >= 1
      ? LIFESPAN_CAP_YEARS
      : Math.min(1 / (1 - inp.retentionRate), LIFESPAN_CAP_YEARS);

  const ltv = annualContrib * lifespanYears;
  const ltvCacRatio = inp.cac > 0 ? ltv / inp.cac : 0;
  const monthlyContrib = annualContrib / 12;
  const paybackMonths = monthlyContrib > 0 ? Math.ceil(inp.cac / monthlyContrib) : 999;
  const firstOrderMargin = contribPerOrder - inp.cac;

  let verdict: UnitEconResult["verdict"];
  if (ltvCacRatio >= 3 && paybackMonths <= 12) verdict = "strong";
  else if (ltvCacRatio >= 2) verdict = "viable";
  else if (ltvCacRatio >= 1) verdict = "marginal";
  else verdict = "unprofitable";

  return {
    effectiveAov: Math.round(effectiveAov),
    contribPerOrder: Math.round(contribPerOrder),
    annualContrib: Math.round(annualContrib),
    lifespanYears: Math.round(lifespanYears * 10) / 10,
    ltv: Math.round(ltv),
    ltvCacRatio: Math.round(ltvCacRatio * 10) / 10,
    paybackMonths,
    firstOrderMargin: Math.round(firstOrderMargin),
    verdict,
  };
}

export const VERDICT_META = {
  strong: { label: "Strong", color: "text-emerald-400", bg: "bg-emerald-950/40 border-emerald-800", note: "LTV:CAC ≥ 3 and payback ≤ 12 months - fundable unit economics." },
  viable: { label: "Viable", color: "text-lime-400", bg: "bg-lime-950/40 border-lime-800", note: "LTV:CAC ≥ 2 - workable, watch payback period." },
  marginal: { label: "Marginal", color: "text-amber-400", bg: "bg-amber-950/40 border-amber-800", note: "LTV:CAC between 1-2 - covering costs but thin; growth burns cash." },
  unprofitable: { label: "Unprofitable", color: "text-rose-400", bg: "bg-rose-950/40 border-rose-800", note: "LTV below CAC - every new customer loses money." },
} as const;
