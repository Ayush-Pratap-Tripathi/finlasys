import { useState } from 'react';
import { AlertTriangle, ExternalLink } from 'lucide-react';
import { Card } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { cn } from '../../../lib/cn';
import { formatMetricValue } from '../../../lib/formatCurrency';

const QUALITY_TONE = { high: 'success', medium: 'warning', low: 'danger' };
const QUALITY_LABEL = { high: 'High', medium: 'Medium', low: 'Low' };

export function KeyMetricsEvidenceTab({ rows }) {
  const [selectedKey, setSelectedKey] = useState(rows[0]?.key);
  const selected = rows.find((r) => r.key === selectedKey) ?? rows[0];

  if (rows.length === 0) {
    return <Card className="p-10 text-center text-sm text-ink-500">No metric evidence available.</Card>;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
      <Card className="overflow-x-auto p-6">
        <p className="text-sm font-bold text-ink-900">Key Metrics Evidence</p>
        <p className="mt-1 text-sm text-ink-500">All data used in the analysis with source transparency.</p>

        <table className="mt-4 w-full min-w-[480px] text-left text-sm">
          <thead>
            <tr className="border-b border-ink-100 text-xs font-medium text-ink-400">
              <th className="py-2 pr-3 font-medium">Metric</th>
              <th className="py-2 pr-3 font-medium">Our Value ({rows[0].fiscalYear})</th>
              <th className="py-2 pr-3 text-center font-medium">Sources</th>
              <th className="py-2 pr-3 text-center font-medium">Discrepancy</th>
              <th className="py-2 text-center font-medium">Quality</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {rows.map((row) => (
              <tr
                key={row.key}
                onClick={() => setSelectedKey(row.key)}
                className={cn('cursor-pointer transition-colors', selected?.key === row.key ? 'bg-brand-50' : 'hover:bg-ink-50')}
              >
                <td className="py-2.5 pr-3 font-medium text-ink-700">{row.label}</td>
                <td className="py-2.5 pr-3 font-mono tabular-nums text-ink-900">{formatMetricValue(row.value, row.unit)}</td>
                <td className="py-2.5 pr-3 text-center text-ink-500">{row.sources.length || '—'}</td>
                <td className="py-2.5 pr-3 text-center">
                  {row.discrepancy ? (
                    <Badge tone="warning">Yes</Badge>
                  ) : (
                    <span className="text-ink-300">—</span>
                  )}
                </td>
                <td className="py-2.5 text-center">
                  <Badge tone={QUALITY_TONE[row.quality]}>{QUALITY_LABEL[row.quality]}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {selected && (
        <Card className="p-6">
          <p className="text-xs font-bold uppercase tracking-wide text-ink-500">Metric Detail</p>
          <p className="mt-2 text-lg font-bold text-ink-900">
            {selected.label} ({selected.fiscalYear})
          </p>
          <p className="mt-1 font-mono text-2xl font-bold text-brand-700">{formatMetricValue(selected.value, selected.unit)}</p>

          {selected.discrepancy && (
            <div className="mt-3 flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-xs text-amber-800">
              <AlertTriangle className="mt-0.5 size-4 shrink-0" />
              <span>
                A source reported a different value for this metric: {selected.discrepancy.likely_reason}
              </span>
            </div>
          )}

          <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-ink-500">Sources Cited</p>
          <div className="mt-2 space-y-2">
            {selected.sources.length === 0 && <p className="text-sm text-ink-400">No source attached.</p>}
            {selected.sources.map((source) => (
              <div key={source.name} className="rounded-xl border border-ink-200 p-3">
                <p className="text-sm font-medium text-ink-800">{source.name}</p>
                {source.url && (
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700"
                  >
                    View source
                    <ExternalLink className="size-3" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
