import { ArrowRight } from 'lucide-react';
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';
import { Reveal } from '../ui/Reveal';

export function FinalCtaSection() {
  return (
    <section className="py-20 sm:py-28">
      <Container>
        <Reveal className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 to-brand-800 px-8 py-14 text-center sm:px-16">
          <div
            className="pointer-events-none absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                'radial-gradient(circle at 20% 20%, white 0%, transparent 40%), radial-gradient(circle at 80% 80%, white 0%, transparent 40%)',
            }}
            aria-hidden="true"
          />
          <h2 className="relative text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to evaluate your next borrower?
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-brand-100">
            Name a company and a loan amount. Get back a research dossier you can actually defend
            in a credit committee.
          </p>
          <div className="relative mt-8">
            <Button as="a" href="#start-analysis" variant="secondary" size="lg">
              Start Credit Analysis
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
