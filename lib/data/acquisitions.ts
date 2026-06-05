import type { Sector } from "./taxonomy";

export interface Acquisition {
  id: string;
  target: string;
  acquirer: string;
  acquirerType: "fmcg-incumbent" | "strategic" | "private-equity";
  sector: Sector;
  dealSizeInrCr: number | null;   // null = undisclosed
  dealSizeUsdMn: number | null;
  date: string;                   // YYYY-MM
  targetFoundedYear: number;
  targetLastVcStage: string;
  rationale: string;              // why the acquirer bought it
  sources: string[];
}

// Real Indian consumer D2C acquisitions 2020-2026.
// FMCG incumbents increasingly building D2C portfolios through M&A.
// These exits are the primary return path for India consumer VCs - IPO route is narrow.
export const ACQUISITIONS: Acquisition[] = [

  // ── HUL ──────────────────────────────────────────────────────────────────
  {
    id: "hul-minimalist",
    target: "Minimalist",
    acquirer: "Hindustan Unilever (HUL)",
    acquirerType: "fmcg-incumbent",
    sector: "Beauty & Personal Care",
    dealSizeInrCr: 2955,
    dealSizeUsdMn: 350,
    date: "2025-01",
    targetFoundedYear: 2020,
    targetLastVcStage: "Series A",
    rationale: "Ingredient-forward skincare at mass-market pricing complemented HUL's Lakmé/Pond's portfolio. ~10x return for Peak XV Partners from Series A.",
    sources: ["https://www.business-standard.com/amp/article/companies/skincare-brand-minimalist-raises-rs-110-crore-through-multiple-investors-121072900126_1.html"],
  },
  {
    id: "hul-oziva",
    target: "OZiva",
    acquirer: "Hindustan Unilever (HUL)",
    acquirerType: "fmcg-incumbent",
    sector: "Health & Wellness",
    dealSizeInrCr: null,
    dealSizeUsdMn: null,
    date: "2022-11",
    targetFoundedYear: 2016,
    targetLastVcStage: "Series B",
    rationale: "Plant-based nutrition and wellness - HUL's entry into premium D2C health category.",
    sources: ["https://inc42.com/buzz/hul-acquires-plant-based-nutrition-startup-oziva/"],
  },
  {
    id: "hul-wellbeing-nutrition",
    target: "Wellbeing Nutrition",
    acquirer: "Hindustan Unilever (HUL)",
    acquirerType: "fmcg-incumbent",
    sector: "Health & Wellness",
    dealSizeInrCr: null,
    dealSizeUsdMn: null,
    date: "2024-06",
    targetFoundedYear: 2019,
    targetLastVcStage: "Series B",
    rationale: "Nutraceutical melting strips and clean supplements - deepened HUL's health portfolio post-OZiva.",
    sources: ["https://www.businesstoday.in/latest/corporate/story/wellbeing-nutrition-raises-10-million-in-a-series-b-round-led-by-hul-fireside-ventures-356091-2022-12-12"],
  },

  // ── ITC ───────────────────────────────────────────────────────────────────
  {
    id: "itc-yoga-bar",
    target: "Yoga Bar",
    acquirer: "ITC",
    acquirerType: "fmcg-incumbent",
    sector: "F&B Packaged",
    dealSizeInrCr: 600,
    dealSizeUsdMn: 72,
    date: "2022-01",
    targetFoundedYear: 2014,
    targetLastVcStage: "Series B",
    rationale: "ITC's first major D2C acquisition - healthy snacks/breakfast category to diversify from tobacco and FMCG staples.",
    sources: ["https://inc42.com/buzz/itc-acquires-healthy-snack-brand-yoga-bar/"],
  },
  {
    id: "itc-mylo",
    target: "Mylo",
    acquirer: "ITC",
    acquirerType: "fmcg-incumbent",
    sector: "Baby, Kids & Pets",
    dealSizeInrCr: null,
    dealSizeUsdMn: null,
    date: "2024-03",
    targetFoundedYear: 2017,
    targetLastVcStage: "Series A",
    rationale: "Parenting and baby care D2C platform - ITC expanding into fast-growing baby care category.",
    sources: ["https://www.loestro.com/indias-d2c-brand-ma-playbook-from-bootstrapped-hustle-to-strategic-exit/"],
  },
  {
    id: "itc-mother-sparsh",
    target: "Mother Sparsh",
    acquirer: "ITC",
    acquirerType: "fmcg-incumbent",
    sector: "Baby, Kids & Pets",
    dealSizeInrCr: null,
    dealSizeUsdMn: null,
    date: "2024-08",
    targetFoundedYear: 2016,
    targetLastVcStage: "Seed",
    rationale: "Natural baby and skincare products complementing ITC's BabyJoy brand.",
    sources: ["https://www.loestro.com/indias-d2c-brand-ma-playbook-from-bootstrapped-hustle-to-strategic-exit/"],
  },

  // ── Marico ────────────────────────────────────────────────────────────────
  {
    id: "marico-beardo",
    target: "Beardo",
    acquirer: "Marico",
    acquirerType: "fmcg-incumbent",
    sector: "Beauty & Personal Care",
    dealSizeInrCr: 200,
    dealSizeUsdMn: 24,
    date: "2020-03",
    targetFoundedYear: 2015,
    targetLastVcStage: "Seed",
    rationale: "Men's grooming D2C - Marico's entry into India's emerging male grooming category.",
    sources: ["https://inc42.com/buzz/marico-acquires-51-stake-in-beardo-to-enter-mens-grooming-segment/"],
  },
  {
    id: "marico-true-elements",
    target: "True Elements",
    acquirer: "Marico",
    acquirerType: "fmcg-incumbent",
    sector: "F&B Packaged",
    dealSizeInrCr: 369,
    dealSizeUsdMn: 44,
    date: "2022-08",
    targetFoundedYear: 2013,
    targetLastVcStage: "Series B",
    rationale: "Clean-label breakfast and healthy snacking - Marico's D2C food play to diversify from hair oils.",
    sources: ["https://www.finnovate.in/learn/blog/fmcg-buying-d2c-brands-india"],
  },
  {
    id: "marico-just-herbs",
    target: "Just Herbs",
    acquirer: "Marico",
    acquirerType: "fmcg-incumbent",
    sector: "Beauty & Personal Care",
    dealSizeInrCr: null,
    dealSizeUsdMn: null,
    date: "2021-09",
    targetFoundedYear: 2011,
    targetLastVcStage: "Seed",
    rationale: "Ayurvedic premium beauty - Marico building natural beauty portfolio.",
    sources: ["https://www.finnovate.in/learn/blog/fmcg-buying-d2c-brands-india"],
  },
  {
    id: "marico-plix",
    target: "Plix (The Plant Fix)",
    acquirer: "Marico",
    acquirerType: "fmcg-incumbent",
    sector: "Health & Wellness",
    dealSizeInrCr: 369,
    dealSizeUsdMn: 44,
    date: "2023-03",
    targetFoundedYear: 2019,
    targetLastVcStage: "Series A",
    rationale: "Plant-based health supplements - Marico's health and wellness D2C expansion beyond beauty.",
    sources: ["https://inc42.com/buzz/marico-acquires-plant-based-supplement-brand-plix/"],
  },
  {
    id: "marico-4700bc",
    target: "4700BC (Gourmet Popcorn)",
    acquirer: "Marico",
    acquirerType: "fmcg-incumbent",
    sector: "F&B Packaged",
    dealSizeInrCr: 227,
    dealSizeUsdMn: 27,
    date: "2026-01",
    targetFoundedYear: 2014,
    targetLastVcStage: "Strategic (PVR INOX)",
    rationale: "Premium gourmet popcorn/snacking brand acquired from PVR INOX for ₹226.8 Cr - first of Marico's three 2026 acquisitions doubling down on premium snacking. Marico targets ₹1,000 Cr D2C ARR in FY26 (Plix already past ₹500 Cr).",
    sources: ["https://inc42.com/features/how-marico-turns-d2c-founder-dna-into-fmcg-scale/"],
  },

  // ── Emami ─────────────────────────────────────────────────────────────────
  {
    id: "emami-the-man-company",
    target: "The Man Company",
    acquirer: "Emami",
    acquirerType: "fmcg-incumbent",
    sector: "Beauty & Personal Care",
    dealSizeInrCr: null,
    dealSizeUsdMn: null,
    date: "2022-09",
    targetFoundedYear: 2015,
    targetLastVcStage: "Series A",
    rationale: "Premium men's grooming D2C - Emami's counterpart to Marico's Beardo acquisition.",
    sources: ["https://inc42.com/buzz/emami-acquires-the-man-company/"],
  },
  {
    id: "emami-trunativ",
    target: "Trunativ",
    acquirer: "Emami",
    acquirerType: "fmcg-incumbent",
    sector: "Health & Wellness",
    dealSizeInrCr: null,
    dealSizeUsdMn: null,
    date: "2024-01",
    targetFoundedYear: 2020,
    targetLastVcStage: "Seed",
    rationale: "Clean protein nutrition - Emami entering fast42 2026-listed brand category.",
    sources: ["https://www.loestro.com/indias-d2c-brand-ma-playbook-from-bootstrapped-hustle-to-strategic-exit/"],
  },
];

