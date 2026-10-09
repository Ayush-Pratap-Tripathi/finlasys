import { ClipboardCheck } from 'lucide-react';
import { Card } from '../../ui/Card';

export function NextStepsCard({ steps }) {
  return (
    <Card className="p-6">
      <p className="text-sm font-bold text-ink-900">Next Steps</p>
      <p className="mt-1 text-sm text-ink-500">Post-approval actions.</p>

      <ol className="mt-4 space-y-3">
        {steps.map((step, index) => (
          <li key={step} className="flex items-start gap-3">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">
              {index + 1}
            </span>
            <p className="text-sm leading-relaxed text-ink-700">{step}</p>
          </li>
        ))}
      </ol>

      <div className="mt-4 flex justify-center text-ink-200">
        <ClipboardCheck className="size-10" />
      </div>
    </Card>
  );
}
