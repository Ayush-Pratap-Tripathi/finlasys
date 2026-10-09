import { Card } from '../../ui/Card';

export function ChartCard({ title, description, children, footer }) {
  return (
    <Card className="p-6">
      <p className="text-sm font-bold text-ink-900">{title}</p>
      {description && <p className="mt-1 text-sm text-ink-500">{description}</p>}
      <div className="mt-4">{children}</div>
      {footer && <div className="mt-3 text-sm">{footer}</div>}
    </Card>
  );
}
