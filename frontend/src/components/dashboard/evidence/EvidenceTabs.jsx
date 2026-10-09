import { cn } from '../../../lib/cn';

export function EvidenceTabs({ tabs, activeTab, onChange }) {
  return (
    <div className="flex gap-1 overflow-x-auto border-b border-ink-200">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          type="button"
          onClick={() => onChange(tab.key)}
          className={cn(
            'shrink-0 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-semibold transition-colors',
            activeTab === tab.key
              ? 'border-brand-600 text-brand-600'
              : 'border-transparent text-ink-500 hover:text-ink-800'
          )}
        >
          {tab.label}
          {tab.count != null && <span className="ml-1.5 text-ink-400">({tab.count})</span>}
        </button>
      ))}
    </div>
  );
}
