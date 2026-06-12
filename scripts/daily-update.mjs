#!/usr/bin/env node
/**
 * daily-update.mjs - the "actively source new India consumer deals and funds" job.
 *
 * Runs from GitHub Actions every day at 09:00 IST (03:30 UTC). It:
 *   1. Asks Claude (with web search) for India consumer/D2C funding rounds
 *      announced in the last 21 days - wide enough to catch deals a single
 *      daily check missed - in strict JSON with a real source URL each.
 *   2. Asks Claude (second call) for newly launched India consumer-focused
 *      FUNDS (new vehicles, first/final closes, debut micro-VCs) from the
 *      last 30 days, same sourcing rules.
 *   3. Validates + dedupes. Rounds dedupe by company+month and a 3-month
 *      proximity window against every round already in funding-rounds.ts -
 *      NOT by company existence, so a follow-on round by a company already
 *      on the site is correctly treated as new. Funds dedupe by name against
 *      investors.ts and auto-investors.json.
 *   4. Appends to lib/data/auto-rounds.json / lib/data/auto-investors.json
 *      (tagged autoDetected) so the site surfaces them, clearly labelled.
 *   5. Always bumps site-meta.json.lastCheckedISO; bumps lastUpdatedISO only
 *      when new data was actually added.
 *
 * It is deliberately conservative: anything without a verifiable source URL,
 * or already covered, is dropped. If the API key is missing or a call fails,
 * it still records that the daily check ran (lastCheckedISO) and adds nothing.
 *
 * Run: ANTHROPIC_API_KEY=sk-... node scripts/daily-update.mjs
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DATA = join(ROOT, "lib", "data");

const API_KEY = process.env.ANTHROPIC_API_KEY;
const MODEL = process.env.CLAUDE_MODEL || "claude-sonnet-4-6";
const WEB_SEARCH_TOOL = { type: "web_search_20260209", name: "web_search", max_uses: 8 };

const readJson = (f) => JSON.parse(readFileSync(join(DATA, f), "utf8"));
const writeJson = (f, v) => writeFileSync(join(DATA, f), JSON.stringify(v, null, 2) + "\n");

const nowISO = () => new Date().toISOString();

const SECTORS = [
  "F&B Packaged", "F&B Foodservice", "Beauty & Personal Care", "Fashion & Accessories",
  "Health & Wellness", "Home & Living", "Consumer Electronics", "Baby, Kids & Pets",
  "Consumer Services", "Consumer FinTech", "Consumer Internet",
];

const INVESTOR_TYPES = [
  "seed-fund", "micro-vc", "angel-network", "accelerator", "multi-stage",
  "growth-equity", "strategic", "family-office", "cvc", "sovereign",
];

function extractJsonArray(text) {
  // Tolerate code fences / prose around the JSON array.
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced ? fenced[1] : text;
  const start = candidate.indexOf("[");
  const end = candidate.lastIndexOf("]");
  if (start === -1 || end === -1 || end < start) return [];
  try {
    return JSON.parse(candidate.slice(start, end + 1));
  } catch {
    return [];
  }
}

async function askClaude(prompt) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 3000,
      tools: [WEB_SEARCH_TOOL],
      messages: [{ role: "user", content: prompt }],
    }),
  });
  if (!res.ok) throw new Error(`Anthropic API ${res.status}: ${await res.text()}`);
  const data = await res.json();
  const text = (data.content || [])
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("\n");
  return extractJsonArray(text);
}

// ── Known-data extraction (dedupe foundation) ────────────────────────────────

const norm = (s) => String(s || "").trim().toLowerCase();

/** company -> [YYYY-MM, ...] parsed from the static funding-rounds.ts source. */
function knownRoundsFromStatic() {
  const src = readFileSync(join(DATA, "funding-rounds.ts"), "utf8");
  const map = new Map();
  // Each round literal lists company before date; lazy match stays in-record.
  const re = /company:\s*"([^"]+)"[\s\S]*?date:\s*"(\d{4}-\d{2})"/g;
  let m;
  while ((m = re.exec(src)) !== null) {
    const k = norm(m[1]);
    if (!map.has(k)) map.set(k, []);
    map.get(k).push(m[2]);
  }
  return map;
}

