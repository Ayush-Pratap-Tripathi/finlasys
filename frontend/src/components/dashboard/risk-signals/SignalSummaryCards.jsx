import { AlertTriangle, Scale, TrendingUp, ListChecks } from 'lucide-react';
import { Card } from '../../ui/Card';

const STAT_CONFIG = [
  { key: 'danger', icon: AlertTriangle, iconBg: 'bg-red-100 text-red-600', label: 'High Risk', sub: 'Signals that need immediate attention' },
  { key: 'warning', icon: Scale, iconBg: 'bg-amber-100 text-amber-600', label: 'Moderate Risk', sub: 'Signals to monitor closely' },
  { key: 'success', icon: TrendingUp, iconBg: 'bg-green-100 text-green-600', label: 'Positive', sub: 'Strengths and opportunities' },
];

export function SignalSummaryCards({ signals }) {
  const counts = signals.reduce(
    (acc, signal) => ({ ...acc, [signal.severity]: (acc[signal.severity] ?? 0) + 1 }),
    {}
  );

  return (
    <>
      {STAT_CONFIG.map(({ key, icon: Icon, iconBg, label, sub }) => (
        <Card key={key} className="p-4">
          <div className="flex items-start gap-3">
            <span className={`flex size-10 shrink-0 items-center justify-center rounded-full ${iconBg}`}>
              <Icon className="size-5" />
            </span>
            <div>
              <p className="font-mono text-2xl font-bold text-ink-900">{counts[key] ?? 0}</p>
              <p className="text-sm font-semibold text-ink-700">{label}</p>
              <p className="mt-0.5 text-xs text-ink-400">{sub}</p>
            </div>
          </div>
        </Card>
      ))}
      <Card className="p-4">
        <div className="flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-600">
            <ListChecks className="size-5" />
          </span>
          <div>
            <p className="font-mono text-2xl font-bold text-ink-900">{signals.length}</p>
            <p className="text-sm font-semibold text-ink-700">Total Signals</p>
            <p className="mt-0.5 text-xs text-ink-400">Across risk and opportunity</p>
          </div>
        </div>
      </Card>
    </>
  );
}
