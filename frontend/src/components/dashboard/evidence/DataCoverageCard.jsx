import { Check, Minus } from 'lucide-react';
import { Card } from '../../ui/Card';
import { CircularGauge } from '../../ui/CircularGauge';

const STATUS_TONE = { Complete: 'success', Available: 'success', Partial: 'warning', Missing: 'neutral' };

export function DataCoverageCard({ coverage }) {
  return (
    <Card className="p-5">
      <p className="text-xs font-bold uppercase tracking-wide text-ink-500">Data Coverage</p>
      <div className="mt-4 flex items-center gap-5">
        <CircularGauge value={coverage.overallPct} tone="success" size={80} strokeWidth={8}>
          <span className="font-mono text-lg font-extrabold text-ink-900">{coverage.overallPct}%</span>
        </CircularGauge>
        <div className="min-w-0 flex-1 space-y-1.5">
          {coverage.categories.map((category) => (
            <div key={category.label} className="flex items-center justify-between gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-ink-600">
                {category.status === 'Missing' ? (
                  <Minus className="size-3 text-ink-300" />
                ) : (
                  <Check className={`size-3 ${STATUS_TONE[category.status] === 'warning' ? 'text-amber-500' : 'text-green-500'}`} />
                )}
                {category.label}
              </span>
              <span className="font-medium text-ink-500">{category.status}</span>
            </div>
          ))}
        </div>
      </div>
      <p className="mt-3 text-xs text-ink-400">Coverage for key metrics used in analysis</p>
    </Card>
  );
}
