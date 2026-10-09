import { Link } from 'react-router-dom';
import { AlertTriangle, Scale, TrendingUp, TrendingDown, ArrowRight, FileText } from 'lucide-react';
import { Card } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { FinancialTrendChart } from '../../ui/FinancialTrendChart';

const SEVERITY_CONFIG = {
  danger: { icon: AlertTriangle, iconBg: 'bg-red-100 text-red-600', badgeTone: 'danger' },
  warning: { icon: Scale, iconBg: 'bg-amber-100 text-amber-600', badgeTone: 'warning' },
  success: { icon: TrendingUp, iconBg: 'bg-green-100 text-green-600', badgeTone: 'success' },
};

export function SignalCard({ signal, trendData }) {
  const config = SEVERITY_CONFIG[signal.severity] ?? SEVERITY_CONFIG.warning;
  const Icon = config.icon;
  const ImpactIcon = signal.impact.direction === 'positive' ? TrendingUp : TrendingDown;

  const chartSeries = signal.chartKeys.map((k) => ({
    dataKey: k.key,
    label: k.label,
    color: k.color,
    type: 'line',
  }));

  return (
    <Card className="p-6">
      <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
        <div>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <span className={`flex size-11 shrink-0 items-center justify-center rounded-full ${config.iconBg}`}>
                <Icon className="size-5" />
              </span>
              <div>
                <Badge tone={config.badgeTone}>{signal.badgeLabel}</Badge>
                <p className="mt-1.5 font-semibold text-ink-900">{signal.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-ink-500">{signal.description}</p>
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {signal.metrics.map((metric) => (
              <div key={metric.label} className="rounded-xl border border-ink-200 bg-ink-50 px-3 py-2">
                <p className="text-xs text-ink-500">{metric.label}</p>
                <p className="font-mono text-sm font-bold text-ink-900">{metric.value}</p>
              </div>
            ))}
          </div>

          <div
            className={`mt-4 flex items-start gap-2.5 rounded-xl p-3 text-sm ${
              signal.impact.direction === 'positive' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            }`}
          >
            <ImpactIcon className="mt-0.5 size-4 shrink-0" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide opacity-70">Impact on Decision</p>
              <p className="mt-0.5">{signal.impact.text}</p>
            </div>
          </div>

          <Link
            to="/analysis/evidence"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700"
          >
            <FileText className="size-3.5" />
            View evidence
            <ArrowRight className="size-3.5" />
          </Link>
        </div>

        <div className="min-w-0">
          <FinancialTrendChart data={trendData} series={chartSeries} height={160} />
        </div>
      </div>
    </Card>
  );
}
