import { cn } from '../../lib/cn';
import { Reveal } from './Reveal';

export function SectionHeading({ eyebrow, title, subtitle, align = 'center', className }) {
  return (
    <Reveal
      className={cn(
        'mx-auto max-w-2xl',
        align === 'center' ? 'text-center' : 'text-left',
        className
      )}
    >
      {eyebrow && (
        <span className="inline-flex items-center rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-700 ring-1 ring-inset ring-brand-200">
          {eyebrow}
        </span>
      )}
      <h2 className="mt-4 text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">{title}</h2>
      {subtitle && <p className="mt-4 text-lg leading-relaxed text-ink-500">{subtitle}</p>}
    </Reveal>
  );
}
