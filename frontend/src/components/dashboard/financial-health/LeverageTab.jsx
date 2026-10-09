import { Landmark, Wallet, Scale, ShieldCheck } from 'lucide-react';
import { KeyIndicatorCard } from '../../ui/KeyIndicatorCard';
import { ChartCard } from './ChartCard';
import { FinancialTrendChart } from '../../ui/FinancialTrendChart';
import { formatMetricValue } from '../../../lib/formatCurrency';

const ICONS = {
  borrowings: Landmark,
  net_debt: Wallet,
  debt_to_ebitda: Scale,
  interest_coverage: ShieldCheck,
};

function crValue(v) {
  return formatMetricValue(v, 'cr');
}

export function LeverageTab({ leverage }) {
  if (!leverage) return null;
  const { cards, trendData, isNetCash } = leverage;

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

      <ChartCard
        title="Borrowings vs. Net Debt"
        description={
          isNetCash
            ? 'This company has held a net-cash position (more cash than borrowings) across the researched years.'
            : 'Gross borrowings against net debt (borrowings minus cash and current investments).'
        }
      >
        <FinancialTrendChart
          data={trendData}
          series={[
            { dataKey: 'borrowings', label: 'Borrowings', color: '#bfdbfe', type: 'bar', valueFormatter: crValue },
            { dataKey: 'netDebt', label: 'Net Debt', color: '#dc2626', type: 'line', valueFormatter: crValue },
          ]}
          yAxisFormatter={(v) => `${Math.round(v / 1000)}k`}
        />
      </ChartCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Net Debt / EBITDA Trend" description="Lower is safer - under 3x is generally considered comfortable.">
          <FinancialTrendChart
            data={trendData}
            series={[{ dataKey: 'debtToEbitda', label: 'Net Debt / EBITDA', color: '#d97706', type: 'line', valueFormatter: (v) => `${v.toFixed(2)}x` }]}
            yAxisFormatter={(v) => `${v}x`}
            height={220}
          />
        </ChartCard>

        <ChartCard title="Interest Coverage Trend" description="EBITDA relative to interest expense - higher means more cushion.">
          <FinancialTrendChart
            data={trendData}
            series={[{ dataKey: 'coverage', label: 'Interest Coverage', color: '#16a34a', type: 'line', valueFormatter: (v) => `${v.toFixed(1)}x` }]}
            yAxisFormatter={(v) => `${v}x`}
            height={220}
          />
        </ChartCard>
      </div>
    </div>
  );
}
