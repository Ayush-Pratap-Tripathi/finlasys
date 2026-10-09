import { cn } from '../../lib/cn';

export function Logo({ className, markClassName, wordmarkClassName }) {
  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <span
        className={cn(
          'flex h-8 w-8 items-end justify-center gap-0.5 rounded-lg bg-brand-600 p-1.5',
          markClassName
        )}
        aria-hidden="true"
      >
        <span className="h-[40%] w-1 rounded-full bg-white" />
        <span className="h-[70%] w-1 rounded-full bg-white" />
        <span className="h-full w-1 rounded-full bg-white" />
      </span>
      <span className={cn('text-lg font-bold tracking-tight text-ink-900', wordmarkClassName)}>
        Finlasys
      </span>
    </span>
  );
}
