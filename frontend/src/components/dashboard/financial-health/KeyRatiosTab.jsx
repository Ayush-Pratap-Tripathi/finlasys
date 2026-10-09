import { Card } from '../../ui/Card';
import { formatMetricValue } from '../../../lib/formatCurrency';

export function KeyRatiosTab({ keyRatios }) {
  if (!keyRatios) return null;
  const { years, rows } = keyRatios;

  return (
    <Card className="overflow-x-auto p-6">
      <p className="text-sm font-bold text-ink-900">Key Ratios, Five-Year Summary</p>
      <p className="mt-1 text-sm text-ink-500">
        Every ratio below is calculated directly from the researched annual figures using the formulas noted in
        each tab - nothing here is a separately sourced or estimated number.
      </p>

      <table className="mt-4 w-full min-w-[560px] text-left text-sm">
        <thead>
          <tr className="border-b border-ink-100 text-xs font-medium text-ink-400">
            <th className="py-2 pr-4 font-medium">Ratio</th>
            {years.map((year) => (
              <th key={year} className="py-2 pr-4 font-medium">
                {year}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-ink-100">
          {rows.map((row) => (
            <tr key={row.key}>
              <td className="py-2.5 pr-4 font-medium text-ink-700">{row.label}</td>
              {row.valuesByYear.map(({ fiscal_year, value }) => (
                <td key={fiscal_year} className="py-2.5 pr-4 font-mono tabular-nums text-ink-900">
                  {formatMetricValue(value, row.unit)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
