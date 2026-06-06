import LastUpdated from "./LastUpdated";

export default function SiteFooter() {
  return (
    <footer className="border-t border-zinc-800 bg-zinc-950 py-6">
      {/* Live freshness strip */}
      <div className="max-w-7xl mx-auto px-6 pb-4 mb-4 border-b border-zinc-900">
        <LastUpdated />
      </div>

      <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {/* Left - project + one-liner */}
        <div>
          <p className="text-sm font-semibold text-zinc-200">The Consumer VC Analyst Playbook</p>
          <p className="text-xs text-zinc-500 mt-0.5 max-w-md">
            Live tools and field notes on India&apos;s consumer startup landscape - funding, momentum,
            white space, syndicates, exits, and unit economics, all in one analyst&apos;s view.
          </p>
        </div>

        {/* Right - byline + links */}
        <div className="text-xs text-zinc-500 sm:text-right">
          <p>
            Built by <span className="text-zinc-300 font-medium">Shaurya Gulati</span>
          </p>
          <div className="flex sm:justify-end items-center gap-3 mt-1">
            <a
              href="https://www.linkedin.com/in/shaurya-gulati/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2"
              aria-label="Shaurya Gulati on LinkedIn"
            >
              LinkedIn
            </a>
            <span className="text-zinc-700">·</span>
            <a
              href="https://github.com/Shaurya3001"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2"
              aria-label="Shaurya Gulati on GitHub"
            >
              GitHub
            </a>
            <span className="text-zinc-700">·</span>
            <a
              href="mailto:shauryagulati3001@gmail.com"
              className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2"
              aria-label="Email Shaurya Gulati"
            >
              shauryagulati3001@gmail.com
            </a>
          </div>
        </div>
      </div>

      <p className="max-w-7xl mx-auto px-6 text-[10px] text-zinc-700 mt-4">
        Data compiled from public sources (Inc42, Entrackr, YourStory, Business Standard, Tracxn) and
        labelled where modeled. Built as a portfolio artifact - not investment advice.
      </p>
    </footer>
  );
}
