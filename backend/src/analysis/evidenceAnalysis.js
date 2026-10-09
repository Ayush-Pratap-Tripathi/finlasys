const { latestAndPriorYear, netDebt, interestCoverageRatio } = require('./financialRatios');

/**
 * Everything the Evidence & Sources page needs, computed from the raw
 * research data rather than asked of the AI. In particular, per-metric
 * "quality" and the aggregate Data Quality score are NOT self-reported by
 * the model - they're derived from signals we can actually verify
 * (how many sources cite a figure, whether sources disagree, how reliable
 * those sources are) so the score can't be gamed by the AI just claiming
 * high confidence.
 */

function average(numbers) {
  const valid = numbers.filter((n) => n != null);
  return valid.length ? valid.reduce((sum, n) => sum + n, 0) / valid.length : null;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

// --- Sources overview -------------------------------------------------

function computeSourcesOverview(sourcesDirectory) {
  const lastVerified = sourcesDirectory.reduce(
    (latest, s) => (s.last_used && (!latest || s.last_used > latest) ? s.last_used : latest),
    null
  );

  return {
    total: sourcesDirectory.length,
    primary: sourcesDirectory.filter((s) => s.type === 'primary').length,
    secondary: sourcesDirectory.filter((s) => s.type === 'secondary').length,
    other: sourcesDirectory.filter((s) => s.type === 'other').length,
    lastVerified,
  };
}

// --- Data coverage ------------------------------------------------------

const COVERAGE_STATUS_SCORE = { Complete: 100, Available: 80, Partial: 50, Missing: 0 };

function computeCoverageSummary(data) {
  const hasAllYearsFinancials = data.annual.every((y) => y.revenue_cr != null && y.ebitda_cr != null && y.net_profit_cr != null);
  const hasSomeFinancials = data.annual.some((y) => y.revenue_cr != null);
  const hasExchangeFiling = data.sources_directory.some((s) => s.category === 'Exchange Filing');
  const hasAnnouncements = data.qualitative.recent_material_events.length > 0;
  const hasMarketData = data.market.price_inr != null;
  const hasOtherSources = data.sources_directory.some((s) => s.type === 'other' || s.category === 'Other Public Source');

  const categories = [
    { label: 'Financial Statements', status: hasAllYearsFinancials ? 'Complete' : hasSomeFinancials ? 'Partial' : 'Missing' },
    { label: 'Exchange Filings', status: hasExchangeFiling ? 'Complete' : 'Missing' },
    { label: 'Corporate Announcements', status: hasAnnouncements ? 'Available' : 'Missing' },
    { label: 'Market Data', status: hasMarketData ? 'Available' : 'Missing' },
    { label: 'Other Public Sources', status: hasOtherSources ? 'Partial' : 'Missing' },
  ];

  const overallPct = Math.round(average(categories.map((c) => COVERAGE_STATUS_SCORE[c.status])) ?? 0);

  return { overallPct, categories };
}

// --- Key metrics evidence -------------------------------------------------
//
// `unit` tells the frontend how to render `value` ('cr' | 'ratio' | 'percent')
// - formatting the number is a presentation concern, so no formatted string
// is computed here; only the raw value and a hint travel over the API.

const KEY_METRICS = [
  { key: 'revenue', label: 'Total Revenue', keywords: ['revenue'], getValue: (d, y) => y.revenue_cr, unit: 'cr' },
  { key: 'ebitda', label: 'EBITDA', keywords: ['ebitda'], getValue: (d, y) => y.ebitda_cr, unit: 'cr' },
  { key: 'net_profit', label: 'Net Profit', keywords: ['net profit', 'profit'], getValue: (d, y) => y.net_profit_cr, unit: 'cr' },
  { key: 'borrowings', label: 'Total Debt', keywords: ['debt', 'borrowing'], getValue: (d, y) => y.borrowings_cr, unit: 'cr' },
  { key: 'net_debt', label: 'Net Debt', keywords: ['net debt'], getValue: (d, y) => netDebt(y), unit: 'cr' },
  { key: 'receivables', label: 'Receivables', keywords: ['receivable'], getValue: (d, y) => y.receivables_cr, unit: 'cr' },
  { key: 'cfo', label: 'Operating Cash Flow', keywords: ['cash flow'], getValue: (d, y) => y.cfo_cr, unit: 'cr' },
  { key: 'interest_coverage', label: 'Interest Coverage', keywords: ['interest coverage'], getValue: (d, y) => interestCoverageRatio(y), unit: 'ratio' },
  { key: 'promoter_pct', label: 'Promoter Shareholding', keywords: ['promoter'], getValue: (d) => d.shareholding.promoter_pct, unit: 'percent_2dp', shareholding: true },
  { key: 'fii_pct', label: 'FII Shareholding', keywords: ['fii'], getValue: (d) => d.shareholding.fii_pct, unit: 'percent_2dp', shareholding: true },
  { key: 'dii_pct', label: 'DII Shareholding', keywords: ['dii'], getValue: (d) => d.shareholding.dii_pct, unit: 'percent_2dp', shareholding: true },
];

function findDiscrepancy(discrepancies, keywords) {
  return discrepancies.find((d) => keywords.some((kw) => d.metric.toLowerCase().includes(kw))) ?? null;
}

function computeMetricQuality({ value, sourceCount, discrepancy }) {
  if (value == null) return 'low';
  if (discrepancy) return discrepancy.severity === 'high' ? 'low' : 'medium';
  if (sourceCount >= 2) return 'high';
  if (sourceCount === 1) return 'medium';
  return 'low';
}

function computeKeyMetricsEvidence(data) {
  const { latest } = latestAndPriorYear(data.annual);
  if (!latest) return [];

  return KEY_METRICS.map((metric) => {
    const value = metric.getValue(data, latest);
    const discrepancy = findDiscrepancy(data.discrepancies, metric.keywords);
    const sources = metric.shareholding
      ? (discrepancy?.values.map((v) => ({ name: v.source })) ?? [])
      : latest.sources ?? [];

    return {
      key: metric.key,
      label: metric.label,
      fiscalYear: latest.fiscal_year,
      value,
      unit: metric.unit,
      sources,
      discrepancy,
      quality: computeMetricQuality({ value, sourceCount: sources.length, discrepancy }),
    };
  }).filter((row) => row.value != null);
}

// --- Data quality score ---------------------------------------------------

const CORE_ANNUAL_FIELDS = [
  'revenue_cr', 'ebitda_cr', 'depreciation_cr', 'interest_cr', 'net_profit_cr',
  'borrowings_cr', 'cash_and_current_investments_cr', 'receivables_cr', 'payables_cr', 'cfo_cr', 'fcf_cr',
];
const SEVERITY_PENALTY = { low: 4, medium: 8, high: 16 };

function computeDataQualityScore(data, meta) {
  let filled = 0;
  let total = 0;
  data.annual.forEach((year) => {
    CORE_ANNUAL_FIELDS.forEach((field) => {
      total += 1;
      if (year[field] != null) filled += 1;
    });
  });
  const completenessScore = total ? Math.round((filled / total) * 100) : 0;

  const avgReliability = average(data.sources_directory.map((s) => s.reliability));
  const sourceReliabilityScore = avgReliability != null ? Math.round((avgReliability / 5) * 100) : 0;

  const accuracyPenalty = data.discrepancies.reduce((sum, d) => sum + (SEVERITY_PENALTY[d.severity] ?? 8), 0);
  const accuracyScore = clamp(100 - accuracyPenalty, 0, 100);

  const consistencyScore = clamp(100 - data.discrepancies.length * 10, 0, 100);

  // Timeliness: whether this run actually searched the live web, or fell
  // back to the model's training knowledge (see meta.groundedWithLiveSearch).
  const timelinessScore = meta?.groundedWithLiveSearch ? 90 : 55;

  const overallScore = Math.round(
    average([completenessScore, accuracyScore, consistencyScore, timelinessScore, sourceReliabilityScore]) ?? 0
  );

  let label = 'NEEDS REVIEW';
  let tone = 'danger';
  if (overallScore >= 75) {
    label = 'GOOD';
    tone = 'success';
  } else if (overallScore >= 55) {
    label = 'FAIR';
    tone = 'warning';
  }

  return {
    overallScore,
    label,
    tone,
    dimensions: [
      { label: 'Completeness', score: completenessScore },
      { label: 'Accuracy', score: accuracyScore },
      { label: 'Consistency', score: consistencyScore },
      { label: 'Timeliness', score: timelinessScore },
      { label: 'Source Reliability', score: sourceReliabilityScore },
    ],
  };
}

function summarizeQualityCounts(keyMetricsEvidence) {
  return {
    high: keyMetricsEvidence.filter((m) => m.quality === 'high').length,
    medium: keyMetricsEvidence.filter((m) => m.quality === 'medium').length,
    low: keyMetricsEvidence.filter((m) => m.quality === 'low').length,
  };
}

module.exports = {
  computeSourcesOverview,
  computeCoverageSummary,
  computeKeyMetricsEvidence,
  computeDataQualityScore,
  summarizeQualityCounts,
};
