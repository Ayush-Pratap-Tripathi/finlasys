import { Card } from '../../ui/Card';

export function ScorecardSummaryTable({ scorecard }) {
  return (
    <Card className="p-6">
      <p className="text-sm font-bold text-ink-900">Scorecard Summary</p>
      <p className="mt-1 text-sm text-ink-500">Weighted score across key evaluation criteria.</p>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full table-fixed text-left text-sm">
          <colgroup>
            <col className="w-[30%]" />
            <col className="w-[14%]" />
            <col className="w-[34%]" />
            <col className="w-[22%]" />
          </colgroup>
          <thead>
            <tr className="border-b border-ink-100 text-xs font-medium text-ink-400">
              <th className="py-2 pr-2 font-medium">Criteria</th>
              <th className="py-2 pr-2 text-right font-medium">Weight</th>
              <th className="py-2 pr-2 font-medium">Score</th>
              <th className="py-2 text-right font-medium">Weighted</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {scorecard.rows.map((row) => (
              <tr key={row.key}>
                <td className="py-2.5 pr-2 font-medium text-ink-700">{row.label}</td>
                <td className="py-2.5 pr-2 text-right font-mono tabular-nums text-ink-600">{row.weight}%</td>
                <td className="py-2.5 pr-2">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-ink-100">
                      <div className="h-full rounded-full bg-brand-600" style={{ width: `${row.score}%` }} />
                    </div>
                    <span className="w-7 shrink-0 font-mono tabular-nums text-ink-900">{row.score}</span>
                  </div>
                </td>
                <td className="py-2.5 text-right font-mono tabular-nums text-ink-900">{row.weightedScore.toFixed(1)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-ink-200 font-bold text-ink-900">
              <td className="py-2.5 pr-2">Total Score</td>
              <td className="py-2.5 pr-2 text-right font-mono tabular-nums">100%</td>
              <td className="py-2.5 pr-2" />
              <td className="py-2.5 text-right font-mono tabular-nums text-green-600">{scorecard.totalScore.toFixed(1)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </Card>
  );
}
