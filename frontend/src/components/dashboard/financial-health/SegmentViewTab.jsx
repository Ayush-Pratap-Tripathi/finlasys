import { PieChart } from 'lucide-react';
import { Card } from '../../ui/Card';
import { ChartCard } from './ChartCard';
import { SegmentOverviewCards } from './SegmentOverviewCards';
import { SegmentTrendChart } from './SegmentTrendChart';
import { SegmentMixChart } from './SegmentMixChart';
import { SegmentPerformanceTable } from './SegmentPerformanceTable';

/**
 * Deliberately falls back to an honest "not available" state when a
 * company hasn't disclosed a segment breakdown - see
 * backend/src/schemas/creditAnalysisSchema.js: "segments" is only
 * populated when the company's own annual report discloses one, never
 * estimated or forced.
 */
function SegmentDataUnavailable() {
  return (
    <Card className="flex flex-col items-center gap-3 p-16 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-ink-100 text-ink-400">
        <PieChart className="size-6" />
      </span>
      <p className="font-semibold text-ink-900">No segment breakdown disclosed</p>
      <p className="max-w-md text-sm text-ink-500">
        This company's annual report doesn't disclose a business-segment or industry-vertical revenue
        breakdown (or it wasn't found during research) - rather than estimate a split, this tab is left empty.
      </p>
    </Card>
  );
}

export function SegmentViewTab({ segments }) {
  if (!segments) {
    return <SegmentDataUnavailable />;
  }

  const { summary, trendData, segmentNames } = segments;

  return (
    <div className="space-y-6">
      <SegmentOverviewCards summary={summary} />

      <ChartCard
        title={`Revenue by Segment Trend (${summary.fiscalYear})`}
        description="Segment-wise revenue across the researched years, stacked to show total revenue."
      >
        <SegmentTrendChart data={trendData} segmentNames={segmentNames} />
      </ChartCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title={`Segment Performance (${summary.fiscalYear})`}>
          <SegmentPerformanceTable rows={summary.rows} totalRevenueCr={summary.totalRevenueCr} totalEbitdaCr={summary.totalEbitdaCr} />
        </ChartCard>

        <ChartCard
          title={`Segment Mix (by Revenue)`}
          description={`Break-up of total revenue by segment for ${summary.fiscalYear}.`}
        >
          <SegmentMixChart rows={summary.rows} totalRevenueCr={summary.totalRevenueCr} />
        </ChartCard>
      </div>
    </div>
  );
}
