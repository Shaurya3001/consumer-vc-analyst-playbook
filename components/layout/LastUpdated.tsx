"use client";
import { useState, useEffect } from "react";
import meta from "@/lib/data/site-meta.json";

// India Standard Time is UTC+5:30. The site refreshes daily at 09:00 IST = 03:30 UTC.
const IST_OFFSET_MIN = 5 * 60 + 30;
const REFRESH_HOUR_IST = 9;

/** Next 09:00 IST as a UTC Date. */
function nextRefreshUtc(now: Date): Date {
  // Shift "now" into IST wall-clock
  const istNow = new Date(now.getTime() + IST_OFFSET_MIN * 60_000);
  const target = new Date(istNow);
  target.setUTCHours(REFRESH_HOUR_IST, 0, 0, 0); // 09:00 on the IST calendar day
  if (target.getTime() <= istNow.getTime()) {
    target.setUTCDate(target.getUTCDate() + 1);
  }
  // Shift target back to real UTC
  return new Date(target.getTime() - IST_OFFSET_MIN * 60_000);
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  });
}

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

export default function LastUpdated() {
  const [mounted, setMounted] = useState(false);
  const [remaining, setRemaining] = useState("");

  useEffect(() => {
    setMounted(true);
    const tick = () => {
      const now = new Date();
      const diffMs = nextRefreshUtc(now).getTime() - now.getTime();
      const s = Math.max(0, Math.floor(diffMs / 1000));
      const h = Math.floor(s / 3600);
      const m = Math.floor((s % 3600) / 60);
      const sec = s % 60;
      setRemaining(`${pad(h)}:${pad(m)}:${pad(sec)}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
      <span className="flex items-center gap-1.5">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
        <span className="text-zinc-500">Data updated</span>
        <span className="text-zinc-300 font-medium">{fmtDate(meta.lastUpdatedISO)}</span>
      </span>
      <span className="text-zinc-700" aria-hidden="true">·</span>
      <span className="text-zinc-500">
        Next refresh (09:00 IST) in{" "}
        <span className="text-indigo-300 font-mono tabular-nums" aria-live="off">
          {mounted ? remaining : "--:--:--"}
        </span>
      </span>
    </div>
  );
}
