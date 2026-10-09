import { Container } from '../ui/Container';
import { SectionHeading } from '../ui/SectionHeading';
import { PipelineStep } from './PipelineStep';
import { ANALYSIS_PIPELINE } from '../../lib/constants';

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="How it works"
          title="One pipeline, from company to decision"
          subtitle="Every analysis follows the same traceable path, so a recommendation can always be walked back to the evidence behind it."
        />

        <div className="relative mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-6">
          <div className="absolute top-5 left-0 right-0 hidden h-px bg-ink-200 lg:block" />
          {ANALYSIS_PIPELINE.map((step, index) => (
            <PipelineStep
              key={step.key}
              index={index + 1}
              label={step.label}
              description={step.description}
              delay={index * 0.08}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
