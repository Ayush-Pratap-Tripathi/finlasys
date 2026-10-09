import { Link } from 'react-router-dom';
import { AlertTriangle, Scale, TrendingUp, ArrowRight, ChevronRight } from 'lucide-react';
import { Card } from '../../ui/Card';
import { Badge } from '../../ui/Badge';

const SEVERITY_CONFIG = {
  danger: { icon: AlertTriangle, iconBg: 'bg-red-100 text-red-600', badgeTone: 'danger' },
  warning: { icon: Scale, iconBg: 'bg-amber-100 text-amber-600', badgeTone: 'warning' },
  success: { icon: TrendingUp, iconBg: 'bg-green-100 text-green-600', badgeTone: 'success' },
};

export function TopSignalsCard({ signals }) {
  return (
    <Card className="flex h-full flex-col p-6">
      <p className="text-xs font-bold uppercase tracking-wide text-ink-500">Top 3 Key Signals</p>

      <div className="mt-4 flex-1 divide-y divide-ink-100">
        {signals.length === 0 && (
          <p className="py-4 text-sm text-ink-500">No notable signals detected from the available data.</p>
        )}

        {signals.map((signal) => {
          const config = SEVERITY_CONFIG[signal.severity] ?? SEVERITY_CONFIG.warning;
          const Icon = config.icon;

          return (
            <div key={signal.id} className="flex items-start gap-3 py-3.5 first:pt-0 last:pb-0">
              <span className={`flex size-9 shrink-0 items-center justify-center rounded-full ${config.iconBg}`}>
                <Icon className="size-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-ink-900">{signal.title}</p>
                <p className="mt-0.5 text-sm text-ink-500">{signal.description}</p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <Badge tone={config.badgeTone}>{signal.badgeLabel}</Badge>
                <ChevronRight className="size-4 text-ink-300" />
              </div>
            </div>
          );
        })}
      </div>

      <Link
        to="/analysis/risk-signals"
        className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700"
      >
        View all risk & opportunity signals
        <ArrowRight className="size-4" />
      </Link>
    </Card>
  );
}
