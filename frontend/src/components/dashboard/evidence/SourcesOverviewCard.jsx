import { Card } from '../../ui/Card';

function formatDate(iso) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function SourcesOverviewCard({ overview }) {
  return (
    <Card className="p-5">
      <p className="text-xs font-bold uppercase tracking-wide text-ink-500">Sources Overview</p>
      <div className="mt-3 flex items-baseline gap-2">
        <span className="font-mono text-4xl font-extrabold text-ink-900">{overview.total}</span>
        <span className="text-sm text-ink-500">Total Sources</span>
      </div>
      <div className="mt-4 space-y-1.5 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-ink-500">Primary Sources</span>
          <span className="font-mono font-semibold text-ink-900">{overview.primary}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-ink-500">Secondary Sources</span>
          <span className="font-mono font-semibold text-ink-900">{overview.secondary}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-ink-500">Other Sources</span>
          <span className="font-mono font-semibold text-ink-900">{overview.other}</span>
        </div>
      </div>
      {overview.lastVerified && (
        <p className="mt-3 text-xs text-ink-400">Last verified: {formatDate(overview.lastVerified)}</p>
      )}
    </Card>
  );
}
