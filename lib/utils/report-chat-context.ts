import { INDUSTRY_REPORTS, REPORT_TAKEAWAY } from "@/lib/data/reports";
import { MACRO_CONSUMPTION } from "@/lib/data/market-context";

/**
 * Builds the system prompt for "chat with the reports".
 * The corpus is the parsed report registry (titles, scope, headline figures)
 * plus the report-sourced macro stats - i.e. exactly what the Research page
 * shows, so the model can only claim what the page can back.
 */
export function buildReportChatSystemPrompt(): string {
  const reportBlocks = INDUSTRY_REPORTS.map((r) => {
    const stats = r.keyStats.map((k) => `  - ${k.stat}: ${k.detail}`).join("\n");
    return `### ${r.title} (${r.author}, ${r.year})\nScope: ${r.scope}\nURL: ${r.url}\nKey figures:\n${stats}`;
  }).join("\n\n");

  const macroBlocks = MACRO_CONSUMPTION.map(
    (s) => `- ${s.label}: ${s.value} - ${s.note} [${s.asOf}]`,
  ).join("\n");

  return `You are the research assistant for "The Consumer VC Analyst Playbook", a site analysing India's consumer startup ecosystem. Answer questions using ONLY the report corpus below.

Rules:
- Cite the report (author, year) for every figure you use.
- If the corpus does not contain the answer, say so plainly and suggest which report likely covers it - do not invent numbers.
- Keep answers tight: lead with the answer, then the supporting figures. Plain hyphens only, no em dashes.
- You may synthesise across reports (e.g. compare Bain's funding data with Fireside's retail projections), but flag when figures use different bases or vintages.

## Synthesis (the through-line)
${REPORT_TAKEAWAY}

## Report corpus
${reportBlocks}

## Report-sourced macro stats
${macroBlocks}`;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

/** Direct browser call to the Anthropic API with the user's own key. */
export async function askReports(
  apiKey: string,
  history: ChatMessage[],
): Promise<string> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      // Required for CORS: tells the API this is an intentional client-side call.
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system: buildReportChatSystemPrompt(),
      messages: history,
    }),
  });

  if (!res.ok) {
    if (res.status === 401) throw new Error("Invalid API key - check it in the Anthropic Console.");
    if (res.status === 429) throw new Error("Rate limited - wait a moment and retry.");
    throw new Error(`API error ${res.status}. Try again.`);
  }

  const data = await res.json();
  const text = (data.content ?? [])
    .filter((b: { type: string }) => b.type === "text")
    .map((b: { text: string }) => b.text)
    .join("\n");
  return text || "(empty response)";
}
