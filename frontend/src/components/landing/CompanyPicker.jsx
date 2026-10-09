import { Search } from 'lucide-react';
import { Chip } from '../ui/Chip';
import { POPULAR_COMPANIES } from '../../lib/constants';

export function CompanyPicker({ value, onChange, disabled }) {
  return (
    <div>
      <label htmlFor="company-name" className="text-sm font-semibold text-ink-700">
        Company
      </label>
      <div className="relative mt-2">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-400" />
        <input
          id="company-name"
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          disabled={disabled}
          placeholder="Search by company name, e.g. Tata Consultancy Services"
          autoComplete="off"
          className="w-full rounded-xl border border-ink-200 bg-white py-3 pl-10 pr-4 text-sm text-ink-900 placeholder:text-ink-400 outline-none transition-colors focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 disabled:bg-ink-50"
        />
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {POPULAR_COMPANIES.map((company) => (
          <Chip
            key={company}
            type="button"
            active={value === company}
            disabled={disabled}
            onClick={() => onChange(company)}
          >
            {company}
          </Chip>
        ))}
      </div>
    </div>
  );
}
