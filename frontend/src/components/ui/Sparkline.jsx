const WIDTH = 100;
const HEIGHT = 28;
const PADDING = 3;

/** Minimal inline-SVG trend line for a series of numbers - no charting library needed for a decorative trend indicator. */
export function Sparkline({ values, color = '#2563eb', className }) {
  const clean = (values || []).filter((v) => typeof v === 'number' && !Number.isNaN(v));
  if (clean.length < 2) return null;

  const min = Math.min(...clean);
  const max = Math.max(...clean);
  const range = max - min || 1;

  const points = clean.map((value, index) => {
    const x = PADDING + (index / (clean.length - 1)) * (WIDTH - PADDING * 2);
    const y = HEIGHT - PADDING - ((value - min) / range) * (HEIGHT - PADDING * 2);
    return [x, y];
  });

  const path = points.map(([x, y]) => `${x},${y}`).join(' ');
  const [lastX, lastY] = points[points.length - 1];

  return (
    <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className={className} preserveAspectRatio="none">
      <polyline points={path} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={lastX} cy={lastY} r="2.5" fill={color} />
    </svg>
  );
}
