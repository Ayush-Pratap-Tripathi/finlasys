// Distinct, colorblind-reasonable palette for charts with multiple
// simultaneous series (e.g. segment breakdowns) where series count varies
// per company - cycled with modulo if a company reports more segments.
export const SEGMENT_COLORS = ['#2563eb', '#16a34a', '#7c3aed', '#d97706', '#0891b2', '#dc2626', '#4338ca', '#65a30d'];

export const POPULAR_COMPANIES = [
  'Tata Consultancy Services',
  'Infosys',
  'HDFC Bank',
  'Reliance Industries',
  'ICICI Bank',
  'Larsen & Toubro',
];

export const LOAN_AMOUNT_PRESETS = [
  { label: '₹25L', valueInr: 2_500_000 },
  { label: '₹50L', valueInr: 5_000_000 },
  { label: '₹1Cr', valueInr: 10_000_000 },
  { label: '₹2Cr', valueInr: 20_000_000 },
  { label: '₹5Cr', valueInr: 50_000_000 },
];

export const DEFAULT_LOAN_AMOUNT_INR = 10_000_000;

export const ANALYSIS_PIPELINE = [
  {
    key: 'company',
    label: 'Company',
    description: 'Pick any publicly listed Indian company by name or ticker.',
  },
  {
    key: 'financial-health',
    label: 'Financial Health',
    description: 'Five years of revenue, margins, cash flow and leverage trends.',
  },
  {
    key: 'risks',
    label: 'Risks',
    description: 'Signals like receivables outpacing revenue or weakening coverage.',
  },
  {
    key: 'evidence',
    label: 'Evidence',
    description: 'Every figure traced to a source, with discrepancies called out.',
  },
  {
    key: 'decision',
    label: 'Lending Decision',
    description: 'Approve, approve with conditions, or decline — with the reasoning shown.',
  },
];

export const VALUE_PROPS = [
  {
    key: 'multi-year',
    title: 'Multi-year financial trends',
    description:
      'Five years of consolidated financials plus the latest reported quarters, so a single strong year never hides a weakening trend.',
  },
  {
    key: 'discrepancies',
    title: 'Cross-source discrepancy detection',
    description:
      'When two sources disagree on a number, we show both values side by side and record why they diverge instead of silently picking one.',
  },
  {
    key: 'traceability',
    title: 'Every number traces to a source',
    description:
      'Filings, exchange data and corporate announcements are cited inline, so a recommendation can always be traced back to evidence.',
  },
  {
    key: 'assumptions',
    title: 'Assumptions made explicit',
    description:
      'Where data has to be estimated or normalised, the assumption, its reasoning and its confidence are recorded — never silently guessed.',
  },
];
