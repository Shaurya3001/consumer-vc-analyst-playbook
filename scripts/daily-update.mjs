#!/usr/bin/env node
/**
 * daily-update.mjs - the "check for new India consumer funding daily" job.
 *
 * Runs from GitHub Actions every day at 09:00 IST (03:30 UTC). It:
 *   1. Asks Claude (with web search) for India consumer/D2C funding rounds
 *      announced in the last 7 days, in strict JSON with a real source URL each.
 *   2. Validates + dedupes against covered-companies.json and existing auto-rounds.json.
 *   3. Appends genuinely-new, sourced rounds to lib/data/auto-rounds.json (tagged
 *      autoDetected) so the site can surface them, clearly labelled.
 *   4. Always bumps site-meta.json.lastCheckedISO; bumps lastUpdatedISO only when
 *      new rounds were actually added.
 *
 * It is deliberately conservative: anything without a verifiable source URL, or
 * already covered, is dropped. If the API key is missing or the call fails, it
 * still records that the daily check ran (lastCheckedISO) and adds nothing.
 *
 * Run: ANTHROPIC_API_KEY=sk-... node scripts/daily-update.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DATA = join(ROOT, "lib", "data");

const API_KEY = process.env.ANTHROPIC_API_KEY;
const MODEL = process.env.CLAUDE_MODEL || "claude-sonnet-4-6";
const WEB_SEARCH_TOOL = { type: "web_search_20260209", name: "web_search", max_uses: 6 };

const readJson = (f) => JSON.parse(readFileSync(join(DATA, f), "utf8"));
const writeJson = (f, v) => writeFileSync(join(DATA, f), JSON.stringify(v, null, 2) + "\n");

const nowISO = () => new Date().toISOString();

const SECTORS = [
  "F&B Packaged", "F&B Foodservice", "Beauty & Personal Care", "Fashion & Accessories",
  "Health & Wellness", "Home & Living", "Consumer Electronics", "Baby, Kids & Pets",
  "Consumer Services", "Consumer FinTech", "Consumer Internet",
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

function isValidRound(r, covered, existingKeys) {
  if (!r || typeof r !== "object") return false;
  if (!r.company || typeof r.company !== "string") return false;
  if (!r.sourceUrl || !/^https?:\/\/.+\..+/.test(r.sourceUrl)) return false; // must be sourced
  if (covered.has(r.company.trim().toLowerCase())) return false;            // already on the site
  const key = `${r.company.trim().toLowerCase()}|${r.date || ""}`;
  if (existingKeys.has(key)) return false;                                  // already auto-added
  if (r.sector && !SECTORS.includes(r.sector)) r.sector = "Consumer Internet"; // soft-coerce
  return true;
}

async function askClaude() {
  const prompt = `You are a precise data extraction agent for an Indian consumer-VC intelligence site.

Find direct-to-consumer / consumer brand funding rounds in INDIA that were ANNOUNCED IN THE LAST 7 DAYS. Use web search against Inc42, Entrackr, YourStory, Business Standard, Economic Times.

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

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 2000,
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

async function main() {
  const meta = readJson("site-meta.json");
  const covered = new Set(readJson("covered-companies.json").map((n) => n.toLowerCase()));
  const auto = readJson("auto-rounds.json");
  const existingKeys = new Set(auto.map((r) => `${(r.company || "").toLowerCase()}|${r.date || ""}`));

  let added = 0;
  try {
    if (!API_KEY) {
      console.warn("ANTHROPIC_API_KEY not set - skipping fetch, recording check only.");
    } else {
      const candidates = await askClaude();
      console.log(`Claude returned ${candidates.length} candidate round(s).`);
      for (const c of candidates) {
        if (!isValidRound(c, covered, existingKeys)) continue;
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
        existingKeys.add(`${String(c.company).trim().toLowerCase()}|${c.date || ""}`);
        added += 1;
      }
      if (added > 0) writeJson("auto-rounds.json", auto);
    }
  } catch (err) {
    console.error("Update fetch failed (non-fatal):", err.message);
  }

  // Always record that the daily check ran; only bump "updated" if data changed.
  meta.lastCheckedISO = nowISO();
  if (added > 0) meta.lastUpdatedISO = nowISO();
  writeJson("site-meta.json", meta);

  console.log(`Done. Added ${added} new round(s). lastChecked=${meta.lastCheckedISO}`);
}

main().catch((e) => {
  console.error("Fatal:", e);
  process.exit(0); // never fail the Action; the check still "ran"
});
