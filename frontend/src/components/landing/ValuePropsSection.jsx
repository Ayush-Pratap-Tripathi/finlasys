import { Container } from '../ui/Container';
import { SectionHeading } from '../ui/SectionHeading';
import { ValuePropCard } from './ValuePropCard';
import { VALUE_PROPS } from '../../lib/constants';

export function ValuePropsSection() {
  return (
    <section id="methodology" className="bg-white py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="Methodology"
          title="Built to be defensible, not just impressive"
          subtitle="The goal isn't a bigger dashboard — it's a recommendation an analyst can actually stand behind."
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {VALUE_PROPS.map((prop, index) => (
            <ValuePropCard
              key={prop.key}
              propKey={prop.key}
              title={prop.title}
              description={prop.description}
              delay={index * 0.08}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
