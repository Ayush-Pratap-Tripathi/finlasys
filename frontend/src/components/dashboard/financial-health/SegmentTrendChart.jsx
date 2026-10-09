import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar } from 'recharts';
import { SEGMENT_COLORS } from '../../../lib/constants';
import { formatIndianNumber } from '../../../lib/formatCurrency';

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  const total = payload.reduce((sum, entry) => sum + (entry.value ?? 0), 0);

  return (
    <div className="rounded-xl border border-ink-200 bg-white px-3 py-2 text-xs shadow-lg">
      <p className="mb-1 font-semibold text-ink-900">{label}</p>
      {payload
        .slice()
        .reverse()
        .map((entry) => (
          <p key={entry.dataKey} className="flex items-center justify-between gap-4 text-ink-600">
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full" style={{ backgroundColor: entry.color }} />
              {entry.dataKey}
            </span>
            <span className="font-mono font-semibold text-ink-900">₹{formatIndianNumber(entry.value)} Cr</span>
          </p>
        ))}
      <p className="mt-1 flex items-center justify-between gap-4 border-t border-ink-100 pt-1 text-ink-900">
        <span className="font-semibold">Total</span>
        <span className="font-mono font-semibold">₹{formatIndianNumber(total)} Cr</span>
      </p>
    </div>
  );
}

export function SegmentTrendChart({ data, segmentNames, height = 300 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
        <XAxis
          dataKey="fiscal_year"
          tick={{ fontSize: 12, fill: '#64748b' }}
          axisLine={{ stroke: '#e2e8f0' }}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 12, fill: '#64748b' }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => formatIndianNumber(v)}
          width={64}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f1f5f9' }} />
        <Legend
          iconType="circle"
          iconSize={8}
          formatter={(value) => <span className="text-xs text-ink-600">{value}</span>}
        />
        {segmentNames.map((name, index) => (
          <Bar key={name} dataKey={name} stackId="segments" fill={SEGMENT_COLORS[index % SEGMENT_COLORS.length]} radius={index === segmentNames.length - 1 ? [4, 4, 0, 0] : 0} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
