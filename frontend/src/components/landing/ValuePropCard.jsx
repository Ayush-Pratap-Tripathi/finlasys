import { motion } from 'framer-motion';
import { CalendarRange, Scale, Link2, FlaskConical } from 'lucide-react';
import { Card } from '../ui/Card';
import { Reveal } from '../ui/Reveal';

const ICONS = {
  'multi-year': CalendarRange,
  discrepancies: Scale,
  traceability: Link2,
  assumptions: FlaskConical,
};

export function ValuePropCard({ propKey, title, description, delay = 0 }) {
  const Icon = ICONS[propKey];

  return (
    <Reveal delay={delay}>
      <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
        <Card className="h-full p-6">
          <span className="flex size-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
            <Icon className="size-5" />
          </span>
          <p className="mt-4 font-semibold text-ink-900">{title}</p>
          <p className="mt-2 text-sm leading-relaxed text-ink-500">{description}</p>
        </Card>
      </motion.div>
    </Reveal>
  );
}
