import { Card } from '../../ui/Card';
import { CircularGauge } from '../../ui/CircularGauge';

export function RiskRatingCard({ riskRating, totalScore }) {
  return (
    <Card className="flex flex-col items-center p-6 text-center">
      <p className="text-xs font-bold uppercase tracking-wide text-ink-500">Risk Rating</p>

      <div className="mt-4">
        <CircularGauge value={totalScore} tone={riskRating.tone} size={108} strokeWidth={10}>
          <span className="font-mono text-lg font-extrabold text-ink-900">{riskRating.label.split(' ')[0]}</span>
        </CircularGauge>
      </div>

      <p className="mt-3 text-sm font-semibold text-ink-700">Risk Rating: {riskRating.grade}</p>
      <p className="mt-2 text-sm leading-relaxed text-ink-500">
        {riskRating.grade === 'A'
          ? 'Low probability of default with adequate capacity to meet financial obligations.'
          : riskRating.grade === 'B'
            ? 'Manageable risk with some sensitivity to adverse conditions - monitoring recommended.'
            : 'Elevated probability of financial stress - careful structuring and monitoring required.'}
      </p>
    </Card>
  );
}
