import Link from "next/link";

const APPLETS = [
  {
    slug: "funding-explorer",
    title: "Funding Rounds Explorer",
    description: "50 real rounds (2019-2026) - filter by sector, GTM model, income tier, stage, city, investor. Every row links to source.",
    icon: "💰",
  },
  {
    slug: "momentum-dashboard",
    title: "Momentum Dashboard",
    description: "30 real emerging brands ranked by a transparent, re-weightable Momentum Score. Click any brand to see signal decomposition.",
    icon: "🚀",
  },
  {
    slug: "whitespace-map",
    title: "Category White-space Map",
    description: "Sector × income-tier heatmap showing funding density vs. market gaps.",
    icon: "🗺️",
    status: "soon",
  },
  {
    slug: "investor-map",
    title: "Investor Activity Map",
    description: "Who's writing consumer checks, at what stage, and with whom.",
    icon: "🤝",
    status: "soon",
  },
  {
    slug: "graduation-funnel",
    title: "Graduation Funnel",
    description: "Of brands that raised Seed in year N, what % reached Series A/B? By sector.",
    icon: "📊",
    status: "soon",
  },
  {
    slug: "unit-economics",
    title: "Unit Economics Sandbox",
    description: "Sliders for AOV, repeat rate, CAC, and margin → live LTV/CAC and payback. Pre-loaded with India category benchmarks.",
    icon: "🧮",
  },
  {
    slug: "exits-tracker",
    title: "Exits & Acquisitions Tracker",
    description: "HUL, ITC, Marico, Emami - who bought what, for how much. M&A is the primary VC exit route in India consumer.",
    icon: "🤝",
  },
  {
    slug: "research",
    title: "Research & Reports",
    description: "The canonical India consumer reports - Bain, Redseer, Fireside, McKinsey, BCG, PwC - with headline figures and source links.",
    icon: "📚",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 py-8">
      <div className="max-w-7xl mx-auto px-6">
        <header className="mb-12">
          <h1 className="text-3xl font-bold mb-2">The Consumer VC Analyst Playbook</h1>
          <p className="text-zinc-400 text-lg">
            Interactive tools for analysing India&apos;s consumer startup ecosystem - built the way an
            early-stage VC analyst actually works a market.
          </p>
          <p className="text-zinc-600 text-sm mt-2">
            All data compiled from public sources and labelled where modeled. Signals measure attention and
            distribution - not unit economics.
          </p>
          <p className="text-zinc-500 text-sm mt-3">
            By <span className="text-zinc-300 font-medium">Shaurya Gulati</span> ·{" "}
            <a href="https://www.linkedin.com/in/shaurya-gulati/" target="_blank" rel="noopener noreferrer"
              className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2">LinkedIn</a> ·{" "}
            <a href="mailto:shauryagulati3001@gmail.com"
              className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2">shauryagulati3001@gmail.com</a>
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {APPLETS.map((a) => (
            <Link
              key={a.slug}
              href={`/applets/${a.slug}`}
              className="block p-6 rounded-xl border border-zinc-800 bg-zinc-900 hover:border-zinc-600 transition-colors"
            >
              <div className="text-2xl mb-3">{a.icon}</div>
              <h2 className="font-semibold text-lg mb-1">{a.title}</h2>
              <p className="text-zinc-400 text-sm">{a.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
