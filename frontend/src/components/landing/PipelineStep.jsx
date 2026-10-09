import { Reveal } from '../ui/Reveal';

export function PipelineStep({ index, label, description, delay = 0 }) {
  return (
    <Reveal delay={delay} className="relative flex flex-col items-start gap-3">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-600 font-mono text-sm font-bold text-white">
        {index}
      </span>
      <div>
        <p className="font-semibold text-ink-900">{label}</p>
        <p className="mt-1 text-sm leading-relaxed text-ink-500">{description}</p>
      </div>
    </Reveal>
  );
}
