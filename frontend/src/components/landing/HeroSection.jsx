import { motion } from 'framer-motion';
import { FileSearch, ShieldCheck, GitCompareArrows } from 'lucide-react';
import { Container } from '../ui/Container';
import { Badge } from '../ui/Badge';
import { AnimatedBackground } from './AnimatedBackground';
import { HeroPreviewCards } from './HeroPreviewCards';
import { AnalysisRequestForm } from './AnalysisRequestForm';

const TRUST_POINTS = [
  { icon: FileSearch, label: '5-year financial history' },
  { icon: GitCompareArrows, label: 'Cross-source verification' },
  { icon: ShieldCheck, label: 'No black-box scoring' },
];

export function HeroSection() {
  return (
    <section id="top" className="relative overflow-hidden pb-20 pt-16 sm:pt-24">
      <AnimatedBackground />

      <Container className="relative grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-8">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <Badge tone="brand">Credit Intelligence Platform</Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="mt-5 text-4xl font-extrabold tracking-tight text-ink-900 sm:text-5xl lg:text-[3.25rem] lg:leading-[1.05]"
          >
            Would you lend them <span className="text-brand-600">₹1 Crore?</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mt-5 max-w-xl text-lg leading-relaxed text-ink-500"
          >
            Turn fragmented public filings into a defensible lending decision. Pick a company,
            name a loan amount, and get a source-traced credit dossier — not just another
            dashboard of numbers.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="mt-7 flex flex-wrap gap-x-6 gap-y-3"
          >
            {TRUST_POINTS.map(({ icon: Icon, label }) => (
              <span key={label} className="flex items-center gap-2 text-sm font-medium text-ink-600">
                <Icon className="size-4 text-brand-600" />
                {label}
              </span>
            ))}
          </motion.div>

          <HeroPreviewCards />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
        >
          <AnalysisRequestForm />
        </motion.div>
      </Container>
    </section>
  );
}
