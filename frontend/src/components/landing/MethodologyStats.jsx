import { StatCounter } from '../ui/StatCounter';
import { Container } from '../ui/Container';

const STATS = [
  { value: 5, suffix: '', label: 'Years of financial history' },
  { value: 3, suffix: '+', label: 'Risk signals surfaced, minimum' },
  { value: 100, suffix: '%', label: 'Figures traced to a source' },
  { value: 60, suffix: '+', label: 'Data points per company' },
];

export function MethodologyStats() {
  return (
    <section className="bg-ink-900 py-16 sm:py-20">
      <Container className="grid grid-cols-2 gap-8 lg:grid-cols-4">
        {STATS.map((stat) => (
          <StatCounterDark key={stat.label} {...stat} />
        ))}
      </Container>
    </section>
  );
}

function StatCounterDark({ value, suffix, label }) {
  return (
    <div className="[&_p:first-child]:text-brand-400 [&_p:last-child]:text-ink-300">
      <StatCounter value={value} suffix={suffix} label={label} />
    </div>
  );
}
