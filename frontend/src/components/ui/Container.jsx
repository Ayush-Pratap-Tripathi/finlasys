import { cn } from '../../lib/cn';

export function Container({ as: Component = 'div', className, children, ...props }) {
  return (
    <Component className={cn('mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10', className)} {...props}>
      {children}
    </Component>
  );
}
