import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Card } from '../../ui/Card';
import { Sparkline } from '../../ui/Sparkline';
import { formatMetricValue } from '../../../lib/formatCurrency';

export function FinancialTrendTable({ financialTrend }) {
  if (!financialTrend) return null;
  const { years, rows } = financialTrend;

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-wide text-ink-500">Recent Financial Trend Summary</p>
        <Link
          to="/analysis/financial-health"
          className="flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700"
        >
          View full trends
          <ArrowRight className="size-3.5" />
        </Link>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[520px] text-left text-sm">
          <thead>
            <tr className="border-b border-ink-100 text-xs font-medium text-ink-400">
              <th className="pb-2 pr-4 font-medium">Indicator</th>
              {years.map((year) => (
                <th key={year} className="pb-2 pr-4 font-medium">
                  {year}
                </th>
              ))}
              <th className="pb-2 font-medium">Trend</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {rows.map((row) => (
              <tr key={row.key}>
                <td className="py-2.5 pr-4 font-medium text-ink-700">{row.label}</td>
                {row.recentValues.map((value, index) => (
                  <td key={years[index]} className="py-2.5 pr-4 font-mono tabular-nums text-ink-900">
                    {formatMetricValue(value, row.unit, { compact: true, parensForNegative: row.parensForNegative })}
                  </td>
                ))}
                <td className="w-24 py-2.5">
                  <Sparkline values={row.allValues} className="h-5 w-20" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs text-ink-400">
        All values are from company filings and verified sources. Data in ₹ Crore unless specified.
      </p>
    </Card>
  );
}
