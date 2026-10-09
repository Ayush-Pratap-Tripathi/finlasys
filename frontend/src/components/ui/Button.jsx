import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/cn';

const VARIANT_CLASSES = {
  primary:
    'bg-brand-600 text-white shadow-lg shadow-brand-600/25 hover:bg-brand-700 focus-visible:outline-brand-600',
  secondary:
    'bg-white text-ink-900 border border-ink-200 hover:border-ink-300 hover:bg-ink-50 focus-visible:outline-ink-400',
  ghost: 'bg-transparent text-ink-700 hover:bg-ink-100 focus-visible:outline-ink-400',
};

const SIZE_CLASSES = {
  md: 'px-4 py-2.5 text-sm gap-2',
  lg: 'px-6 py-3.5 text-base gap-2.5',
};

/**
 * Base interactive button used everywhere in the app. Wraps motion.button
 * so every button in the product gets the same subtle press/hover feel for
 * free, instead of each call site re-implementing it.
 */
export function Button({
  as = 'button',
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className,
  children,
  ...props
}) {
  const Component = motion[as] ?? motion.button;
  const isDisabled = disabled || loading;

  return (
    <Component
      whileHover={isDisabled ? undefined : { scale: 1.02 }}
      whileTap={isDisabled ? undefined : { scale: 0.98 }}
      {...(as === 'button' ? { disabled: isDisabled } : {})}
      aria-disabled={isDisabled}
      className={cn(
        'inline-flex items-center justify-center rounded-xl font-semibold transition-colors',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-60',
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        className
      )}
      {...props}
    >
      {loading && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
      {children}
    </Component>
  );
}
