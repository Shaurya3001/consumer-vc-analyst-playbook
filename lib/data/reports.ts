// Canonical India consumer / VC industry reports — the analyst's reading list.
// Each entry links to the publisher's official report page. Key stats are the
// figures those reports published (verified via the report pages, their press
// summaries, and tier-1 coverage). Use for context, cite the report directly.

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
      { stat: "~$16B", detail: "India VC / growth-equity deployed in 2025 — second consecutive year of growth, more balanced across volume and deal size." },
      { stat: "$250M+ deals 2x", detail: "Number of $250M+ rounds doubled YoY; $100M+ rounds rebounded (led by SaaS and fintech)." },
      { stat: "~$5.4B", detail: "Capital raised by VC / growth funds doubled YoY, driven by a surge in $100M+ vehicles." },
      { stat: "Consumer tech cooled", detail: "Fewer mega-deals than 2024, but higher deal activity than 2023; fintech + consumer tech led exit value." },
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
      { stat: "$13.7B", detail: "India VC funding in 2024 — 1.4x the 2023 level; deal volume up ~45% to 1,270 deals." },
      { stat: "$5.4B", detail: "Consumer tech became the largest sector, with funding up 2.3x on B2C commerce, travel, gaming and edtech mega-deals." },
      { stat: "D2C +30%", detail: "D2C funding grew ~30% as quick commerce emerged as the key scaling channel; consumer/retail exits gained momentum." },
    ],
  },
  {
    id: "redseer-consumer-2030",
    title: "The Indian Consumer at 2030",
    author: "Redseer Strategy Consultants",
    authorType: "research",
    year: 2025,
    url: "https://redseer.com/reports/the-indian-consumer-at-2030-redefining-aspirations-choices-and-markets/",
    scope: "Long-range view of Indian consumption, channels and the quick-commerce shift to 2030.",
    keyStats: [
      { stat: "$10B+ GMV", detail: "Quick commerce GMV with 30–33M monthly transacting users across 150+ cities and a 5,000+ dark-store network." },
      { stat: "→ $25B+ by 2030", detail: "Quick commerce projected to scale from ~$4B to $25B+ GMV by 2030 — India's fastest-growing retail format." },
      { stat: "22.5x", detail: "Beauty & Personal Care GMV on quick commerce expanded ~22.5x between CY22 and CY25." },
      { stat: "~68%", detail: "Top-8 cities still contribute ~68% of overall e-commerce GMV (which grew ~17% in the first 10 months of CY2025)." },
    ],
  },
  {
    id: "fireside-consumer-2030",
    title: "The Indian Consumer at 2030",
    author: "Fireside Ventures",
    authorType: "vc",
    year: 2025,
    url: "https://firesideventures.com/pages/the-indian-consumer-report",
    scope: "Consumer VC's view of category, channel and consumer fragmentation to 2030.",
    keyStats: [
      { stat: "~$1T retail by 2030", detail: "India's retail market projected to reach ~$1 trillion by 2030 on rising disposable incomes and digitisation." },
      { stat: "GT 91% → ~70%", detail: "General trade share falls from 91% (2014) to ~70% by 2030 as modern trade, e-com, q-commerce and D2C expand." },
      { stat: "1.1B / 400M+", detail: "1.1B internet users and 400M+ online shoppers expected by 2030." },
      { stat: "Product → experience", detail: "High-income buyers upgrade from products to product-plus-experience bundles (skincare → derma, luggage → curated travel)." },
    ],
  },
  {
    id: "fireside-bharat",
    title: "The Bharat Report",
    author: "Fireside Ventures",
    authorType: "vc",
    year: 2024,
    url: "https://firesideventures.com/pages/the-bharat-report",
    scope: "Deep-dive on the India 2 / India 3 (Bharat) consumer the metro-first lens misses.",
    keyStats: [
      { stat: "Bharat-first", detail: "Frames the value-led, vernacular, EMI/UPI-driven consumer base behind most of India's population." },
      { stat: "Distribution moat", detail: "Argues GT and affordability — not metro D2C economics — decide who wins the mass market." },
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
      { stat: "5.3% CAGR", detail: "Average real household disposable income compounding through the period." },
    ],
  },
  {
    id: "bcg-india-spends",
    title: "How India Spends, Shops and Saves",
    author: "Boston Consulting Group",
    authorType: "consulting",
    year: 2024,
    url: "https://web-assets.bcg.com/7c/d0/4658d6074223b9cbc5ec677d6035/bcg-how-india-spends-shops-saves-in-the-new-reality-for-distribution.pdf",
    scope: "Distribution-lens read on how Indian households allocate spend across channels.",
    keyStats: [
      { stat: "Channel reset", detail: "Maps the shift of household spend across general trade, modern trade, e-commerce and quick commerce." },
      { stat: "Premiumization", detail: "Discretionary and premium categories grow as basic-needs spend is met across income tiers." },
    ],
  },
  {
    id: "pwc-voice-consumer",
    title: "Voice of the Consumer Survey — India",
    author: "PwC India",
    authorType: "consulting",
    year: 2024,
    url: "https://www.pwc.in/industries/retail-and-consumer/voice-of-the-consumer-survey-2024india-perspective.html",
    scope: "Survey-based read on Indian shopper behaviour, value-seeking and channel preference.",
    keyStats: [
      { stat: "Value recipe", detail: "Indian consumers balance premiumization with sharp value-seeking; channel trust and price both matter." },
      { stat: "Survey-grounded", detail: "Primary-research counterweight to the top-down market-sizing reports." },
    ],
  },
  {
    id: "thevcproject",
    title: "The VC Project — Report Repository",
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
  "Across Bain, Redseer, Fireside, McKinsey and BCG the through-line is consistent: India's consumer market roughly doubles to ~$1T retail by 2030, the middle class expands sharply, quick commerce is the fastest-growing channel (toward $25B+ GMV), and general trade cedes share to modern/online/quick/D2C — even as value-seeking and Bharat distribution decide who actually wins the mass market.";
