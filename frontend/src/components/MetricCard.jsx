export function MetricCard({ title, value, delta, meta, tone }) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-xl">
      <p className="text-sm uppercase tracking-[0.32em] text-slate-500">{title}</p>
      <div className="mt-4 flex items-end justify-between gap-4">
        <div>
          <p className="text-4xl font-semibold text-slate-900">{value}</p>
          <p className="mt-2 text-sm text-slate-500">{meta}</p>
        </div>
        <span className={`rounded-2xl px-3 py-2 text-sm font-semibold ${tone} bg-slate-100`}>{delta}</span>
      </div>
    </div>
  );
}
