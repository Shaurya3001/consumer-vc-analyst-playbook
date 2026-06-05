// One measured, decision-relevant takeaway per applet - leads with the judgment,
// not the data. Keep it to 1-2 sentences a partner could act on.
export default function TheRead({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-7xl mx-auto px-6 pt-4">
      <div className="border-l-2 border-indigo-500 bg-indigo-950/20 px-4 py-2.5 rounded-r-lg">
        <p className="text-[10px] uppercase tracking-wider text-indigo-400 font-medium mb-0.5">
          The read
        </p>
        <p className="text-sm text-zinc-200 leading-snug max-w-4xl">{children}</p>
      </div>
    </div>
  );
}
