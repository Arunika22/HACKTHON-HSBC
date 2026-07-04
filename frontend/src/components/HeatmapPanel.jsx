export function HeatmapPanel() {
  const cells = [
    { label: 'Northstar', value: 'Critical', color: 'bg-rose-500' },
    { label: 'Blue Harbor', value: 'High', color: 'bg-orange-500' },
    { label: 'Aureum', value: 'Medium', color: 'bg-amber-400' },
    { label: 'Arbor', value: 'Low', color: 'bg-emerald-500' },
  ];
  return (
    <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-soft">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.32em] text-slate-500">Portfolio Risk Heatmap</p>
          <h3 className="mt-2 text-xl font-semibold text-slate-900">Top clusters by risk intensity</h3>
        </div>
        <div className="rounded-2xl bg-slate-950 px-4 py-2 text-sm text-white">Live updates</div>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {cells.map((cell) => (
          <div key={cell.label} className="rounded-3xl border border-slate-100 bg-slate-50 p-5 transition hover:-translate-y-1 hover:shadow-md">
            <div className="mb-4 flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-slate-500">{cell.label}</p>
              <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold text-white ${cell.color}`}>{cell.value}</span>
            </div>
            <div className="h-24 rounded-3xl bg-slate-900/5" />
          </div>
        ))}
      </div>
    </div>
  );
}
