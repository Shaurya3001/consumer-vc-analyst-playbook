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
