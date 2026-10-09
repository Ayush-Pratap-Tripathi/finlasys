import { useCountUp } from '../../hooks/useCountUp';

export function StatCounter({ value, decimals = 0, prefix = '', suffix = '', label }) {
  const { ref, display } = useCountUp(value);

  return (
    <div ref={ref} className="text-center">
      <p className="font-mono text-4xl font-bold tabular-nums text-brand-700 sm:text-5xl">
        {prefix}
        {display.toFixed(decimals)}
        {suffix}
      </p>
      <p className="mt-2 text-sm font-medium text-ink-500">{label}</p>
    </div>
  );
}
