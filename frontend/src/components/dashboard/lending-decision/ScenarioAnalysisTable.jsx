import { Card } from '../../ui/Card';
import { Badge } from '../../ui/Badge';

export function ScenarioAnalysisTable({ scenarios }) {
  return (
    <Card className="p-6">
      <p className="text-sm font-bold text-ink-900">Scenario Analysis</p>
      <p className="mt-1 text-sm text-ink-500">Impact on risk rating under different revenue scenarios.</p>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead>
            <tr className="border-b border-ink-100 text-xs font-medium text-ink-400">
              <th className="py-2 pr-3 font-medium">Scenario</th>
              <th className="py-2 pr-3 font-medium">Risk Rating</th>
              <th className="py-2 pr-3 font-medium">Score Impact</th>
              <th className="py-2 font-medium">Comments</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {scenarios.map((scenario) => (
              <tr key={scenario.key}>
                <td className="py-2.5 pr-3 font-medium text-ink-700">{scenario.label}</td>
                <td className="py-2.5 pr-3">
                  <Badge tone={scenario.riskRating.tone}>
                    {scenario.riskRating.grade} ({scenario.riskRating.label.split(' ')[0]})
                  </Badge>
                </td>
                <td className="py-2.5 pr-3 font-mono tabular-nums text-ink-600">
                  {scenario.impact == null ? '—' : `${scenario.impact >= 0 ? '+' : ''}${scenario.impact.toFixed(1)}`}
                </td>
                <td className="py-2.5 text-ink-500">{scenario.comment}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
