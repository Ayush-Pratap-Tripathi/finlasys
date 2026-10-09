import { CheckCircle2, XCircle } from 'lucide-react';
import { Card } from '../../ui/Card';

const TONE_STYLES = {
  success: { ring: 'bg-green-100 text-green-600', text: 'text-green-700' },
  danger: { ring: 'bg-red-100 text-red-600', text: 'text-red-700' },
};

const DECISION_LABEL = {
  APPROVE: 'Approve',
  'APPROVE WITH CONDITIONS': 'Approve with Conditions',
  DECLINE: 'Decline',
};

export function FinalRecommendationCard({ recommendation }) {
  const styles = TONE_STYLES[recommendation.tone] ?? TONE_STYLES.success;
  const Icon = recommendation.tone === 'danger' ? XCircle : CheckCircle2;

  return (
    <Card className="flex flex-col items-center p-6 text-center">
      <p className="text-xs font-bold uppercase tracking-wide text-ink-500">Final Recommendation</p>

      <span className={`mt-4 flex size-24 items-center justify-center rounded-full ${styles.ring}`}>
        <Icon className="size-12" />
      </span>
      <p className={`mt-4 text-2xl font-extrabold ${styles.text}`}>{DECISION_LABEL[recommendation.decision] ?? recommendation.decision}</p>
      {recommendation.decision !== 'DECLINE' && <p className="text-sm font-medium text-ink-400">Recommended</p>}

      <p className="mt-4 text-sm leading-relaxed text-ink-500">{recommendation.description}</p>
    </Card>
  );
}
