import { AnimatePresence, motion } from 'framer-motion';
import { Search } from 'lucide-react';

export function ResearchLoadingState({ message }) {
  return (
    <div className="flex flex-col items-center gap-4 py-6 text-center">
      <div className="relative flex size-14 items-center justify-center">
        <span className="absolute inset-0 rounded-full bg-brand-600/10 animate-pulse-ring" />
        <span className="relative flex size-14 items-center justify-center rounded-full bg-brand-600 text-white">
          <Search className="size-6" />
        </span>
      </div>

      <div className="h-5">
        <AnimatePresence mode="wait">
          <motion.p
            key={message}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}
            className="text-sm font-medium text-ink-600"
          >
            {message}
          </motion.p>
        </AnimatePresence>
      </div>

      <div className="h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-ink-100">
        <motion.div
          className="h-full w-1/3 rounded-full bg-brand-600"
          animate={{ x: ['-100%', '300%'] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <p className="text-xs text-ink-400">
        Deep research with live web search - this can take a few minutes.
      </p>
    </div>
  );
}
