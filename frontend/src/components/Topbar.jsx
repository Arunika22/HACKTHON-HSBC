import { Bell, Search, UserCircle2, ChevronDown, Sparkles } from 'lucide-react';

export function Topbar() {
  return (
    <header className="mb-8 flex flex-col gap-6 rounded-[32px] border border-slate-200 bg-white/95 p-6 shadow-soft backdrop-blur-xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.32em] text-slate-500">Executive Intelligence</p>
          <h2 className="mt-2 text-3xl font-semibold text-slate-900">Enterprise Risk Command Center</h2>
        </div>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-100">
            <Sparkles size={16} /> AI Insights
          </button>
          <button className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 transition hover:bg-slate-200">
            <Bell size={20} />
          </button>
          <button className="inline-flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 transition hover:border-slate-300">
            <UserCircle2 size={20} />
            <span>Olivia Chen</span>
            <ChevronDown size={16} />
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
        <div className="rounded-3xl border border-slate-200 bg-slate-950 px-4 py-3 text-white shadow-soft">
          <p className="text-sm text-slate-300">Live portfolio health</p>
          <p className="mt-2 text-3xl font-semibold">62.4</p>
        </div>
        <div className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-white px-4 py-3 shadow-soft">
          <Search size={18} className="text-slate-500" />
          <input className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400" placeholder="Search company, sector, risk" />
        </div>
      </div>
    </header>
  );
}
