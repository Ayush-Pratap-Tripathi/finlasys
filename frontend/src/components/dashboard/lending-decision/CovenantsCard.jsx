import { Check } from 'lucide-react';
import { Card } from '../../ui/Card';

export function CovenantsCard({ covenants }) {
  return (
    <Card className="p-6">
      <p className="text-sm font-bold text-ink-900">Covenants</p>
      <p className="mt-1 text-sm text-ink-500">Key covenants and monitoring requirements.</p>

      <ul className="mt-4 space-y-2.5">
        {covenants.map((covenant) => (
          <li key={covenant} className="flex items-start gap-2.5 text-sm text-ink-700">
            <Check className="mt-0.5 size-4 shrink-0 text-green-500" />
            {covenant}
          </li>
        ))}
      </ul>
    </Card>
  );
}
