import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { HeroSection } from '../components/landing/HeroSection';
import { HowItWorksSection } from '../components/landing/HowItWorksSection';
import { ValuePropsSection } from '../components/landing/ValuePropsSection';
import { MethodologyStats } from '../components/landing/MethodologyStats';
import { FinalCtaSection } from '../components/landing/FinalCtaSection';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-ink-50">
      <Navbar />
      <main>
        <HeroSection />
        <HowItWorksSection />
        <ValuePropsSection />
        <MethodologyStats />
        <FinalCtaSection />
      </main>
      <Footer />
    </div>
  );
}
