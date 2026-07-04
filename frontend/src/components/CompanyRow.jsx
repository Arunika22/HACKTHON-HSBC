import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const levelClasses = {
  low: 'bg-emerald-100 text-emerald-700',
  medium: 'bg-amber-100 text-amber-700',
  high: 'bg-orange-100 text-orange-700',
  critical: 'bg-rose-100 text-rose-700',
};

export function CompanyRow({ company }) {
  return (
    <tr className="transition hover:bg-slate-50">
      <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-slate-900">{company.name}</td>
      <td className="px-4 py-4 text-sm text-slate-600">{company.industry}</td>
      <td className="px-4 py-4 text-sm text-slate-600">{company.country}</td>
      <td className="px-4 py-4 text-sm font-semibold text-slate-900">{company.riskScore}</td>
      <td className="px-4 py-4">
        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${levelClasses[company.riskLevel]}`}>
          {company.riskLevel}
        </span>
      </td>
      <td className="px-4 py-4 text-sm text-slate-600 flex items-center gap-2">
        {company.trend.includes('-') ? <ArrowDownRight size={16} /> : <ArrowUpRight size={16} />}
        {company.trend}
      </td>
      <td className="px-4 py-4 text-sm text-slate-500">{company.lastUpdated}</td>
    </tr>
  );
}
