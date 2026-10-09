import { Star } from 'lucide-react';

export function StarRating({ value, max = 5 }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {Array.from({ length: max }, (_, i) => (
        <Star
          key={i}
          className={`size-3.5 ${i < value ? 'fill-amber-400 text-amber-400' : 'fill-ink-200 text-ink-200'}`}
        />
      ))}
    </span>
  );
}
