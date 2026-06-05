// Market context data - macro signals for the India consumer VC intelligence site.
// All figures sourced from public reports. Cited per data point.

export interface MarketStat {
  label: string;
  value: string;
  note: string;
  source: string;
  asOf: string;
}

export const QUICK_COMMERCE: MarketStat[] = [
  {
    label: "Q-commerce market size (India)",
    value: "$6.94B",
    note: "2026 estimate; projected $10B+ by 2029 at 12.4% CAGR",
    source: "https://www.grabon.in/indulge/tech/quick-commerce-statistics/",
    asOf: "2026-Q1",
  },
  {
    label: "Blinkit market share",
    value: ">50%",
    note: "Q4 FY26: ₹13,232 Cr revenue (674% YoY); quarterly NOV ~₹18,000 Cr",
    source: "https://quashbugs.com/blog/blinkit-surpasses-zomato-in-quick-commerce",
    asOf: "2026-Q1",
  },
  {
    label: "Zepto market share",
    value: "~29%",
    note: "Confidentially filed for $1.2B IPO (Dec 2025); valued at $7B",
    source: "https://www.cnbc.com/2025/12/29/zepto-confidential-ipo-filing-india-quick-commerce-instamart-swiggy-blinkit.html",
    asOf: "2025-12",
  },
  {
    label: "D2C share on Q-commerce",
    value: "30%",
    note: "D2C brands account for 30% of sales on quick commerce platforms; 24X order value growth since FY22",
    source: "https://www.business-standard.com/companies/start-ups/d2c-brands-raise-funds-to-boost-sales-through-quick-commerce-platforms-124101600940_1.html",
    asOf: "2025-Q3",
  },
  {
    label: "QC platform fees for D2C brands",
    value: "35-50% of selling price",
    note: "Commissions + delivery + storage + mandatory ads. 10-15% GMV on advertising alone.",
    source: "https://ecomdigest.in/marketplaces/quick-commerce-d2c-brands-cost-traps",
    asOf: "2025-Q4",
  },
];

export const D2C_MARKET: MarketStat[] = [
  {
    label: "India D2C market size",
    value: "$12-15B",
    note: "2024 estimate; projected $60B by 2030 at ~25-28% CAGR",
    source: "https://www.loestro.com/indias-d2c-brand-ma-playbook-from-bootstrapped-hustle-to-strategic-exit/",
    asOf: "2024",
  },
  {
    label: "Total D2C VC funding (2024)",
    value: "$757M",
    note: "Down from $930M in 2023. Capital concentrating in brands with margin control.",
    source: "https://ecomdigest.in/marketplaces/quick-commerce-d2c-brands-cost-traps",
    asOf: "2024",
  },
  {
    label: "Delhi NCR D2C funding (2015-Q1 2026)",
    value: "$3.5B+",
    note: "434 deals; followed by Bengaluru ($3.4B) and Mumbai ($2B)",
    source: "https://inc42.com/buzz/delhi-ncr-emerges-as-indias-top-d2c-hub/",
    asOf: "2026-Q1",
  },
  {
    label: "FAST42 2026 cohort revenue",
    value: "₹2,100 Cr",
    note: "42 fastest-growing D2C brands combined; raised ₹1,400 Cr+ funding; 7,000+ jobs",
    source: "https://inc42.com/startups/fast42-2026-announcing-the-ranking-of-indias-fastest-growing-d2c-brands/",
    asOf: "FY25",
  },
  {
    label: "FMCG D2C acquisitions share",
    value: "70%+",
    note: "Of all FMCG acquisitions in last 5 years have been D2C brands. M&A is the primary VC exit route - not IPO.",
    source: "https://www.finnovate.in/learn/blog/fmcg-buying-d2c-brands-india",
    asOf: "2025",
  },
];

export const BPC_MARKET: MarketStat[] = [
  {
    label: "India BPC market size (2026)",
    value: "$28B+",
    note: "Projected to reach $28B+ by 2030; growing at ~12% CAGR",
    source: "https://inc42.com/features/the-beauty-and-the-brand-decoding-the-28-bn-beauty-personal-care-opportunity-for-d2c-brands/",
    asOf: "2026",
  },
  {
    label: "Largest D2C BPC exit",
    value: "₹2,955 Cr",
    note: "Minimalist acquired by HUL (Jan 2025) - India's largest D2C beauty exit; ~10x for Peak XV",
    source: "https://www.business-standard.com/amp/article/companies/skincare-brand-minimalist-raises-rs-110-crore-through-multiple-investors-121072900126_1.html",
    asOf: "2025-01",
  },
];

