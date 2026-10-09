import { SEGMENT_COLORS } from '../../../lib/constants';
import { formatIndianNumber } from '../../../lib/formatCurrency';

export function SegmentPerformanceTable({ rows, totalRevenueCr, totalEbitdaCr }) {
  const totalMarginPct = totalRevenueCr ? (totalEbitdaCr / totalRevenueCr) * 100 : null;

  return (
    <div className="overflow-x-auto">
      <table className="w-full table-fixed text-left text-xs">
        <colgroup>
          <col className="w-[26%]" />
          <col className="w-[15%]" />
          <col className="w-[15%]" />
          <col className="w-[15%]" />
          <col className="w-[14%]" />
          <col className="w-[15%]" />
        </colgroup>
        <thead>
          <tr className="border-b border-ink-100 font-medium text-ink-400">
            <th className="py-2 pr-1 font-medium">Segment</th>
            <th className="py-2 pr-1 text-right font-medium" title="Revenue (₹ Cr)">
              Revenue
            </th>
            <th className="py-2 pr-1 text-right font-medium" title="% of Total Revenue">
              % Rev.
            </th>
            <th className="py-2 pr-1 text-right font-medium" title="EBITDA (₹ Cr)">
              EBITDA
            </th>
            <th className="py-2 pr-1 text-right font-medium" title="EBITDA Margin (%)">
              Margin
            </th>
            <th className="py-2 text-right font-medium" title="YoY Revenue Growth (%)">
              YoY
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-ink-100">
          {rows.map((row, index) => (
            <tr key={row.name}>
              <td className="py-2.5 pr-1 font-medium text-ink-700">
                <span className="flex items-center gap-1.5">
                  <span
                    className="size-2 shrink-0 rounded-full"
                    style={{ backgroundColor: SEGMENT_COLORS[index % SEGMENT_COLORS.length] }}
                  />
                  <span className="truncate" title={row.name}>
                    {row.name}
                  </span>
                </span>
              </td>
              <td className="py-2.5 pr-1 text-right font-mono tabular-nums text-ink-900">
                {formatIndianNumber(row.revenueCr)}
              </td>
              <td className="py-2.5 pr-1 text-right font-mono tabular-nums text-ink-900">{row.sharePct?.toFixed(1)}%</td>
              <td className="py-2.5 pr-1 text-right font-mono tabular-nums text-ink-900">
                {row.ebitdaCr != null ? formatIndianNumber(row.ebitdaCr) : '—'}
              </td>
              <td className="py-2.5 pr-1 text-right font-mono tabular-nums text-ink-900">
                {row.marginPct != null ? `${row.marginPct.toFixed(1)}%` : '—'}
              </td>
              <td className="py-2.5 text-right font-mono tabular-nums text-ink-900">
                {row.yoyGrowthPct != null ? (
                  <span className={row.yoyGrowthPct >= 0 ? 'text-green-600' : 'text-red-600'}>
                    {row.yoyGrowthPct >= 0 ? '↑' : '↓'}
                    {Math.abs(row.yoyGrowthPct).toFixed(1)}%
                  </span>
                ) : (
                  '—'
                )}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t border-ink-200 font-semibold text-ink-900">
            <td className="py-2.5 pr-1">Total</td>
            <td className="py-2.5 pr-1 text-right font-mono tabular-nums">{formatIndianNumber(Math.round(totalRevenueCr))}</td>
            <td className="py-2.5 pr-1 text-right font-mono tabular-nums">100%</td>
            <td className="py-2.5 pr-1 text-right font-mono tabular-nums">{formatIndianNumber(Math.round(totalEbitdaCr))}</td>
            <td className="py-2.5 pr-1 text-right font-mono tabular-nums">
              {totalMarginPct != null ? `${totalMarginPct.toFixed(1)}%` : '—'}
            </td>
            <td className="py-2.5" />
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
