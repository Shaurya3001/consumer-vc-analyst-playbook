import { FUNDING_ROUNDS } from "./funding-rounds";
import { SECTORS, INCOME_TIERS } from "./taxonomy";
import type { Sector, IncomeTier } from "./taxonomy";

export interface WhitespaceCell {
  sector: Sector;
  incomeTier: IncomeTier;
  roundCount: number;
  totalUsdMn: number;
  // 0 = well-funded / crowded, 100 = clear white space
  gapScore: number;
  // Qualitative label for the gap narrative
  narrative: string;
  // Notable companies in this cell (for tooltip)
  examples: string[];
}

// Editorial gap scores - how underfunded is this cell relative to market opportunity?
// Derived from: round count vs. TAM knowledge of Indian market.
// High gapScore = VC under-indexed, opportunity exists.
const EDITORIAL_GAP: Partial<Record<`${Sector}::${IncomeTier}`, { score: number; narrative: string }>> = {
  // F&B Packaged
  "F&B Packaged::Value":          { score: 85, narrative: "Mass-market staples (oil, atta, dal) sold via kirana - near-zero VC activity despite ₹4L Cr TAM" },
  "F&B Packaged::Mass":           { score: 70, narrative: "Price-sensitive snacking and beverages - few D2C plays at this price point; GT-distribution moat is hard" },
  "F&B Packaged::Bharat/Tier-2+": { score: 80, narrative: "Regional flavour brands and local dairy - large market, scarce formal capital" },
  "F&B Packaged::Mass-premium":   { score: 20, narrative: "Crowded - The Whole Truth, Epigamia, Blue Tokai all compete here" },
  "F&B Packaged::Premium":        { score: 15, narrative: "Active - Vahdam, Blue Tokai, Wakao well-funded; further entry faces saturation" },

  // F&B Foodservice
  "F&B Foodservice::Mass":        { score: 75, narrative: "Affordable QSR and cloud kitchens at ₹80-150 ticket - undercapitalised vs. size" },
  "F&B Foodservice::Value":       { score: 90, narrative: "Street food formalisation - no institutional capital despite massive daily transaction volume" },
  "F&B Foodservice::Bharat/Tier-2+": { score: 88, narrative: "Tier-2/3 dining formalisation barely touched by VC" },
  "F&B Foodservice::Mass-premium": { score: 40, narrative: "Licious, Hocco active; room for regional variants" },

  // Beauty & Personal Care
  "Beauty & Personal Care::Mass-premium": { score: 10, narrative: "Most crowded cell - Pilgrim, mCaffeine, SUGAR, Purplle, Innovist all compete. BPC GMV on quick commerce grew ~22.5x CY22-CY25 (Redseer), which pulled everyone in." },
  "Beauty & Personal Care::Premium":      { score: 25, narrative: "Juicy Chemistry, Earth Rhythm funded; still fewer players than mass-premium" },
  "Beauty & Personal Care::Mass":         { score: 60, narrative: "Affordable BPC at ₹50-200 price points - dominated by Hindustan Unilever; D2C gap" },
  "Beauty & Personal Care::Value":        { score: 88, narrative: "Sachets and local brands - almost no VC play; GT distribution required" },
  "Beauty & Personal Care::Bharat/Tier-2+": { score: 78, narrative: "Vernacular-language BPC and herbal brands for India 2/3 - underfunded" },

  // Fashion & Accessories
  "Fashion & Accessories::Premium":     { score: 20, narrative: "Mokobara, Bliss Club, Zouk active; niche but well-served" },
  "Fashion & Accessories::Mass-premium": { score: 30, narrative: "XYXX, Bewakoof play here; some room" },
  "Fashion & Accessories::Mass":        { score: 65, narrative: "Meesho-adjacent fast fashion - marketplace-led, hard for D2C to compete on economics" },
  "Fashion & Accessories::Value":       { score: 90, narrative: "₹150-400 fashion for India 2/3 - near-zero institutional capital" },
  "Fashion & Accessories::Bharat/Tier-2+": { score: 82, narrative: "Ethnic wear and affordable fashion in smaller cities - clear gap" },

  // Health & Wellness
  "Health & Wellness::Mass-premium":   { score: 20, narrative: "Most active - Bold Care, Traya, Nua, Wellbeing Nutrition all funded" },
  "Health & Wellness::Premium":        { score: 30, narrative: "Functional supplements, personalised nutrition - Wellbeing Nutrition, Kapiva covered" },
  "Health & Wellness::Mass":           { score: 72, narrative: "OTC wellness at ₹100-400 - generic brands dominate; D2C gap exists" },
  "Health & Wellness::Value":          { score: 88, narrative: "Preventive health for India 3 - near-zero VC; Jan Aushadhi-style models needed" },
  "Health & Wellness::Bharat/Tier-2+": { score: 78, narrative: "Ayurveda, preventive care for Tier-2+ - Kapiva reaching here but category still open" },

  // Home & Living
  "Home & Living::Premium":        { score: 20, narrative: "Wakefit, The Sleep Company well-funded" },
  "Home & Living::Mass-premium":   { score: 40, narrative: "Pepperfry, Wakefit cover upper end; some mid-market room" },
  "Home & Living::Mass":           { score: 70, narrative: "Affordable furniture and home goods below ₹5K ticket - offline-dominated, D2C hard" },
  "Home & Living::Value":          { score: 92, narrative: "Basic home goods for India 2/3 - entirely offline; no VC presence" },
  "Home & Living::Bharat/Tier-2+": { score: 85, narrative: "Entry-level home improvement in smaller cities - clear white space" },

  // Consumer Electronics
  "Consumer Electronics::Mass":           { score: 30, narrative: "boAt dominates audio; Atomberg dominates fans - room in adjacent categories" },
  "Consumer Electronics::Mass-premium":   { score: 35, narrative: "Atomberg, boAt overlap here; premium wearables underdeveloped" },
  "Consumer Electronics::Value":          { score: 82, narrative: "Sub-₹500 accessories and entry devices - Micromax-territory; no D2C VC play" },
  "Consumer Electronics::Premium":        { score: 50, narrative: "Premium audio/wearables - Apple dominates; Indian premium play rare" },
  "Consumer Electronics::Bharat/Tier-2+": { score: 75, narrative: "Rural-first electronics (solar, basic compute) - early-stage opportunity" },

  // Baby, Kids & Pets
  "Baby, Kids & Pets::Premium":     { score: 20, narrative: "Slurrp Farm, Heads Up For Tails, Supertails well-funded" },
  "Baby, Kids & Pets::Mass-premium": { score: 35, narrative: "Petcare and kids nutrition scaling here; some room" },
  "Baby, Kids & Pets::Mass":        { score: 72, narrative: "Affordable babycare and petfood for India 2 - dominated by offline; D2C gap" },
  "Baby, Kids & Pets::Value":       { score: 90, narrative: "Budget baby products - entirely unaddressed by institutional capital" },
  "Baby, Kids & Pets::Bharat/Tier-2+": { score: 80, narrative: "Regional petcare and kids nutrition - zero VC attention" },

  // Consumer Services
  "Consumer Services::Mass-premium": { score: 40, narrative: "EdTech, travel, fitness services at mid-market - some players, room for differentiation" },
  "Consumer Services::Premium":      { score: 30, narrative: "Premium experiences, boutique fitness - niche but funded" },
  "Consumer Services::Mass":         { score: 68, narrative: "Affordable tutoring, local services - dominated by offline aggregators" },
  "Consumer Services::Value":        { score: 88, narrative: "Vocational training, micro-services for India 3 - almost no VC" },
  "Consumer Services::Bharat/Tier-2+": { score: 82, narrative: "Tier-2/3 skilled services (beauty, repair, tutoring) - large market, thin capital" },

  // Consumer FinTech
  "Consumer FinTech::Mass":          { score: 55, narrative: "Buy-now-pay-later and micro-lending - Slice, KreditBee play here but concentration risk" },
  "Consumer FinTech::Mass-premium":  { score: 30, narrative: "Zepto Pay, CRED, Jupiter well-funded; crowded" },
  "Consumer FinTech::Premium":       { score: 35, narrative: "Wealth and investment apps - Zerodha, Groww dominant; newer entrants face CAC challenge" },
  "Consumer FinTech::Value":         { score: 80, narrative: "UPI-adjacent micro-savings and insurance for India 3 - clear regulatory and capital gap" },
  "Consumer FinTech::Bharat/Tier-2+": { score: 78, narrative: "Vernacular-language fintech for rural India - nascent, major opportunity" },

  // Consumer Internet
  "Consumer Internet::Mass-premium": { score: 25, narrative: "Gaming, OTT, social - well-funded globally; India plays (ShareChat, Moj) covered" },
  "Consumer Internet::Premium":      { score: 30, narrative: "Premium content and creator economy - active investment space" },
  "Consumer Internet::Mass":         { score: 55, narrative: "Vernacular content and casual gaming for India 2 - some plays, more room" },
  "Consumer Internet::Value":        { score: 80, narrative: "Ultra-low-data content for India 3 - technically complex, few VC-backed models" },
  "Consumer Internet::Bharat/Tier-2+": { score: 75, narrative: "Regional language apps and Bharat-first social - Sharechat area but still open" },
};

