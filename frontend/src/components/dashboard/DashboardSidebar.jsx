import { NavLink, useNavigate } from 'react-router-dom';
import { ArrowLeft, Pencil, RotateCw } from 'lucide-react';
import { Logo } from '../ui/Logo';
import { Badge } from '../ui/Badge';
import { cn } from '../../lib/cn';
import { DASHBOARD_NAV_ITEMS } from '../../lib/dashboardNav';
import { formatAsLakhOrCrore } from '../../lib/formatCurrency';

function formatLastUpdated(isoString) {
  if (!isoString) return null;
  return new Date(isoString).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function DashboardSidebar({ company, loanAmountInr, generatedAt }) {
  const navigate = useNavigate();

  return (
    <aside className="flex h-full w-72 shrink-0 flex-col border-r border-ink-200 bg-white px-5 py-6">
      <Logo />

      <div className="mt-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">Credit Analysis</p>
        <p className="mt-2 text-2xl font-bold text-ink-900">{company.nse_ticker || company.name}</p>
        <p className="text-sm text-ink-500">{company.name}</p>
        {company.nse_ticker && (
          <Badge tone="brand" className="mt-2">
            NSE: {company.nse_ticker}
          </Badge>
        )}
      </div>

      <div className="mt-6 rounded-xl bg-ink-50 p-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-ink-500">Loan Amount</p>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="text-ink-400 transition-colors hover:text-brand-600"
            aria-label="Edit loan request"
          >
            <Pencil className="size-3.5" />
          </button>
        </div>
        <p className="mt-1 text-lg font-bold text-ink-900">{formatAsLakhOrCrore(loanAmountInr)}</p>
      </div>

      <nav className="mt-6 flex-1 space-y-1">
        {DASHBOARD_NAV_ITEMS.map((item) => (
          <NavLink
            key={item.key}
            to={item.path}
            end={item.path === '/analysis'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                isActive ? 'bg-brand-50 text-brand-700' : 'text-ink-600 hover:bg-ink-50'
              )
            }
          >
            <item.icon className="size-4 shrink-0" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="space-y-3 border-t border-ink-200 pt-4">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-ink-200 px-4 py-2.5 text-sm font-semibold text-ink-700 transition-colors hover:bg-ink-50"
        >
          <ArrowLeft className="size-4" />
          Back to Setup
        </button>

        {generatedAt && (
          <div className="flex items-center justify-between text-xs text-ink-400">
            <span>Last updated {formatLastUpdated(generatedAt)}</span>
            <RotateCw className="size-3.5" />
          </div>
        )}
      </div>
    </aside>
  );
}
