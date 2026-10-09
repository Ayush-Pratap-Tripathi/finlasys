import {
  ResponsiveContainer,
  ComposedChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  Line,
} from 'recharts';

function CustomTooltip({ active, payload, label, series }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-xl border border-ink-200 bg-white px-3 py-2 text-xs shadow-lg">
      <p className="mb-1 font-semibold text-ink-900">{label}</p>
      {payload.map((entry) => {
        const config = series.find((s) => s.dataKey === entry.dataKey);
        return (
          <p key={entry.dataKey} className="flex items-center justify-between gap-4 text-ink-600">
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full" style={{ backgroundColor: entry.color }} />
              {config?.label ?? entry.dataKey}
            </span>
            <span className="font-mono font-semibold text-ink-900">
              {config?.valueFormatter ? config.valueFormatter(entry.value) : entry.value}
            </span>
          </p>
        );
      })}
    </div>
  );
}

/**
 * One reusable chart for every trend visualization on the Financial Health
 * page - a bar/line combo when `series` mixes types (e.g. Revenue bars with
 * EBITDA/Net Profit lines), or a pure multi-line chart when every series is
 * type "line" (e.g. margin trends). Avoids a bespoke chart component per
 * tab for what is structurally the same chart with different data.
 *
 * Pinned to recharts 2.x (see package.json) rather than 3.x: the 3.x
 * Redux-based sizing pipeline has a bug where ResponsiveContainer's
 * measured width never reaches the chart's rendered <svg> (charts render
 * at a fixed ~8px regardless of container size) - a known issue class
 * across recharts 3 releases. 2.x's simpler cloneElement-based sizing
 * doesn't have this problem.
 */
export function FinancialTrendChart({ data, series, height = 260, yAxisFormatter }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
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
          tickFormatter={yAxisFormatter}
          width={48}
        />
        <Tooltip content={<CustomTooltip series={series} />} cursor={{ fill: '#f1f5f9' }} />
        <Legend
          iconType="circle"
          iconSize={8}
          formatter={(value) => <span className="text-xs text-ink-600">{value}</span>}
        />
        {series.map((s) =>
          s.type === 'bar' ? (
            <Bar key={s.dataKey} dataKey={s.dataKey} name={s.label} fill={s.color} radius={[4, 4, 0, 0]} barSize={28} />
          ) : (
            <Line
              key={s.dataKey}
              type="monotone"
              dataKey={s.dataKey}
              name={s.label}
              stroke={s.color}
              strokeWidth={2.5}
              dot={{ r: 3.5, fill: s.color, strokeWidth: 0 }}
              activeDot={{ r: 5 }}
            />
          )
        )}
      </ComposedChart>
    </ResponsiveContainer>
  );
}
