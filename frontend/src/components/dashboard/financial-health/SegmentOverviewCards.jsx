import { Card } from '../../ui/Card';
import { formatIndianNumber } from '../../../lib/formatCurrency';

export function SegmentOverviewCards({ summary }) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <Card className="p-4">
        <p className="text-xs font-medium text-ink-500">Total Segments</p>
        <p className="mt-2 font-mono text-2xl font-bold text-ink-900">{summary.segmentCount}</p>
      </Card>

      <Card className="p-4">
        <p className="text-xs font-medium text-ink-500">Segment Revenue</p>
        <p className="mt-2 font-mono text-2xl font-bold text-ink-900">
          ₹{formatIndianNumber(Math.round(summary.totalRevenueCr))} Cr
        </p>
        {summary.totalRevenueYoyPct != null && (
          <p className={`mt-1 text-xs font-semibold ${summary.totalRevenueYoyPct >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {summary.totalRevenueYoyPct >= 0 ? '↑' : '↓'} {Math.abs(summary.totalRevenueYoyPct).toFixed(1)}% vs prior year
          </p>
        )}
      </Card>

      <Card className="p-4">
        <p className="text-xs font-medium text-ink-500">Highest Margin Segment</p>
        {summary.highestMarginSegment ? (
          <>
            <p className="mt-2 text-lg font-bold leading-tight text-ink-900">{summary.highestMarginSegment.name}</p>
            <p className="mt-1 text-xs font-semibold text-green-600">
              Margin: {summary.highestMarginSegment.marginPct.toFixed(1)}%
            </p>
          </>
        ) : (
          <p className="mt-2 text-sm text-ink-400">Not disclosed</p>
        )}
      </Card>

      <Card className="p-4">
        <p className="text-xs font-medium text-ink-500">Largest Segment</p>
        {summary.largestSegment ? (
          <>
            <p className="mt-2 text-lg font-bold leading-tight text-ink-900">{summary.largestSegment.name}</p>
            <p className="mt-1 text-xs text-ink-500">
              Revenue: ₹{formatIndianNumber(summary.largestSegment.revenueCr)} Cr · Share:{' '}
              {summary.largestSegment.sharePct?.toFixed(1)}%
            </p>
          </>
        ) : (
          <p className="mt-2 text-sm text-ink-400">—</p>
        )}
      </Card>
    </div>
  );
}
