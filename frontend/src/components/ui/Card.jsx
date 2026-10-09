import { cn } from '../../lib/cn';

export function Card({ as: Component = 'div', className, children, ...props }) {
  return (
    <Component
      className={cn('rounded-2xl border border-ink-200 bg-white shadow-sm', className)}
      {...props}
    >
      {children}
    </Component>
  );
}
