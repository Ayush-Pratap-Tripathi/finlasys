import { cn } from '../../../lib/cn';

export const FINANCIAL_HEALTH_TABS = [
  { key: 'profitability', label: 'Profitability' },
  { key: 'leverage', label: 'Leverage & Debt' },
  { key: 'cash-flow', label: 'Cash Flow' },
  { key: 'working-capital', label: 'Working Capital' },
  { key: 'key-ratios', label: 'Key Ratios' },
  { key: 'segment-view', label: 'Segment View' },
];

export function FinancialHealthTabs({ activeTab, onChange }) {
  return (
    <div className="flex gap-1 overflow-x-auto border-b border-ink-200">
      {FINANCIAL_HEALTH_TABS.map((tab) => (
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
        </button>
      ))}
    </div>
  );
}
