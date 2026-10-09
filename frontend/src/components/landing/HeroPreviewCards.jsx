import { motion } from 'framer-motion';
import { ShieldCheck, TrendingUp } from 'lucide-react';
import { Card } from '../ui/Card';

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15, delayChildren: 0.3 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

function DecisionCard() {
  return (
    <Card className="w-52 animate-float p-4">
      <p className="text-xs font-medium text-ink-400">Lending Decision</p>
      <div className="mt-2 flex items-center gap-2">
        <span className="flex size-8 items-center justify-center rounded-full bg-green-100 text-green-600">
          <ShieldCheck className="size-4" />
        </span>
        <div>
          <p className="text-sm font-bold text-green-700">Approve</p>
          <p className="text-xs text-ink-400">Confidence 82%</p>
        </div>
      </div>
    </Card>
  );
}

function RiskGaugeCard() {
  const circumference = 2 * Math.PI * 26;
  const arc = circumference * 0.75;
  const progress = arc * 0.28;

  return (
    <Card className="w-44 animate-float-delayed p-4">
      <p className="text-xs font-medium text-ink-400">Risk Rating</p>
      <div className="mt-2 flex items-center gap-3">
        <svg width="60" height="60" viewBox="0 0 60 60" className="-rotate-[135deg]">
          <circle
            cx="30"
            cy="30"
            r="26"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="6"
            strokeDasharray={`${arc} ${circumference}`}
            strokeLinecap="round"
          />
          <circle
            cx="30"
            cy="30"
            r="26"
            fill="none"
            stroke="#16a34a"
            strokeWidth="6"
            strokeDasharray={`${progress} ${circumference}`}
            strokeLinecap="round"
          />
        </svg>
        <div>
          <p className="text-sm font-bold text-ink-900">Low</p>
          <p className="text-xs text-ink-400">Rating A</p>
        </div>
      </div>
    </Card>
  );
}

function TrendCard() {
  return (
    <Card className="w-56 animate-float p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-ink-400">EBITDA Margin</p>
        <span className="flex items-center gap-0.5 text-xs font-semibold text-green-600">
          <TrendingUp className="size-3" />
          +0.8pp
        </span>
      </div>
      <svg viewBox="0 0 180 48" className="mt-2 h-12 w-full">
        <polyline
          points="0,40 36,32 72,34 108,20 144,16 180,6"
          fill="none"
          stroke="#2563eb"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="180" cy="6" r="4" fill="#2563eb" />
      </svg>
    </Card>
  );
}

export function HeroPreviewCards() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="relative hidden h-[26rem] w-full lg:block"
    >
      <motion.div variants={cardVariants} className="absolute right-4 top-2">
        <DecisionCard />
      </motion.div>
      <motion.div variants={cardVariants} className="absolute left-0 top-40">
        <RiskGaugeCard />
      </motion.div>
      <motion.div variants={cardVariants} className="absolute bottom-4 right-8">
        <TrendCard />
      </motion.div>
    </motion.div>
  );
}
