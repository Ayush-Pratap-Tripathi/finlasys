import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { SEGMENT_COLORS } from '../../../lib/constants';
import { formatIndianNumber } from '../../../lib/formatCurrency';

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const entry = payload[0];

  return (
    <div className="rounded-xl border border-ink-200 bg-white px-3 py-2 text-xs shadow-lg">
      <p className="flex items-center gap-1.5 font-semibold text-ink-900">
        <span className="size-2 rounded-full" style={{ backgroundColor: entry.payload.fill }} />
        {entry.name}
      </p>
      <p className="mt-0.5 font-mono text-ink-600">
        ₹{formatIndianNumber(entry.value)} Cr ({entry.payload.sharePct?.toFixed(1)}%)
      </p>
    </div>
  );
}

export function SegmentMixChart({ rows, totalRevenueCr }) {
  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row">
      <div className="relative shrink-0">
        <ResponsiveContainer width={200} height={200}>
          <PieChart>
            <Pie
              data={rows}
              dataKey="revenueCr"
              nameKey="name"
              innerRadius={62}
              outerRadius={92}
              paddingAngle={2}
              strokeWidth={0}
            >
              {rows.map((row, index) => (
                <Cell key={row.name} fill={SEGMENT_COLORS[index % SEGMENT_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <p className="font-mono text-lg font-bold text-ink-900">₹{formatIndianNumber(Math.round(totalRevenueCr))} Cr</p>
          <p className="text-xs text-ink-500">Total Revenue</p>
        </div>
      </div>

      <div className="w-full min-w-0 space-y-2.5">
        {rows.map((row, index) => (
          <div key={row.name} className="flex items-center justify-between gap-3 text-sm">
            <span className="flex min-w-0 items-center gap-2 text-ink-700">
              <span
                className="size-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: SEGMENT_COLORS[index % SEGMENT_COLORS.length] }}
              />
              <span className="truncate">{row.name}</span>
            </span>
            <span className="shrink-0 font-mono text-ink-900">₹{formatIndianNumber(row.revenueCr)} Cr</span>
            <span className="w-12 shrink-0 text-right font-mono text-ink-500">{row.sharePct?.toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
