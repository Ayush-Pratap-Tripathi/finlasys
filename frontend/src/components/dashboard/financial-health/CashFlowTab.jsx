import { Banknote, PiggyBank, Percent, TrendingUp } from 'lucide-react';
import { KeyIndicatorCard } from '../../ui/KeyIndicatorCard';
import { ChartCard } from './ChartCard';
import { FinancialTrendChart } from '../../ui/FinancialTrendChart';
import { formatMetricValue } from '../../../lib/formatCurrency';

const ICONS = {
  cfo: Banknote,
  fcf: PiggyBank,
  cash_conversion: Percent,
  fcf_margin: TrendingUp,
};

function crValue(v) {
  return formatMetricValue(v, 'cr');
}

export function CashFlowTab({ cashFlow }) {
  if (!cashFlow) return null;
  const { cards, trendData } = cashFlow;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {cards.map((card) => (
          <KeyIndicatorCard
            key={card.key}
            icon={ICONS[card.key]}
            label={card.label}
            value={formatMetricValue(card.value, card.unit)}
            changePct={card.changePct}
            changeLabel={card.changeLabel}
            goodDirection={card.goodDirection}
          />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Operating Cash Flow vs. Free Cash Flow" description="How much of reported profit converts into cash the business can actually use.">
          <FinancialTrendChart
            data={trendData}
            series={[
              { dataKey: 'cfo', label: 'Operating Cash Flow', color: '#bfdbfe', type: 'bar', valueFormatter: crValue },
              { dataKey: 'fcf', label: 'Free Cash Flow', color: '#2563eb', type: 'line', valueFormatter: crValue },
            ]}
            yAxisFormatter={(v) => `${Math.round(v / 1000)}k`}
          />
        </ChartCard>

        <ChartCard title="Cash Conversion Trend" description="Operating cash flow as a share of EBITDA - closer to 100% means earnings are backed by real cash.">
          <FinancialTrendChart
            data={trendData}
            series={[{ dataKey: 'conversion', label: 'Cash Conversion', color: '#16a34a', type: 'line', valueFormatter: (v) => `${v.toFixed(0)}%` }]}
            yAxisFormatter={(v) => `${v}%`}
          />
        </ChartCard>
      </div>
    </div>
  );
}
