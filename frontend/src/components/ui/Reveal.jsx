import { motion } from 'framer-motion';

/**
 * Generic scroll-reveal wrapper: fades and lifts its children into place the
 * first time they enter the viewport. Used across sections instead of every
 * section hand-rolling its own whileInView animation.
 */
export function Reveal({ children, delay = 0, y = 24, className, as = 'div', ...props }) {
  const MotionTag = motion[as] ?? motion.div;

  return (
    <MotionTag
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
      {...props}
    >
      {children}
    </MotionTag>
  );
}
