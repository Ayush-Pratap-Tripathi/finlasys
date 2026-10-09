import { Card } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { CircularGauge } from '../../ui/CircularGauge';

const QUALITY_TONE = { high: 'success', medium: 'warning', low: 'danger' };
const QUALITY_LABEL = { high: 'High', medium: 'Medium', low: 'Low' };

function noteFor(row) {
  if (row.discrepancy) return `Sources disagree - ${row.discrepancy.likely_reason}`;
  if (row.sources.length >= 2) return 'Corroborated across multiple sources';
  if (row.sources.length === 1) return 'Single source, not cross-checked';
  return 'No source attached';
}

export function DataQualityTab({ keyMetricsEvidence, qualityScore }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
      <Card className="overflow-x-auto p-6">
        <p className="text-sm font-bold text-ink-900">Data Quality Assessment</p>
        <p className="mt-1 text-sm text-ink-500">
          Quality evaluation for each metric based on source count, cross-source agreement and reliability.
        </p>

        <table className="mt-4 w-full min-w-[520px] text-left text-sm">
          <thead>
            <tr className="border-b border-ink-100 text-xs font-medium text-ink-400">
              <th className="py-2 pr-3 font-medium">Metric</th>
              <th className="py-2 pr-3 text-center font-medium">Quality</th>
              <th className="py-2 font-medium">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {keyMetricsEvidence.map((row) => (
              <tr key={row.key}>
                <td className="py-2.5 pr-3 font-medium text-ink-700">{row.label}</td>
                <td className="py-2.5 pr-3 text-center">
                  <Badge tone={QUALITY_TONE[row.quality]}>{QUALITY_LABEL[row.quality]}</Badge>
                </td>
                <td className="py-2.5 text-ink-500">{noteFor(row)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Card className="p-6">
        <p className="text-xs font-bold uppercase tracking-wide text-ink-500">Overall Data Quality Score</p>
        <div className="mt-4 flex justify-center">
          <CircularGauge value={qualityScore.overallScore} tone={qualityScore.tone} size={120} strokeWidth={11}>
            <span className="font-mono text-3xl font-extrabold text-ink-900">{qualityScore.overallScore}</span>
            <span className="absolute bottom-8 text-xs font-medium text-ink-400">/100</span>
          </CircularGauge>
        </div>

        <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-ink-500">Quality Dimensions</p>
        <div className="mt-3 space-y-3">
          {qualityScore.dimensions.map((dimension) => (
            <div key={dimension.label}>
              <div className="flex items-center justify-between text-xs">
                <span className="text-ink-600">{dimension.label}</span>
                <span className="font-mono font-semibold text-ink-900">{dimension.score}/100</span>
              </div>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-ink-100">
                <div className="h-full rounded-full bg-brand-600" style={{ width: `${dimension.score}%` }} />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
