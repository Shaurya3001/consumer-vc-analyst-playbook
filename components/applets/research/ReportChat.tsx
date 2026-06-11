"use client";
import { useState, useEffect, useRef } from "react";
import { askReports, type ChatMessage } from "@/lib/utils/report-chat-context";

const KEY_STORAGE = "playbook-anthropic-key";

const STARTERS = [
  "How big is quick commerce getting, and who says what?",
  "Compare Bain's VC funding view with Fireside's retail projection",
  "What do the reports say about Bharat / tier-2 consumers?",
];

export default function ReportChat() {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [keyInput, setKeyInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setApiKey(localStorage.getItem(KEY_STORAGE));
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const saveKey = () => {
    const k = keyInput.trim();
    if (!k.startsWith("sk-ant-")) {
      setError("That doesn't look like an Anthropic key (should start with sk-ant-).");
      return;
    }
    localStorage.setItem(KEY_STORAGE, k);
    setApiKey(k);
    setKeyInput("");
    setError(null);
  };

  const clearKey = () => {
    localStorage.removeItem(KEY_STORAGE);
    setApiKey(null);
    setMessages([]);
  };

  const send = async (text: string) => {
    const q = text.trim();
    if (!q || !apiKey || loading) return;
    setError(null);
    const next: ChatMessage[] = [...messages, { role: "user", content: q }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const answer = await askReports(apiKey, next);
      setMessages([...next, { role: "assistant", content: answer }]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Request failed.");
      setMessages(messages); // roll back the optimistic user message
      setInput(q);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border border-indigo-900 bg-indigo-950/20 rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-indigo-900/60 flex items-center justify-between gap-3 flex-wrap">
        <div>
          <p className="text-sm font-semibold text-indigo-200">Chat with the reports</p>
          <p className="text-xs text-zinc-500">
            Ask across all the reports above - answers cite the source report. Uses your own Claude API key.
          </p>
        </div>
        {apiKey && (
          <button onClick={clearKey} className="text-xs text-zinc-500 hover:text-zinc-300 underline underline-offset-2">
            remove key
          </button>
        )}
      </div>

      {!apiKey ? (
        <div className="p-4 space-y-3">
          <p className="text-xs text-zinc-400 leading-relaxed max-w-2xl">
            Paste an Anthropic API key to enable chat. The key is stored only in your browser
            (localStorage) and sent only to api.anthropic.com - never to this site&apos;s servers
            (it has none). Get a key at{" "}
            <a href="https://console.anthropic.com" target="_blank" rel="noopener noreferrer" className="text-indigo-400 underline underline-offset-2">
              console.anthropic.com
            </a>. You pay Anthropic directly for usage (a question costs well under $0.05).
          </p>
          <div className="flex gap-2 max-w-xl">
            <input
              type="password"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && saveKey()}
              placeholder="sk-ant-..."
              aria-label="Anthropic API key"
              className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-indigo-500"
            />
            <button
              onClick={saveKey}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium"
            >
              Save
            </button>
          </div>
          {error && <p className="text-xs text-rose-400">{error}</p>}
        </div>
      ) : (
        <div className="flex flex-col">
          <div ref={scrollRef} className="max-h-96 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 && (
              <div className="space-y-2">
                <p className="text-xs text-zinc-500">Try one of these:</p>
                <div className="flex flex-wrap gap-2">
                  {STARTERS.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="text-xs px-3 py-1.5 rounded-full border border-zinc-700 bg-zinc-900 text-zinc-300 hover:border-indigo-500 text-left"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
                <div
                  className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-sm whitespace-pre-wrap leading-relaxed ${
                    m.role === "user" ? "bg-indigo-600 text-white" : "bg-zinc-900 border border-zinc-800 text-zinc-200"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && <p className="text-xs text-zinc-500 animate-pulse">Reading the reports...</p>}
            {error && <p className="text-xs text-rose-400">{error}</p>}
          </div>
          <div className="border-t border-indigo-900/60 p-3 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send(input)}
              placeholder="Ask the reports anything..."
              aria-label="Ask the reports"
              className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-indigo-500"
            />
            <button
              onClick={() => send(input)}
              disabled={loading || !input.trim()}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-sm font-medium"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
