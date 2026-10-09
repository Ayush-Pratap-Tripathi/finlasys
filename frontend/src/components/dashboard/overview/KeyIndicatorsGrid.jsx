import { Link } from 'react-router-dom';
import { LineChart, BarChart3, TrendingUp, Wallet, ShieldCheck, Percent, ArrowRight } from 'lucide-react';
import { KeyIndicatorCard } from '../../ui/KeyIndicatorCard';
import { formatMetricValue } from '../../../lib/formatCurrency';

const ICONS = {
  revenue: LineChart,
  ebitda: BarChart3,
  net_profit: TrendingUp,
  net_debt: Wallet,
  interest_coverage: ShieldCheck,
  ebitda_margin: Percent,
};

export function KeyIndicatorsGrid({ keyIndicators }) {
  if (!keyIndicators) return null;
  const { fiscalYear, indicators } = keyIndicators;

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-wide text-ink-500">
          Key Financial Indicators ({fiscalYear})
        </p>
        <Link
          to="/analysis/financial-health"
          className="flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700"
        >
          View detailed financial health
          <ArrowRight className="size-3.5" />
        </Link>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {indicators.map((indicator) => (
          <KeyIndicatorCard
            key={indicator.key}
            icon={ICONS[indicator.key]}
            label={indicator.label}
            value={formatMetricValue(indicator.value, indicator.unit)}
            changePct={indicator.changePct}
            changeLabel={indicator.changeLabel}
            trendValues={indicator.trendValues}
            goodDirection={indicator.goodDirection}
          />
        ))}
      </div>
    </div>
  );
}
