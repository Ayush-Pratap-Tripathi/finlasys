import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Card } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { CircularGauge } from '../../ui/CircularGauge';

const TONE_BADGE = { success: 'success', warning: 'warning', danger: 'danger' };

const SCALE_STOPS = [0, 25, 50, 75, 100];

function describeScore(healthScore) {
  if (healthScore.tone === 'success') {
    return 'Financials show consistent profitability, manageable leverage and healthy cash generation.';
  }
  if (healthScore.tone === 'warning') {
    return 'Financial position is workable but shows pressure in one or more areas below - worth monitoring.';
  }
  return 'Financial position shows material weakness across profitability, leverage, coverage or cash generation.';
}

export function FinancialHealthScoreCard({ healthScore }) {
  const [showMethodology, setShowMethodology] = useState(false);

  return (
    <Card className="p-6">
      <p className="text-xs font-bold uppercase tracking-wide text-ink-500">Financial Health Score</p>

      <div className="mt-4 flex items-center gap-6">
        <CircularGauge value={healthScore.score} tone={healthScore.tone} size={128} strokeWidth={11}>
          <span className="font-mono text-3xl font-extrabold text-ink-900">{healthScore.score}</span>
          <span className="absolute bottom-9 text-xs font-medium text-ink-400">/100</span>
        </CircularGauge>

        <div>
          <p className="text-xs font-medium text-ink-500">Overall Assessment</p>
          <Badge tone={TONE_BADGE[healthScore.tone] ?? 'neutral'} className="mt-1">
            {healthScore.label}
          </Badge>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-ink-500">{describeScore(healthScore)}</p>
        </div>
      </div>

      <div className="mt-5">
        <div className="h-1.5 rounded-full bg-gradient-to-r from-red-400 via-amber-400 to-green-500" />
        <div className="relative mt-1 h-4">
          <div
            className="absolute -top-2.5 size-3 -translate-x-1/2 rounded-full border-2 border-white bg-ink-900 shadow"
            style={{ left: `${healthScore.score}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-ink-400">
          {SCALE_STOPS.map((stop) => (
            <span key={stop}>{stop}</span>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={() => setShowMethodology((open) => !open)}
        className="mt-3 flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700"
      >
        How is this score calculated?
        <ChevronDown className={`size-3.5 transition-transform ${showMethodology ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence initial={false}>
        {showMethodology && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <ul className="mt-3 space-y-1.5 rounded-xl bg-ink-50 p-3 text-xs text-ink-600">
              <li>
                <strong className="text-ink-800">Profitability (35pts):</strong> EBITDA margin level, plus a bonus
                if margin expanded year-over-year.
              </li>
              <li>
                <strong className="text-ink-800">Leverage (25pts):</strong> net debt relative to EBITDA - a net-cash
                position scores full marks.
              </li>
              <li>
                <strong className="text-ink-800">Interest coverage (20pts):</strong> EBITDA divided by interest
                expense.
              </li>
              <li>
                <strong className="text-ink-800">Cash conversion (20pts):</strong> operating cash flow as a share of
                EBITDA.
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
