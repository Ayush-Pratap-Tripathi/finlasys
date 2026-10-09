import { Loader2, AlertTriangle } from 'lucide-react';
import { Card } from '../ui/Card';

/**
 * Shared loading/error placeholder for a dashboard page's analysis fetch
 * (see hooks/usePageAnalysis.js). Every page now renders nothing until its
 * dedicated backend endpoint responds, since that's the only place the
 * numbers are computed.
 */
export function AnalysisState({ status, error, children }) {
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center p-16">
        <Card className="flex items-center gap-3 px-6 py-4">
          <Loader2 className="size-5 animate-spin text-brand-600" />
          <p className="text-sm font-medium text-ink-600">Crunching the numbers…</p>
        </Card>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex items-center justify-center p-16">
        <Card className="flex max-w-md flex-col items-center gap-2 p-6 text-center">
          <AlertTriangle className="size-6 text-red-500" />
          <p className="text-sm font-semibold text-ink-900">Couldn't load this analysis</p>
          <p className="text-sm text-ink-500">{error?.message || 'Something went wrong.'}</p>
        </Card>
      </div>
    );
  }

  return children;
}
