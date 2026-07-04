import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { MetricCard } from './components/MetricCard';
import { CompanyRow } from './components/CompanyRow';
import { HeatmapPanel } from './components/HeatmapPanel';
import { TrendChart } from './components/TrendChart';
import { kpis, portfolioSummary, companyList, alertFeed, aiInsights, newsTicker, riskTrends } from './data/dashboardData';
import { ArrowRight, Clock3, MessageCircle, Sparkles } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-[1600px] gap-6 px-6 py-8 xl:px-10">
        <Sidebar />
        <main className="flex-1 space-y-6">
          <Topbar />

          <section className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {kpis.map((kpi) => (
                <MetricCard key={kpi.id} {...kpi} />
              ))}
            </div>

            <div className="space-y-6">
              <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-soft">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.32em] text-slate-500">AI Daily Brief</p>
                    <h3 className="mt-2 text-xl font-semibold text-slate-900">Executive risk summary</h3>
                  </div>
                  <button className="inline-flex items-center gap-2 rounded-2xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200">
                    <MessageCircle size={18} /> Ask Copilot
                  </button>
                </div>
                <div className="mt-6 space-y-4">
                  {aiInsights.map((item) => (
                    <div key={item.question} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                      <p className="text-sm font-semibold text-slate-700">{item.question}</p>
                      <p className="mt-2 text-sm leading-7 text-slate-600">{item.answer}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-soft">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.32em] text-slate-500">Alert Center</p>
                    <h3 className="mt-2 text-xl font-semibold text-slate-900">Priority incidents</h3>
                  </div>
                  <span className="rounded-2xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700">Real-time</span>
                </div>
                <div className="mt-6 space-y-4">
                  {alertFeed.map((alert) => (
                    <div key={alert.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5 transition hover:border-slate-300">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold text-slate-900">{alert.title}</p>
                          <p className="mt-2 text-sm text-slate-600">{alert.description}</p>
                        </div>
                        <span className={`rounded-2xl px-3 py-2 text-xs font-semibold ${
                          alert.severity === 'critical' ? 'bg-rose-100 text-rose-700' : alert.severity === 'high' ? 'bg-orange-100 text-orange-700' : 'bg-amber-100 text-amber-700'
                        }`}>{alert.badge}</span>
                      </div>
                      <p className="mt-4 flex items-center gap-2 text-sm text-slate-500"><Clock3 size={14} />{alert.timestamp}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-6">
              <HeatmapPanel />
              <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-soft">
                <div className="mb-5 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.32em] text-slate-500">Portfolio health</p>
                    <h3 className="mt-2 text-xl font-semibold text-slate-900">Operational risk drivers</h3>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {portfolioSummary.map((item) => (
                    <div key={item.label} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                      <p className="text-sm text-slate-500">{item.label}</p>
                      <p className="mt-3 text-3xl font-semibold text-slate-900">{item.value}</p>
                      <p className="mt-2 text-sm text-slate-600">{item.change} vs last week</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <TrendChart data={riskTrends} />
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
            <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-soft">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.32em] text-slate-500">Company table</p>
                  <h3 className="mt-2 text-xl font-semibold text-slate-900">Monitored counterparties</h3>
                </div>
                <button className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
                  <ArrowRight size={16} /> View all
                </button>
              </div>
              <div className="overflow-hidden rounded-[28px] border border-slate-200">
                <table className="min-w-full border-collapse text-left text-sm">
                  <thead className="bg-slate-950 text-white">
                    <tr>
                      <th className="px-4 py-4">Company</th>
                      <th className="px-4 py-4">Industry</th>
                      <th className="px-4 py-4">Region</th>
                      <th className="px-4 py-4">Score</th>
                      <th className="px-4 py-4">Risk</th>
                      <th className="px-4 py-4">Trend</th>
                      <th className="px-4 py-4">Updated</th>
                    </tr>
                  </thead>
                  <tbody>
                    {companyList.map((company) => (
                      <CompanyRow key={company.id} company={company} />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-soft">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.32em] text-slate-500">Live feed</p>
                  <h3 className="mt-2 text-xl font-semibold text-slate-900">Market sentiment ticker</h3>
                </div>
                <span className="rounded-2xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700">AI curated</span>
              </div>
              <div className="space-y-4">
                {newsTicker.map((item) => (
                  <div key={item} className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 transition hover:border-slate-300">
                    <div className="flex items-center justify-between gap-3">
                      <p className="max-w-xs text-sm text-slate-700">{item}</p>
                      <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold text-white">Live</span>
                    </div>
                    <div className="mt-3 flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-slate-500">
                      <Sparkles size={14} /> AI summary
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;
