import { Info, CalendarClock, CalendarCheck, Scale, Receipt } from 'lucide-react';
import { KeyIndicatorCard } from '../../ui/KeyIndicatorCard';
import { ChartCard } from './ChartCard';
import { FinancialTrendChart } from '../../ui/FinancialTrendChart';
import { formatMetricValue } from '../../../lib/formatCurrency';

const ICONS = {
  receivables: Receipt,
  receivables_days: CalendarClock,
  payables_days: CalendarCheck,
  working_capital_days: Scale,
};

function crValue(v) {
  return formatMetricValue(v, 'cr');
}

export function WorkingCapitalTab({ workingCapital }) {
  if (!workingCapital) return null;
  const { cards, trendData } = workingCapital;

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
        <ChartCard title="Receivables vs. Payables" description="Trade receivables owed to the company against payables owed by it.">
          <FinancialTrendChart
            data={trendData}
            series={[
              { dataKey: 'receivables', label: 'Receivables', color: '#2563eb', type: 'line', valueFormatter: crValue },
              { dataKey: 'payables', label: 'Payables', color: '#d97706', type: 'line', valueFormatter: crValue },
            ]}
            yAxisFormatter={(v) => `${Math.round(v / 1000)}k`}
          />
        </ChartCard>

        <ChartCard title="Net Working Capital Days" description="Receivables days minus payables days - rising values mean more cash tied up in operations.">
          <FinancialTrendChart
            data={trendData}
            series={[{ dataKey: 'wcDays', label: 'WC Days', color: '#16a34a', type: 'line', valueFormatter: (v) => `${v.toFixed(0)} days` }]}
            yAxisFormatter={(v) => `${v}d`}
          />
        </ChartCard>
      </div>

      <div className="flex items-start gap-2.5 rounded-xl border border-ink-200 bg-ink-50 p-4 text-xs text-ink-500">
        <Info className="mt-0.5 size-4 shrink-0 text-ink-400" />
        <p>
          Receivables and payables days are approximated against revenue (days = balance ÷ revenue × 365) because
          the research schema doesn't capture cost of goods sold separately - a standard simplification when only
          headline financials are available, not a precise textbook DSO/DPO calculation.
        </p>
      </div>
    </div>
  );
}
