import { useState } from 'react';
import { Card } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { cn } from '../../../lib/cn';

const SEVERITY_TONE = { high: 'danger', medium: 'warning', low: 'neutral' };
const SEVERITY_LABEL = { high: 'High', medium: 'Medium', low: 'Low' };

const UNIT_FORMATTERS = {
  inr_cr: (v) => `${v < 0 ? '-' : ''}₹${Math.abs(Math.round(v)).toLocaleString('en-IN')} Cr`,
  percent: (v) => `${v.toFixed(2)}%`,
  ratio: (v) => `${v.toFixed(2)}x`,
};

function formatValue(value, unit = 'inr_cr') {
  return (UNIT_FORMATTERS[unit] ?? UNIT_FORMATTERS.inr_cr)(value);
}

export function DiscrepanciesTab({ discrepancies }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selected = discrepancies[selectedIndex];

  if (discrepancies.length === 0) {
    return (
      <Card className="p-10 text-center text-sm text-ink-500">
        No discrepancies were found - every figure agreed across the sources used.
      </Card>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
      <Card className="overflow-x-auto p-6">
        <p className="text-sm font-bold text-ink-900">Identified Discrepancies</p>
        <p className="mt-1 text-sm text-ink-500">Differences found across sources for the same metrics.</p>

        <table className="mt-4 w-full min-w-[520px] text-left text-sm">
          <thead>
            <tr className="border-b border-ink-100 text-xs font-medium text-ink-400">
              <th className="py-2 pr-3 font-medium">Metric</th>
              <th className="py-2 pr-3 text-right font-medium">Selected Value</th>
              <th className="py-2 pr-3 text-right font-medium">Difference</th>
              <th className="py-2 text-center font-medium">Severity</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {discrepancies.map((discrepancy, index) => (
              <tr
                key={discrepancy.metric}
                onClick={() => setSelectedIndex(index)}
                className={cn('cursor-pointer transition-colors', selectedIndex === index ? 'bg-brand-50' : 'hover:bg-ink-50')}
              >
                <td className="py-2.5 pr-3 font-medium text-ink-700">{discrepancy.metric}</td>
                <td className="py-2.5 pr-3 text-right font-mono tabular-nums text-ink-900">
                  {discrepancy.selected_value_cr != null ? formatValue(discrepancy.selected_value_cr, discrepancy.unit) : '—'}
                </td>
                <td className="py-2.5 pr-3 text-right font-mono tabular-nums text-ink-900">
                  {discrepancy.difference_pct != null ? `${discrepancy.difference_pct.toFixed(1)}%` : '—'}
                </td>
                <td className="py-2.5 text-center">
                  <Badge tone={SEVERITY_TONE[discrepancy.severity]}>{SEVERITY_LABEL[discrepancy.severity]}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {selected && (
        <Card className="p-6">
          <div className="flex items-start justify-between gap-2">
            <p className="text-xs font-bold uppercase tracking-wide text-ink-500">Discrepancy Details</p>
            <Badge tone={SEVERITY_TONE[selected.severity]}>{SEVERITY_LABEL[selected.severity]}</Badge>
          </div>
          <p className="mt-2 text-lg font-bold text-ink-900">{selected.metric}</p>

          <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-ink-500">Values Compared</p>
          <div className="mt-2 space-y-2">
            {selected.values.map((value) => (
              <div
                key={value.source}
                className={cn(
                  'flex items-center justify-between rounded-xl border px-3 py-2 text-sm',
                  value.source === selected.selected_source ? 'border-brand-300 bg-brand-50' : 'border-ink-200'
                )}
              >
                <div>
                  <p className="font-medium text-ink-800">{value.source}</p>
                  {value.source === selected.selected_source && (
                    <p className="text-xs font-semibold text-brand-600">Selected as authoritative</p>
                  )}
                </div>
                <p className="font-mono font-semibold text-ink-900">{formatValue(value.value_cr, selected.unit)}</p>
              </div>
            ))}
          </div>

          {selected.likely_reason && (
            <div className="mt-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">Likely Reason</p>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-600">{selected.likely_reason}</p>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