// Macro consumption outlook, sourced to the major industry reports (see lib/data/reports.ts).
export const MACRO_CONSUMPTION: MarketStat[] = [
  {
    label: "India retail market by 2030",
    value: "~$1T",
    note: "Projected to reach ~$1 trillion by 2030 on rising disposable incomes and digitisation.",
    source: "https://firesideventures.com/pages/the-indian-consumer-report",
    asOf: "2025 (Fireside Ventures)",
  },
  {
    label: "India VC funding (2025)",
    value: "~$16B",
    note: "Second consecutive year of growth; $250M+ rounds doubled YoY. Consumer tech cooled vs 2024 mega-deal peak.",
    source: "https://www.bain.com/insights/india-venture-capital-report-2026/",
    asOf: "2026 (Bain & Company)",
  },
  {
    label: "Consumer tech funding (2024)",
    value: "$5.4B",
    note: "Largest VC sector in 2024, up 2.3x; D2C funding grew ~30% as quick commerce became the scaling channel.",
    source: "https://www.bain.com/insights/india-venture-capital-report-2025/",
    asOf: "2025 (Bain & Company)",
  },
  {
    label: "Branded retail by 2030",
    value: "~$730B",
    note: "Branded retail roughly doubles to ~$730B (~45% of all retail) by 2030; new-age brands outpace traditional by 200-300%.",
    source: "https://firesideventures.com/pages/the-indian-consumer-report",
    asOf: "2025 (Fireside Ventures)",
  },
  {
    label: "Quick commerce GMV by 2030",
    value: "$25B+",
    note: "From $10B+ today; 30-33M monthly users across 150+ cities and 5,000+ dark stores. BPC on q-comm grew ~22.5x CY22-CY25.",
    source: "https://redseer.com/reports/reinventing-packaged-fb-with-quick-commerce/",
    asOf: "2025 (Redseer)",
  },
  {
    label: "General trade share",
    value: "91% to ~70%",
    note: "GT share of retail falls from 91% (2014) to ~70% by 2030; D2C + quick commerce reach up to ~5% of the market.",
    source: "https://firesideventures.com/pages/the-indian-consumer-report",
    asOf: "2025 (Fireside Ventures)",
  },
  {
    label: "India I concentration",
    value: "15% to 35%/60%",
    note: "India I is ~15% of population but drives ~35% of retail and ~60% of branded purchases; Bharat is the other ~85%.",
    source: "https://firesideventures.com/pages/the-indian-consumer-report",
    asOf: "2025 (Fireside Ventures)",
  },
  {
    label: "Bharat brand-buyers added",
    value: "+100M",
    note: "By 2030 India II begins to mirror India I, adding 100M+ new brand-buying consumers; spending ~15% more per person since FY23-24.",
    source: "https://firesideventures.com/pages/the-bharat-report",
    asOf: "2025 (Fireside Ventures, Bharat Report)",
  },
  {
    label: "Middle class expansion",
    value: "5% to 40%+",
    note: "Share classified middle-class projected to rise sharply; real consumption ~4x (Rs 17T to Rs 70T).",
    source: "https://www.mckinsey.com/mgi/overview/in-the-news/consumer-evolution-in-india",
    asOf: "2025 (McKinsey Global Institute)",
  },
  {
    label: "Consumption base (2019-2030)",
    value: "Rs 120T to 290T",
    note: "BCG structural view (2020 vintage): consumption ~INR 120T in 2019, projected ~INR 290-300T by 2030. Read alongside the 2025-26 reports.",
    source: "https://web-assets.bcg.com/7c/d0/4658d6074223b9cbc5ec677d6035/bcg-how-india-spends-shops-saves-in-the-new-reality-for-distribution.pdf",
    asOf: "2020 (BCG)",
  },
  {
    label: "Shopper intent (next 6 mo)",
    value: "75% apparel",
    note: "PwC survey (n=1,000): 75% expect to raise apparel spend, 74% grocery, 71% health & beauty; 56% still prefer in-store.",
    source: "https://www.pwc.in/industries/retail-and-consumer/voice-of-the-consumer-survey-2024india-perspective.html",
    asOf: "2024 (PwC India)",
  },
  {
    label: "Online shoppers by 2030",
    value: "400M+",
    note: "Against 1.1B internet users expected by 2030 (~70% smartphone penetration) - a deep runway for digital-first brands.",
    source: "https://firesideventures.com/pages/the-indian-consumer-report",
    asOf: "2025 (Fireside Ventures)",
  },
];

export const INDIA_CONSUMER_TIERS = {
  "India 1": {
    population: "~120M",
    description: "Credit-card using, English/UPI-native, premium-willing urban consumers",
    avgMonthlySpend: "₹40,000+",
    keyCities: ["Mumbai", "Delhi", "Bengaluru", "Hyderabad", "Chennai", "Pune"],
  },
  "India 2": {
    population: "~300M",
    description: "Aspirational, price-sensitive, EMI/BNPL-driven, Tier-1/2 city consumers",
    avgMonthlySpend: "₹15,000-40,000",
    keyCities: ["Ahmedabad", "Surat", "Jaipur", "Lucknow", "Chandigarh", "Kochi"],
  },
  "India 3": {
    population: "~900M+",
    description: "Value-first, vernacular, cash/UPI-micro, Tier-2/3 and rural consumers",
    avgMonthlySpend: "<₹15,000",
    keyCities: ["All Tier-2/3 cities and rural India"],
  },
};