/** Investor names parsed from the static investors.ts source. */
function knownInvestorNames() {
  const src = readFileSync(join(DATA, "investors.ts"), "utf8");
  const names = new Set();
  const re = /name:\s*"([^"]+)"/g;
  let m;
  while ((m = re.exec(src)) !== null) names.add(norm(m[1]));
  return names;
}

const monthsBetween = (a, b) => {
  // a, b: "YYYY-MM"
  const [ay, am] = a.split("-").map(Number);
  const [by, bm] = b.split("-").map(Number);
  return Math.abs(ay * 12 + am - (by * 12 + bm));
};

// ── Rounds ───────────────────────────────────────────────────────────────────

function isValidRound(r, knownRounds, existingKeys) {
  if (!r || typeof r !== "object") return false;
  if (!r.company || typeof r.company !== "string") return false;
  if (!r.sourceUrl || !/^https?:\/\/.+\..+/.test(r.sourceUrl)) return false; // must be sourced
  if (!/^\d{4}-\d{2}$/.test(r.date || "")) return false;
  const company = norm(r.company);
  const key = `${company}|${r.date}`;
  if (existingKeys.has(key)) return false; // already auto-added or statically covered
  // Proximity guard: the same round is often reported across a month boundary
  // or with a slightly different date - treat any known round within 3 months
  // as the same event. A genuinely new follow-on round (different month, >3mo
  // out) passes, which is the whole point of this dedupe design.
  const dates = knownRounds.get(company) || [];
  if (dates.some((d) => monthsBetween(d, r.date) <= 3)) return false;
  if (r.sector && !SECTORS.includes(r.sector)) r.sector = "Consumer Internet"; // soft-coerce
  return true;
}

const ROUNDS_PROMPT = `You are a precise data extraction agent for an Indian consumer-VC intelligence site.

Find direct-to-consumer / consumer brand funding rounds in INDIA that were ANNOUNCED IN THE LAST 21 DAYS. Use web search against Inc42, Entrackr, YourStory, Business Standard, Economic Times, VCCircle. Include follow-on rounds by companies that have raised before - those matter most.

Return ONLY a JSON array (no prose). Each object:
{
  "company": "string",
  "sector": "one of: ${SECTORS.join(" | ")}",
  "stage": "Seed | Series A | Series B | Series C+",
  "amountUsdMn": number,
  "date": "YYYY-MM",
  "city": "string",
  "leadInvestor": "string",
  "sourceUrl": "https://... (REQUIRED, a real article)"
}

Rules: only include rounds you can back with a real source URL. If you are not confident a round is real and recent, OMIT it. If there are none, return []. Do not invent companies, amounts, or sources.`;

// ── Funds ────────────────────────────────────────────────────────────────────

function isValidFund(f, knownNames, existingNames) {
  if (!f || typeof f !== "object") return false;
  if (!f.name || typeof f.name !== "string") return false;
  if (!f.sourceUrl || !/^https?:\/\/.+\..+/.test(f.sourceUrl)) return false;
  const name = norm(f.name);
  if (knownNames.has(name) || existingNames.has(name)) return false;
  if (!INVESTOR_TYPES.includes(f.type)) f.type = "micro-vc"; // soft-coerce
  return true;
}

