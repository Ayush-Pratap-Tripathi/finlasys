import { motion } from 'framer-motion';

const TONE_COLORS = {
  success: '#16a34a',
  warning: '#d97706',
  danger: '#dc2626',
  neutral: '#94a3b8',
};

/** Circular 0-100 progress ring used for the financial health score. */
export function CircularGauge({ value, tone = 'neutral', size = 140, strokeWidth = 12, children }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedValue = Math.min(100, Math.max(0, value));
  const offset = circumference * (1 - clampedValue / 100);
  const color = TONE_COLORS[tone] ?? TONE_COLORS.neutral;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#e2e8f0" strokeWidth={strokeWidth} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">{children}</div>
    </div>
  );
}
