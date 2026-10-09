import { ShieldCheck } from 'lucide-react';
import { Card } from '../../ui/Card';
import { Badge } from '../../ui/Badge';

const TONE_ICON_BG = { success: 'bg-green-100 text-green-600', warning: 'bg-amber-100 text-amber-600', danger: 'bg-red-100 text-red-600' };
const TONE_DESCRIPTION = {
  success: 'Reliable overall',
  warning: 'Usable, with some gaps to note',
  danger: 'Notable gaps - review before relying on this data',
};

export function DataQualitySummaryCard({ qualityScore, qualityCounts }) {
  return (
    <Card className="p-5">
      <p className="text-xs font-bold uppercase tracking-wide text-ink-500">Data Quality Summary</p>
      <div className="mt-3 flex items-center gap-3">
        <span className={`flex size-11 items-center justify-center rounded-full ${TONE_ICON_BG[qualityScore.tone]}`}>
          <ShieldCheck className="size-5" />
        </span>
        <div>
          <Badge tone={qualityScore.tone}>{qualityScore.label}</Badge>
          <p className="mt-1 text-xs text-ink-500">{TONE_DESCRIPTION[qualityScore.tone]}</p>
        </div>
      </div>
      <div className="mt-4 space-y-1.5 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-ink-500">High Quality</span>
          <span className="font-mono font-semibold text-green-600">{qualityCounts.high}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-ink-500">Medium Quality</span>
          <span className="font-mono font-semibold text-amber-600">{qualityCounts.medium}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-ink-500">Low Quality</span>
          <span className="font-mono font-semibold text-red-600">{qualityCounts.low}</span>
        </div>
      </div>
    </Card>
  );
}