// Summary insight for the exits/acquisitions view
export const ACQUISITION_INSIGHTS = {
  totalTracked: ACQUISITIONS.length,
  totalDisclosedUsdMn: ACQUISITIONS.filter(a => a.dealSizeUsdMn).reduce((s, a) => s + (a.dealSizeUsdMn ?? 0), 0),
  biggestExit: "Minimalist → HUL at ₹2,955 Cr (~$350M), Jan 2025 - ~10x for Peak XV",
  keyInsight: "70%+ of FMCG acquisitions of D2C brands since 2020. Strategic M&A - not IPO - is the primary VC exit route in India consumer. Marico opened 2026 with three quick acquisitions (4700BC among them), doubling down on premium snacking and youth-led categories.",
  acquirerLeaderboard: [
    { name: "Hindustan Unilever (HUL)", deals: 3, totalUsdMn: 350, note: "Most active by value - Minimalist, OZiva, Wellbeing Nutrition" },
    { name: "Marico", deals: 5, totalUsdMn: 139, note: "Beardo, True Elements, Just Herbs, Plix, 4700BC (Jan 2026)" },
    { name: "ITC", deals: 3, totalUsdMn: 72, note: "Yoga Bar, Mylo, Mother Sparsh" },
    { name: "Emami", deals: 2, totalUsdMn: null, note: "The Man Company, Trunativ" },
  ],
};
