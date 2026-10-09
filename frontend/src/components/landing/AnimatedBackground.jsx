import { useEffect, useRef } from 'react';
import gsap from 'gsap';

/**
 * Slow-drifting gradient mesh behind the hero. Built with GSAP rather than
 * Framer Motion because this is a continuous, indefinite ambient loop fully
 * decoupled from any component state or user interaction - exactly the
 * imperative, "set it running and forget it" job GSAP timelines suit best.
 */
export function AnimatedBackground() {
  const scope = useRef(null);

  useEffect(() => {
    const ctx = gsap.context((self) => {
      const blobs = self.selector('.gradient-blob');

      blobs.forEach((blob, index) => {
        gsap.to(blob, {
          x: index % 2 === 0 ? 60 : -60,
          y: index % 2 === 0 ? -40 : 40,
          scale: 1.15,
          duration: 8 + index * 2,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          delay: index * 0.6,
        });
      });
    }, scope);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={scope}
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      <div className="gradient-blob absolute -left-24 -top-24 h-96 w-96 rounded-full bg-brand-300/40 blur-3xl" />
      <div className="gradient-blob absolute right-0 top-10 h-[28rem] w-[28rem] rounded-full bg-indigo-300/30 blur-3xl" />
      <div className="gradient-blob absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-cyan-200/40 blur-3xl" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,transparent_0%,white_75%)]" />
    </div>
  );
}
