import { LineChart, BarChart3, TrendingUp, Percent, Wallet } from 'lucide-react';
import { KeyIndicatorCard } from '../../ui/KeyIndicatorCard';
import { ChartCard } from './ChartCard';
import { FinancialTrendChart } from '../../ui/FinancialTrendChart';
import { formatMetricValue } from '../../../lib/formatCurrency';

const ICONS = {
  revenue: LineChart,
  ebitda: BarChart3,
  net_profit: Wallet,
  ebitda_margin: Percent,
  net_profit_margin: TrendingUp,
};

function crValue(v) {
  return formatMetricValue(v, 'cr');
}
function pctValue(v) {
  return formatMetricValue(v, 'percent');
}

export function ProfitabilityTab({ profitability }) {
  if (!profitability) return null;
  const { cards, trendData } = profitability;
  const latestFiscalYear = trendData[trendData.length - 1]?.fiscal_year;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-ink-500">
          {latestFiscalYear} performance across the five-year window researched for this company.
        </p>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
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
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Profitability Trend" description="Revenue, EBITDA and net profit across the researched years.">
          <FinancialTrendChart
            data={trendData}
            series={[
              { dataKey: 'revenue', label: 'Revenue', color: '#bfdbfe', type: 'bar', valueFormatter: crValue },
              { dataKey: 'ebitda', label: 'EBITDA', color: '#2563eb', type: 'line', valueFormatter: crValue },
              { dataKey: 'netProfit', label: 'Net Profit', color: '#16a34a', type: 'line', valueFormatter: crValue },
            ]}
            yAxisFormatter={(v) => `${Math.round(v / 1000)}k`}
          />
        </ChartCard>

        <ChartCard title="Margin Trend (%)" description="EBITDA margin vs. net profit margin over time.">
          <FinancialTrendChart
            data={trendData}
            series={[
              { dataKey: 'ebitdaMargin', label: 'EBITDA Margin', color: '#2563eb', type: 'line', valueFormatter: pctValue },
              { dataKey: 'netMargin', label: 'Net Profit Margin', color: '#16a34a', type: 'line', valueFormatter: pctValue },
            ]}
            yAxisFormatter={(v) => `${v}%`}
          />
        </ChartCard>
      </div>
    </div>
  );
}
