import { Calendar } from 'lucide-react';

export function DashboardTopbar({ title, subtitle, fiscalYear }) {
  return (
    <header className="flex items-center justify-between border-b border-ink-200 bg-white px-8 py-5">
      <div>
        <h1 className="text-2xl font-bold text-ink-900">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-ink-500">{subtitle}</p>}
      </div>

      {fiscalYear && (
        <span className="flex items-center gap-2 rounded-xl border border-ink-200 px-3.5 py-2 text-sm font-medium text-ink-700">
          <Calendar className="size-4 text-ink-400" />
          Data as of {fiscalYear}
        </span>
      )}
    </header>
  );
}
