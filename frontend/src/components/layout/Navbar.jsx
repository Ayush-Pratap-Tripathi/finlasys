import { Logo } from '../ui/Logo';
import { Button } from '../ui/Button';
import { Container } from '../ui/Container';

const NAV_LINKS = [
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Methodology', href: '#methodology' },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-ink-200/70 bg-white/80 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between">
        <a href="#top" aria-label="Finlasys home">
          <Logo />
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-ink-600 transition-colors hover:text-ink-900"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <Button as="a" href="#start-analysis" size="md">
          Start Analysis
        </Button>
      </Container>
    </header>
  );
}
