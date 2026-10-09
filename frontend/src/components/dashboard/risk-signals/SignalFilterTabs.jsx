import { cn } from '../../../lib/cn';

const FILTERS = [
  { key: 'all', label: 'All Signals' },
  { key: 'danger', label: 'High Risk' },
  { key: 'warning', label: 'Moderate Risk' },
  { key: 'success', label: 'Positive' },
];

export function SignalFilterTabs({ signals, activeFilter, onChange }) {
  const countFor = (key) => (key === 'all' ? signals.length : signals.filter((s) => s.severity === key).length);

  return (
    <div className="flex flex-wrap gap-2">
      {FILTERS.map((filter) => (
        <button
          key={filter.key}
          type="button"
          onClick={() => onChange(filter.key)}
          className={cn(
            'rounded-xl border px-3.5 py-2 text-sm font-semibold transition-colors',
            activeFilter === filter.key
              ? 'border-brand-600 bg-brand-50 text-brand-700'
              : 'border-ink-200 bg-white text-ink-600 hover:border-ink-300'
          )}
        >
          {filter.label} ({countFor(filter.key)})
        </button>
      ))}
    </div>
  );
}