// Derive examples from real funding rounds data
function getExamples(sector: Sector, tier: IncomeTier): string[] {
  return FUNDING_ROUNDS.filter(
    (r) => r.sector === sector && r.incomeTier === tier
  )
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 3)
    .map((r) => r.company);
}

// Build the full grid by aggregating funding rounds + editorial gap scores
export function buildWhitespaceGrid(): WhitespaceCell[] {
  const cells: WhitespaceCell[] = [];

  for (const sector of SECTORS) {
    for (const tier of INCOME_TIERS) {
      const rounds = FUNDING_ROUNDS.filter(
        (r) => r.sector === sector && r.incomeTier === tier
      );
      const key = `${sector}::${tier}` as `${Sector}::${IncomeTier}`;
      const editorial = EDITORIAL_GAP[key];

      // If no editorial override, derive gap score from round count
      const derivedGap = rounds.length === 0 ? 75 : rounds.length <= 1 ? 50 : rounds.length <= 3 ? 25 : 10;

      cells.push({
        sector,
        incomeTier: tier,
        roundCount: rounds.length,
        totalUsdMn: rounds.reduce((s, r) => s + r.amount, 0),
        gapScore: editorial?.score ?? derivedGap,
        narrative: editorial?.narrative ?? (rounds.length === 0 ? "No recorded VC activity in this cell." : `${rounds.length} round(s) tracked.`),
        examples: getExamples(sector, tier),
      });
    }
  }

  return cells;
}

export const WHITESPACE_GRID = buildWhitespaceGrid();
