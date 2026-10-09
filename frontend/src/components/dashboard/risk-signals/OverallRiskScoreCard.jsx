import { Card } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { CircularGauge } from '../../ui/CircularGauge';

const TONE_BADGE = { success: 'success', warning: 'warning', danger: 'danger' };

export function OverallRiskScoreCard({ riskScore }) {
  return (
    <Card className="flex items-center gap-5 p-4">
      <CircularGauge value={riskScore.score} tone={riskScore.tone} size={88} strokeWidth={9}>
        <span className="font-mono text-xl font-extrabold text-ink-900">{riskScore.score}</span>
      </CircularGauge>
      <div>
        <p className="text-xs font-medium text-ink-500">Overall Risk Score</p>
        <Badge tone={TONE_BADGE[riskScore.tone] ?? 'neutral'} className="mt-1">
          {riskScore.label}
        </Badge>
        <p className="mt-2 max-w-[15rem] text-xs leading-relaxed text-ink-500">{riskScore.description}</p>
      </div>
    </Card>
  );
}
