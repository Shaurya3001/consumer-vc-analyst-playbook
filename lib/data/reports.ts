// Canonical India consumer / VC industry reports - the analyst's reading list.
// Each entry links to the publisher. Key stats are figures published in those
// reports, verified against the source PDFs (parsed Jun 2026) and report pages.
// Factual data points only; cite the report directly for external use.

export type ReportAuthorType =
  | "consulting" // MBB / Big 4 / boutique
  | "vc"
  | "research"
  | "investment-bank"
  | "aggregator";

export interface IndustryReport {
  id: string;
  title: string;
  author: string;
  authorType: ReportAuthorType;
  year: number;
  url: string;
  scope: string;
  keyStats: { stat: string; detail: string }[];
}

export const AUTHOR_TYPE_LABEL: Record<ReportAuthorType, string> = {
  consulting: "Consulting",
  vc: "VC",
  research: "Research",
  "investment-bank": "Investment Bank",
  aggregator: "Aggregator",
};

export const INDUSTRY_REPORTS: IndustryReport[] = [
  {
    id: "bain-ivc-2026",
    title: "India Venture Capital Report 2026",
    author: "Bain & Company (with IVCA)",
    authorType: "consulting",
    year: 2026,
    url: "https://www.bain.com/insights/india-venture-capital-report-2026/",
    scope: "India VC / growth-equity funding, deal sizes, sector mix and exits for 2025.",
    keyStats: [
      { stat: "~$16B (1.2x)", detail: "VC / growth-equity deployed in 2025, up from ~$14B in 2024 - second straight year of growth, even as overall India PE-VC fell ~18%." },
      { stat: "+18% deals", detail: "Deal activity rose ~18% YoY, led by sub-$50M rounds; average ticket ~$11.5M." },
      { stat: "$250M+ deals 4 → 8", detail: "Number of $250M+ rounds doubled in 2025; $100M+ late-stage rounds rebounded in SaaS and fintech." },
      { stat: "~$5.4B raised", detail: "Capital raised by VC/growth funds doubled YoY, driven by a surge in $100M+ vehicles." },
      { stat: "Consumer tech +25%", detail: "Consumer-tech deal activity rose ~25% over 2023 but with fewer mega-deals than 2024; fintech + consumer tech ~60% of exit activity." },
      { stat: "Exits +30%, IPOs >$1B", detail: "Exit value climbed ~30% over 2024; IPO-led exits rose above $1B as public markets reopened." },
    ],
  },
  {
    id: "bain-ivc-2025",
    title: "India Venture Capital Report 2025",
    author: "Bain & Company (with IVCA)",
    authorType: "consulting",
    year: 2025,
    url: "https://www.bain.com/insights/india-venture-capital-report-2025/",
    scope: "The 2024 rebound in Indian VC, with consumer tech as the standout sector.",
    keyStats: [
      { stat: "$13.7B (1.4x)", detail: "India VC funding in 2024, 1.4x the 2023 level; deal volume up ~45% to 1,270 deals." },
      { stat: "$5.4B consumer tech", detail: "Largest VC sector in 2024, funding up 2.3x on B2C commerce, travel, gaming and edtech mega-deals." },
      { stat: "D2C +30%", detail: "D2C funding grew ~30% as quick commerce became the key scaling channel; consumer/retail exits gained momentum." },
    ],
  },
  {
    id: "fireside-consumer-2030",
    title: "The Indian Consumer at 2030",
    author: "Fireside Ventures",
    authorType: "vc",
    year: 2025,
    url: "https://firesideventures.com/pages/the-indian-consumer-report",
    scope: "Consumer VC's long-range view of category, channel and consumer fragmentation to 2030.",
    keyStats: [
      { stat: "~$1T retail by 2030", detail: "India's retail market projected to reach ~$1 trillion by 2030; ~45-48% discretionary, ~$600-650 per-capita retail spend." },
      { stat: "India I: 15% → 35%/60%", detail: "India I is ~15% of population but drives ~35% of retail and ~60% of branded purchases; Bharat is the other ~85%." },
      { stat: "Branded ~$730B (~45%)", detail: "Branded retail roughly doubles to ~$730B (~45% of all retail) by 2030; new-age brands outpace traditional by 200-300%." },
      { stat: "GT 91% → ~70%", detail: "General trade share falls from 91% (2014) to ~70% by 2030; D2C + quick commerce reach up to ~5% of the market." },
      { stat: "1.1B / 400M+", detail: "1.1B internet users and 400M+ online shoppers by 2030, with ~70% smartphone penetration." },
    ],
  },
  {
    id: "fireside-bharat",
    title: "The Bharat Report",
    author: "Fireside Ventures",
    authorType: "vc",
    year: 2025,
    url: "https://firesideventures.com/pages/the-bharat-report",
    scope: "Deep-dive on the India II / Bharat consumer the metro-first lens misses.",
    keyStats: [
      { stat: "+100M brand-buyers", detail: "By 2030 India II begins to mirror India I, adding 100M+ new brand-buying consumers; ~150M households, ~$1T opportunity." },
      { stat: "+15% per-person spend", detail: "Bharat consumers are spending ~15% more per person since FY23-24 as aspiration rises." },
      { stat: "Women 24.6% → 47%", detail: "Female workforce participation rising FY18 24.6% → FY24 36% → FY30 ~47%; ~30M women already shaping purchase decisions." },
    ],
  },
  {
    id: "redseer-quick-commerce",
    title: "Quick Commerce & Packaged F&B in India",
    author: "Redseer Strategy Consultants",
    authorType: "research",
    year: 2025,
    url: "https://redseer.com/reports/reinventing-packaged-fb-with-quick-commerce/",
    scope: "Tracking the quick-commerce shift reshaping Indian retail and brand distribution.",
    keyStats: [
      { stat: "$10B+ → $25B+", detail: "Quick commerce at $10B+ GMV today, projected to $25B+ by 2030 - India's fastest-growing retail format." },
      { stat: "30-33M users, 150+ cities", detail: "30-33M monthly transacting users across 150+ cities on a 5,000+ dark-store network." },
      { stat: "BPC 22.5x", detail: "Beauty & Personal Care GMV on quick commerce expanded ~22.5x between CY22 and CY25." },
      { stat: "~68% top-8 cities", detail: "Top-8 cities still drive ~68% of e-commerce GMV, which grew ~17% in the first 10 months of CY2025." },
    ],
  },
  {
    id: "mckinsey-consumer-evolution",
    title: "India's Consumer Evolution",
    author: "McKinsey Global Institute",
    authorType: "consulting",
    year: 2025,
    url: "https://www.mckinsey.com/mgi/overview/in-the-news/consumer-evolution-in-india",
    scope: "Macro view of the rise of India's middle class and discretionary consumption.",
    keyStats: [
      { stat: "5% → 40%+", detail: "Share of population classified as middle class projected to rise from ~5% to 40%+, lifting discretionary spend." },
      { stat: "₹17T → ₹70T", detail: "Real consumption projected to grow ~4x; India becomes a top-5 global consumer market." },
    ],
  },
  {
    id: "bcg-india-spends",
    title: "How India Spends, Shops and Saves",
    author: "Boston Consulting Group",
    authorType: "consulting",
    year: 2020,
    url: "https://web-assets.bcg.com/7c/d0/4658d6074223b9cbc5ec677d6035/bcg-how-india-spends-shops-saves-in-the-new-reality-for-distribution.pdf",
    scope: "Distribution-lens read on Indian household spend (pre/post-COVID, 2020 vintage).",
    keyStats: [
      { stat: "₹120T (2019)", detail: "India consumption reached ~INR 120 trillion in 2019; projected to ~INR 290-300 trillion by 2030." },
      { stat: "Tier-4 unlock", detail: "Smaller tier-3/4 cities (sub-1M population) become a growing share of consumption as income tiers shift up to 2030." },
      { stat: "Dated 2020", detail: "Useful for the structural distribution framework; the absolute figures predate the quick-commerce era - read alongside the 2025-26 reports." },
    ],
  },
  {
    id: "pwc-voice-consumer",
    title: "Voice of the Consumer Survey - India",
    author: "PwC India",
    authorType: "consulting",
    year: 2024,
    url: "https://www.pwc.in/industries/retail-and-consumer/voice-of-the-consumer-survey-2024india-perspective.html",
    scope: "Primary-research read on Indian shopper intent, channel preference and trust (n=1,000).",
    keyStats: [
      { stat: "75% / 74% / 71%", detail: "Share expecting to increase 6-month spend on clothing & footwear (75%), grocery (74%) and health & beauty (71%)." },
      { stat: "56% in-store", detail: "56% still prefer buying through physical stores - the in-store experience trumps online for many categories." },
      { stat: "82% trust = data", detail: "Top trust driver is protecting customer data (82%), ahead of product quality (80%) and affordability (73%)." },
    ],
  },
  {
    id: "thevcproject",
    title: "The VC Project - Report Repository",
    author: "The VC Project",
    authorType: "aggregator",
    year: 2026,
    url: "https://thevcproject.in/",
    scope: "Curated repository of India reports authored by consulting, IB and VC firms.",
    keyStats: [
      { stat: "Index", detail: "Aggregates reports from MBB, Big 4, boutiques, investment banks and VCs in one place." },
    ],
  },
];

export const REPORT_TAKEAWAY =
  "Parsed from the source reports: India's retail market roughly doubles to ~$1T by 2030 (Fireside), branded retail hits ~$730B (~45% of the pie), and general trade cedes share from 91% to ~70%. VC has recovered to ~$16B in 2025 with consumer-tech cooling from its 2024 peak (Bain), while quick commerce is the fastest-growing channel toward $25B+ GMV (Redseer). The contested ground is Bharat - India II adds 100M+ brand-buyers by 2030 - where value-seeking and distribution, not metro D2C economics, decide the winners.";
