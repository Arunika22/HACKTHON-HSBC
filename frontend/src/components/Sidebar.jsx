import { LayoutDashboard, ShieldAlert, BarChart2, Bell, Sparkles, Search, BookOpen, Users } from 'lucide-react';

const navItems = [
  { label: 'Overview', icon: LayoutDashboard, active: true },
  { label: 'Portfolio', icon: BarChart2 },
  { label: 'News', icon: BookOpen },
  { label: 'Alerts', icon: ShieldAlert },
  { label: 'Copilot', icon: Sparkles },
];

export function Sidebar() {
  return (
    <aside className="hidden xl:flex xl:w-72 xl:flex-col xl:rounded-3xl xl:border xl:border-slate-200 xl:bg-white xl:p-6 xl:shadow-soft">
      <div className="mb-10 flex items-center gap-3 text-slate-900">
        <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-slate-900 text-white shadow-soft">
          <Users size={24} />
        </div>
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Portfolio AI</p>
          <h1 className="text-xl font-semibold">Sentinel Risk</h1>
        </div>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              className={`group flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${
                item.active ? 'bg-slate-900 text-white shadow-soft' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon size={18} className="text-inherit" />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto rounded-3xl bg-slate-950 px-5 py-6 text-white shadow-soft">
        <p className="text-sm uppercase tracking-[0.28em] text-slate-400">AI Copilot</p>
        <h2 className="mt-3 text-lg font-semibold">Credit Monitor</h2>
        <p className="mt-2 text-sm text-slate-300">Ask the AI for risk summaries, review recommendations, or watchlist guidance.</p>
        <button className="mt-5 inline-flex items-center justify-center rounded-2xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200">
          Launch assistant
        </button>
      </div>
    </aside>
  );
}
