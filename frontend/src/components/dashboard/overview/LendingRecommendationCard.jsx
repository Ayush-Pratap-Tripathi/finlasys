import { Link } from 'react-router-dom';
import { ShieldCheck, ShieldX, ArrowRight } from 'lucide-react';
import { Card } from '../../ui/Card';
import { formatAsLakhOrCrore } from '../../../lib/formatCurrency';

const TONE_STYLES = {
  success: {
    card: 'border-green-200 bg-green-50',
    label: 'text-green-700',
    heading: 'text-green-700',
    iconBg: 'bg-green-100 text-green-600',
    button: 'bg-white text-green-700 hover:bg-green-100',
  },
  danger: {
    card: 'border-red-200 bg-red-50',
    label: 'text-red-700',
    heading: 'text-red-700',
    iconBg: 'bg-red-100 text-red-600',
    button: 'bg-white text-red-700 hover:bg-red-100',
  },
};

export function LendingRecommendationCard({ recommendation, loanAmountInr }) {
  const styles = TONE_STYLES[recommendation.tone] ?? TONE_STYLES.success;
  const Icon = recommendation.tone === 'danger' ? ShieldX : ShieldCheck;

  return (
    <Card className={`p-6 ${styles.card}`}>
      <p className={`text-xs font-bold uppercase tracking-wide ${styles.label}`}>Lending Recommendation</p>

      <div className="mt-4 flex items-start gap-4">
        <span className={`flex size-14 shrink-0 items-center justify-center rounded-full ${styles.iconBg}`}>
          <Icon className="size-7" />
        </span>
        <div>
          <p className={`text-2xl font-extrabold tracking-tight ${styles.heading}`}>{recommendation.decision}</p>
          <p className="mt-1 text-sm leading-relaxed text-ink-600">{recommendation.description}</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 border-t border-black/5 pt-4">
        <div>
          <p className="text-xs font-medium text-ink-500">Confidence Level</p>
          <p className={`text-lg font-bold ${styles.heading}`}>{recommendation.confidenceLabel}</p>
          <p className="text-xs text-ink-500">{recommendation.confidencePct}%</p>
        </div>
        <div>
          <p className="text-xs font-medium text-ink-500">Loan Amount</p>
          <p className="text-lg font-bold text-ink-900">{formatAsLakhOrCrore(loanAmountInr)}</p>
          <p className="text-xs text-ink-500">Working Capital Loan</p>
        </div>
      </div>

      <Link
        to="/analysis/lending-decision"
        className={`mt-5 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold shadow-sm transition-colors ${styles.button}`}
      >
        View Decision Summary
        <ArrowRight className="size-4" />
      </Link>
    </Card>
  );
}