const FUNDS_PROMPT = `You are a precise data extraction agent for an Indian consumer-VC intelligence site.

Find NEWLY ANNOUNCED India-focused funds that invest in CONSUMER startups (consumer brands, D2C, food, beauty, fashion, consumer internet) from the LAST 30 DAYS: new fund launches, first or final closes of new vehicles, debut micro-VCs or angel funds with a consumer thesis. Use web search against Inc42, Entrackr, YourStory, Economic Times, VCCircle, Moneycontrol.

Return ONLY a JSON array (no prose). Each object:
{
  "name": "string (the firm name, not the vehicle, e.g. 'Fireside Ventures' not 'Fireside Fund IV')",
  "type": "one of: ${INVESTOR_TYPES.join(" | ")}",
  "corpusUsdMn": number or null,
  "stageFocus": "e.g. 'Seed to Series A'",
  "thesis": "one short sentence on their consumer focus",
  "sourceUrl": "https://... (REQUIRED, a real article)"
}

Rules: ONLY funds with an explicit India consumer investing mandate. Only include funds you can back with a real source URL. A new vehicle by a firm is only news if the FIRM is new to the list - established firms raising follow-on funds should be OMITTED. If there are none, return []. Do not invent firms, corpus sizes, or sources.`;

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const meta = readJson("site-meta.json");
  const auto = readJson("auto-rounds.json");
  const autoInvestors = existsSync(join(DATA, "auto-investors.json"))
    ? readJson("auto-investors.json")
    : [];

  const knownRounds = knownRoundsFromStatic();
  const existingKeys = new Set(auto.map((r) => `${norm(r.company)}|${r.date || ""}`));
  const knownNames = knownInvestorNames();
  const existingNames = new Set(autoInvestors.map((i) => norm(i.name)));

  let addedRounds = 0;
  let addedFunds = 0;

  if (!API_KEY) {
    console.warn("ANTHROPIC_API_KEY not set - skipping fetch, recording check only.");
  } else {
    // 1. Deals (last 21 days, follow-ons included)
    try {
      const candidates = await askClaude(ROUNDS_PROMPT);
      console.log(`Claude returned ${candidates.length} candidate round(s).`);
      for (const c of candidates) {
        if (!isValidRound(c, knownRounds, existingKeys)) continue;
        auto.push({
          company: String(c.company).trim(),
          sector: c.sector,
          stage: c.stage,
          amount: Number(c.amountUsdMn) || null,
          date: c.date,
          city: c.city || "",
          leadInvestor: c.leadInvestor || "",
          sources: [c.sourceUrl],
          autoDetected: true,
          addedISO: nowISO(),
        });
        existingKeys.add(`${norm(c.company)}|${c.date}`);
        addedRounds += 1;
      }
      if (addedRounds > 0) writeJson("auto-rounds.json", auto);
    } catch (err) {
      console.error("Rounds fetch failed (non-fatal):", err.message);
    }

    // 2. New consumer funds (last 30 days)
    try {
      const candidates = await askClaude(FUNDS_PROMPT);
      console.log(`Claude returned ${candidates.length} candidate fund(s).`);
      for (const c of candidates) {
        if (!isValidFund(c, knownNames, existingNames)) continue;
        autoInvestors.push({
          name: String(c.name).trim(),
          type: c.type,
          corpusUsdMn: Number(c.corpusUsdMn) || null,
          stageFocus: c.stageFocus || "",
          thesis: c.thesis || "",
          sources: [c.sourceUrl],
          autoDetected: true,
          addedISO: nowISO(),
        });
        existingNames.add(norm(c.name));
        addedFunds += 1;
      }
      if (addedFunds > 0) writeJson("auto-investors.json", autoInvestors);
    } catch (err) {
      console.error("Funds fetch failed (non-fatal):", err.message);
    }
  }

  // Always record that the daily check ran; only bump "updated" if data changed.
  meta.lastCheckedISO = nowISO();
  if (addedRounds + addedFunds > 0) meta.lastUpdatedISO = nowISO();
  writeJson("site-meta.json", meta);

  console.log(`Done. Added ${addedRounds} round(s), ${addedFunds} fund(s). lastChecked=${meta.lastCheckedISO}`);
}

main().catch((e) => {
  console.error("Fatal:", e);
  process.exit(0); // never fail the Action; the check still "ran"
});
