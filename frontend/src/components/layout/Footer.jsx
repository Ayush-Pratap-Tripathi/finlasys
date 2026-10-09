import { Logo } from '../ui/Logo';
import { Container } from '../ui/Container';

export function Footer() {
  return (
    <footer className="border-t border-ink-200 bg-white">
      <Container className="flex flex-col items-center justify-between gap-4 py-8 sm:flex-row">
        <Logo wordmarkClassName="text-base" />
        <p className="text-sm text-ink-500">
          Built for credit analysts. Every recommendation traces back to its source.
        </p>
      </Container>
    </footer>
  );
}
