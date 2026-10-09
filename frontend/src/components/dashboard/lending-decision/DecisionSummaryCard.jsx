import { Card } from '../../ui/Card';
import { formatAsLakhOrCrore } from '../../../lib/formatCurrency';

export function DecisionSummaryCard({ summary, conditionsCount }) {
  const rows = [
    { label: 'Recommended Limit', value: formatAsLakhOrCrore(summary.recommendedLimitInr) },
    { label: 'Tenure', value: `${summary.tenureMonths} Months` },
    { label: 'Interest Rate (Indicative)', value: `${summary.interestRatePct.toFixed(2)}% p.a.` },
    { label: 'Security', value: summary.security },
    { label: 'Covenants', value: summary.covenantTier },
    { label: 'Conditions', value: String(conditionsCount) },
  ];

  return (
    <Card className="p-6">
      <p className="text-xs font-bold uppercase tracking-wide text-ink-500">Decision Summary</p>

      <div className="mt-4 divide-y divide-ink-100">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between py-2 text-sm">
            <span className="text-ink-500">{row.label}</span>
            <span className="font-semibold text-ink-900">{row.value}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
