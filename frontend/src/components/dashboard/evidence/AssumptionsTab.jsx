import { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { Card } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { cn } from '../../../lib/cn';

const IMPACT_TONE = { high: 'danger', medium: 'warning', low: 'neutral' };
const IMPACT_LABEL = { high: 'High', medium: 'Medium', low: 'Low' };
const CONFIDENCE_STEPS = ['low', 'medium', 'high', 'very_high'];
const CONFIDENCE_LABEL = { low: 'Low', medium: 'Medium', high: 'High', very_high: 'Very High' };

export function AssumptionsTab({ assumptions }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selected = assumptions[selectedIndex];

  if (assumptions.length === 0) {
    return (
      <Card className="p-10 text-center text-sm text-ink-500">
        No assumptions were needed - every figure was directly available from a cited source.
      </Card>
    );
  }

  const confidenceStepIndex = selected ? CONFIDENCE_STEPS.indexOf(selected.confidence) : -1;

  return (
    <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
      <Card className="overflow-x-auto p-6">
        <p className="text-sm font-bold text-ink-900">Assumptions Used in Analysis</p>
        <p className="mt-1 text-sm text-ink-500">Estimation methods applied due to data limitations or contextual factors.</p>

        <div className="mt-4 space-y-2">
          {assumptions.map((assumption, index) => (
            <button
              key={assumption.title}
              type="button"
              onClick={() => setSelectedIndex(index)}
              className={cn(
                'flex w-full items-start justify-between gap-3 rounded-xl border p-3 text-left transition-colors',
                selectedIndex === index ? 'border-brand-300 bg-brand-50' : 'border-ink-200 hover:bg-ink-50'
              )}
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-ink-800">{assumption.title}</p>
                <p className="mt-0.5 truncate text-xs text-ink-500">{assumption.what_we_assumed}</p>
              </div>
              <Badge tone={IMPACT_TONE[assumption.impact]} className="shrink-0">
                {IMPACT_LABEL[assumption.impact]}
              </Badge>
            </button>
          ))}
        </div>
      </Card>

      {selected && (
        <Card className="p-6">
          <div className="flex items-start justify-between gap-2">
            <p className="text-xs font-bold uppercase tracking-wide text-ink-500">Assumption Details</p>
            <Badge tone={IMPACT_TONE[selected.impact]}>{IMPACT_LABEL[selected.impact]} Impact</Badge>
          </div>
          <p className="mt-2 text-lg font-bold leading-snug text-ink-900">{selected.title}</p>

          <div className="mt-4 space-y-3 text-sm">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">What We Assumed</p>
              <p className="mt-1 leading-relaxed text-ink-700">{selected.what_we_assumed}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">Why We Assumed This</p>
              <p className="mt-1 leading-relaxed text-ink-700">{selected.why_we_assumed_it}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">How We Applied It</p>
              <p className="mt-1 leading-relaxed text-ink-700">{selected.how_we_applied_it}</p>
            </div>
          </div>

          {selected.related_metrics?.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {selected.related_metrics.map((metric) => (
                <Badge key={metric} tone="neutral">
                  {metric}
                </Badge>
              ))}
            </div>
          )}

          {selected.source?.name && (
            <div className="mt-4 flex items-center justify-between rounded-xl border border-ink-200 p-3">
              <p className="text-sm font-medium text-ink-800">{selected.source.name}</p>
              {selected.source.url && (
                <a
                  href={selected.source.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700"
                >
                  View source
                  <ExternalLink className="size-3" />
                </a>
              )}
            </div>
          )}

          <div className="mt-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">Confidence in This Assumption</p>
            <div className="relative mt-3">
              <div className="h-1.5 rounded-full bg-ink-100" />
              <div
                className="absolute -top-1 size-3.5 -translate-x-1/2 rounded-full border-2 border-white bg-brand-600 shadow"
                style={{ left: `${(confidenceStepIndex / (CONFIDENCE_STEPS.length - 1)) * 100}%` }}
              />
            </div>
            <div className="mt-1.5 flex justify-between text-xs text-ink-400">
              {CONFIDENCE_STEPS.map((step) => (
                <span key={step} className={step === selected.confidence ? 'font-semibold text-brand-600' : ''}>
                  {CONFIDENCE_LABEL[step]}
                </span>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
