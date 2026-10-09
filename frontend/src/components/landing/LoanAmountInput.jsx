import { Chip } from '../ui/Chip';
import { LOAN_AMOUNT_PRESETS } from '../../lib/constants';
import { formatIndianNumber, parseIndianNumber, formatAsLakhOrCrore } from '../../lib/formatCurrency';

export function LoanAmountInput({ value, onChange, disabled }) {
  return (
    <div>
      <label htmlFor="loan-amount" className="text-sm font-semibold text-ink-700">
        Loan Amount
      </label>
      <div className="relative mt-2">
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-ink-400">
          ₹
        </span>
        <input
          id="loan-amount"
          type="text"
          inputMode="numeric"
          value={formatIndianNumber(value)}
          onChange={(event) => onChange(parseIndianNumber(event.target.value) || 0)}
          disabled={disabled}
          placeholder="1,00,00,000"
          className="w-full rounded-xl border border-ink-200 bg-white py-3 pl-8 pr-4 text-sm text-ink-900 outline-none transition-colors focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 disabled:bg-ink-50"
        />
      </div>
      <p className="mt-1.5 text-xs font-medium text-ink-500">
        {value ? formatAsLakhOrCrore(value) : 'Enter an amount, or pick a preset below'}
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        {LOAN_AMOUNT_PRESETS.map((preset) => (
          <Chip
            key={preset.label}
            type="button"
            active={value === preset.valueInr}
            disabled={disabled}
            onClick={() => onChange(preset.valueInr)}
          >
            {preset.label}
          </Chip>
        ))}
      </div>
    </div>
  );
}
