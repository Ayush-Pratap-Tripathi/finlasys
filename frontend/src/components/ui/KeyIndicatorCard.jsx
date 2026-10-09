import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card } from './Card';
import { Sparkline } from './Sparkline';

/**
 * `goodDirection` says which direction of change is favorable for this
 * metric ('up' for Revenue/EBITDA/Net Profit/Coverage, 'down' for a metric
 * like Net Debt where growth is bad) so the delta color reflects business
 * meaning rather than just "positive number = green".
 */
export function KeyIndicatorCard({ icon: Icon, label, value, changePct, changeLabel, trendValues, goodDirection = 'up' }) {
  const hasChange = typeof changePct === 'number' && !Number.isNaN(changePct);
  const isIncrease = hasChange && changePct >= 0;
  const isFavorable = hasChange && (goodDirection === 'up' ? isIncrease : !isIncrease);

  return (
    <Card className="p-4">
      <div className="flex items-center gap-2">
        <span className="flex size-7 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
          <Icon className="size-4" />
        </span>
        <p className="text-sm font-medium text-ink-500">{label}</p>
      </div>

      <p className="mt-3 font-mono text-2xl font-bold tabular-nums text-ink-900">{value}</p>

      {hasChange && (
        <div className="mt-1 flex items-center gap-1.5">
          <span
            className={`flex items-center gap-0.5 text-xs font-semibold ${
              isFavorable ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {isIncrease ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
            {Math.abs(changePct).toFixed(1)}%
          </span>
          {changeLabel && <span className="text-xs text-ink-400">{changeLabel}</span>}
        </div>
      )}

      {trendValues && trendValues.length > 1 && (
        <Sparkline
          values={trendValues}
          color={isFavorable || !hasChange ? '#2563eb' : '#dc2626'}
          className="mt-3 h-6 w-full"
        />
      )}
    </Card>
  );
}
