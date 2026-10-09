import { motion } from 'framer-motion';
import { cn } from '../../lib/cn';

/** Small selectable pill used for quick-pick options (companies, loan presets). */
export function Chip({ active = false, className, children, ...props }) {
  return (
    <motion.button
      type="button"
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.96 }}
      className={cn(
        'rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors',
        active
          ? 'border-brand-600 bg-brand-50 text-brand-700'
          : 'border-ink-200 bg-white text-ink-600 hover:border-brand-300 hover:text-brand-700',
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}
