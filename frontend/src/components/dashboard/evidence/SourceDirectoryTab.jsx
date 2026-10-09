import { useState } from 'react';
import { ExternalLink, Check } from 'lucide-react';
import { Card } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { StarRating } from '../../ui/StarRating';
import { cn } from '../../../lib/cn';

const STATUS_TONE = { verified: 'success', partial: 'warning', unverified: 'neutral' };
const STATUS_LABEL = { verified: 'Verified', partial: 'Partial', unverified: 'Unverified' };
const TYPE_TONE = { primary: 'brand', secondary: 'neutral', other: 'neutral' };

export function SourceDirectoryTab({ sources }) {
  const [selectedName, setSelectedName] = useState(sources[0]?.name);
  const selected = sources.find((s) => s.name === selectedName) ?? sources[0];

  if (sources.length === 0) {
    return <Card className="p-10 text-center text-sm text-ink-500">No sources recorded.</Card>;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
      <Card className="overflow-x-auto p-6">
        <p className="text-sm font-bold text-ink-900">Source Directory</p>
        <p className="mt-1 text-sm text-ink-500">All data sources used in the analysis.</p>

        <table className="mt-4 w-full min-w-[560px] text-left text-sm">
          <thead>
            <tr className="border-b border-ink-100 text-xs font-medium text-ink-400">
              <th className="py-2 pr-3 font-medium">Source</th>
              <th className="py-2 pr-3 font-medium">Type</th>
              <th className="py-2 pr-3 font-medium">Reliability</th>
              <th className="py-2 pr-3 font-medium">Data Period</th>
              <th className="py-2 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {sources.map((source) => (
              <tr
                key={source.name}
                onClick={() => setSelectedName(source.name)}
                className={cn('cursor-pointer transition-colors', selected?.name === source.name ? 'bg-brand-50' : 'hover:bg-ink-50')}
              >
                <td className="py-2.5 pr-3">
                  <p className="font-medium text-ink-700">{source.name}</p>
                  <p className="text-xs text-ink-400">{source.category}</p>
                </td>
                <td className="py-2.5 pr-3">
                  <Badge tone={TYPE_TONE[source.type]}>{source.type}</Badge>
                </td>
                <td className="py-2.5 pr-3">
                  <StarRating value={source.reliability} />
                </td>
                <td className="py-2.5 pr-3 text-ink-600">{source.data_period ?? '—'}</td>
                <td className="py-2.5">
                  <Badge tone={STATUS_TONE[source.status]}>{STATUS_LABEL[source.status]}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {selected && (
        <Card className="p-6">
          <p className="text-xs font-bold uppercase tracking-wide text-ink-500">Source Details</p>
          <p className="mt-2 text-lg font-bold leading-snug text-ink-900">{selected.name}</p>

          <div className="mt-4 space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-ink-500">Type</span>
              <Badge tone={TYPE_TONE[selected.type]}>{selected.type}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-ink-500">Category</span>
              <span className="font-medium text-ink-800">{selected.category}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-ink-500">Reliability</span>
              <StarRating value={selected.reliability} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-ink-500">Data Period</span>
              <span className="font-medium text-ink-800">{selected.data_period ?? '—'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-ink-500">Last Used</span>
              <span className="font-medium text-ink-800">{selected.last_used ?? '—'}</span>
            </div>
          </div>

          {selected.url && (
            <a
              href={selected.url}
              target="_blank"
              rel="noreferrer"
              className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-ink-200 px-4 py-2.5 text-sm font-semibold text-ink-700 transition-colors hover:bg-ink-50"
            >
              View Document
              <ExternalLink className="size-3.5" />
            </a>
          )}

          {selected.provides?.length > 0 && (
            <div className="mt-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">What This Source Provides</p>
              <div className="mt-2 grid grid-cols-2 gap-1.5">
                {selected.provides.map((item) => (
                  <span key={item} className="flex items-center gap-1.5 text-xs text-ink-600">
                    <Check className="size-3 text-green-500" />
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {selected.why_trusted && (
            <div className="mt-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">Why This Source Is Used</p>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-600">{selected.why_trusted}</p>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
