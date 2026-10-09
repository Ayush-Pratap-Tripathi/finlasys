import { Card } from '../../ui/Card';

export function KeyConditionsCard({ conditions }) {
  return (
    <Card className="p-6">
      <p className="text-sm font-bold text-ink-900">Key Conditions</p>
      <p className="mt-1 text-sm text-ink-500">Conditions precedent to disbursement.</p>

      <ol className="mt-4 space-y-3">
        {conditions.map((condition, index) => (
          <li key={condition} className="flex items-start gap-3">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">
              {index + 1}
            </span>
            <p className="text-sm leading-relaxed text-ink-700">{condition}</p>
          </li>
        ))}
      </ol>

      <p className="mt-4 text-xs text-ink-400">All conditions must be fulfilled before disbursement.</p>
    </Card>
  );
}
