import { TrendingUp, ShieldCheck, LineChart, Wallet, Users } from 'lucide-react';
import { Card } from '../../ui/Card';
import { Badge } from '../../ui/Badge';

const ICONS = {
  financialHealth: TrendingUp,
  creditRisk: ShieldCheck,
  businessOutlook: LineChart,
  cashFlowLiquidity: Wallet,
  managementGovernance: Users,
};

const TONE_LABEL = { success: 'Positive', warning: 'Watch', danger: 'Negative' };
const TONE_ICON_BG = { success: 'bg-green-100 text-green-600', warning: 'bg-amber-100 text-amber-600', danger: 'bg-red-100 text-red-600' };

export function KeyDecisionDriversCard({ rows }) {
  return (
    <Card className="p-6">
      <p className="text-xs font-bold uppercase tracking-wide text-ink-500">Key Decision Drivers</p>

      <div className="mt-4 divide-y divide-ink-100">
        {rows.map((row) => {
          const Icon = ICONS[row.key];
          return (
            <div key={row.key} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
              <span className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${TONE_ICON_BG[row.tone]}`}>
                <Icon className="size-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-ink-900">{row.label}</p>
                <p className="truncate text-xs text-ink-500">{row.description}</p>
              </div>
              <Badge tone={row.tone}>{TONE_LABEL[row.tone]}</Badge>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
