import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export function TrendChart({ data }) {
  return (
    <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-soft">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-[0.32em] text-slate-500">Risk Trend</p>
          <h3 className="mt-2 text-xl font-semibold text-slate-900">Weekly portfolio momentum</h3>
        </div>
        <span className="rounded-2xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700">Risk index</span>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 8, left: -12, bottom: 0 }}>
            <CartesianGrid stroke="#E2E8F0" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="period" tickLine={false} axisLine={false} tick={{ fill: '#64748b' }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fill: '#64748b' }} />
            <Tooltip wrapperStyle={{ borderRadius: 20, boxShadow: '0 20px 40px rgba(15, 23, 42, 0.12)' }} />
            <Line type="monotone" dataKey="risk" stroke="#0EA5E9" strokeWidth={4} dot={{ r: 4, fill: '#0EA5E9' }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
