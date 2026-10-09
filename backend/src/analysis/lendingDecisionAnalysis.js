const { computeFinancialHealthScore } = require('./financialHealthScore');
const { debtToEbitda, interestCoverageRatio, cashConversionRatio, latestAndPriorYear } = require('./financialRatios');

/**
 * Everything the Lending Decision page needs beyond the recommendation
 * already computed in lendingRecommendation.js. Two of the five scorecard
 * categories below (Business Outlook, Management & Governance) have
 * genuinely thin support in the research schema - rather than fabricate
 * confidence, those scorers default to a neutral baseline and only move
 * away from it when there's an actual signal to point to (a real credit
 * rating, a real growth trend, an actual flagged discrepancy). Their
 * weights are also the smallest in the scorecard for the same reason.
 */

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function toneForScore(score) {
  if (score >= 75) return 'success';
  if (score >= 50) return 'warning';
  return 'danger';
}

// --- Per-category scorers ---------------------------------------------

function scoreCreditRisk(annual) {
  const { latest } = latestAndPriorYear(annual);
  const ratio = debtToEbitda(latest);
  const coverage = interestCoverageRatio(latest);

  let leverageScore = 65;
  if (ratio != null) {
    if (ratio <= 0) leverageScore = 100;
    else if (ratio < 1) leverageScore = 88;
    else if (ratio < 2) leverageScore = 72;
    else if (ratio < 3) leverageScore = 52;
    else if (ratio < 4) leverageScore = 32;
    else leverageScore = 12;
  }

  let coverageScoreValue = 65;
  if (coverage != null) {
    if (coverage > 8) coverageScoreValue = 100;
    else if (coverage > 5) coverageScoreValue = 85;
    else if (coverage > 3) coverageScoreValue = 65;
    else if (coverage > 1.5) coverageScoreValue = 38;
    else coverageScoreValue = 12;
  }

  const score = Math.round((leverageScore + coverageScoreValue) / 2);
  const description =
    ratio != null && ratio <= 0
      ? 'Net-cash balance sheet with strong interest coverage'
      : 'Low leverage and interest coverage assessed from reported debt and EBITDA';

  return { score, tone: toneForScore(score), description };
}

function scoreCashFlowLiquidity(annual) {
  const { latest } = latestAndPriorYear(annual);
  const conversion = cashConversionRatio(latest);

  let score = 55;
  if (conversion != null) {
    if (conversion > 0.9) score = 95;
    else if (conversion > 0.7) score = 80;
    else if (conversion > 0.5) score = 58;
    else if (conversion > 0.3) score = 38;
    else score = 18;
  }

  const description =
    conversion != null
      ? `Operating cash flow converts ${(conversion * 100).toFixed(0)}% of EBITDA into cash`
      : 'Cash flow data limited for this company';

  return { score, tone: toneForScore(score), description };
}

// Deliberately narrow: a proxy from the financial trend actually
// researched (revenue CAGR), not a market or competitive analysis this
// system doesn't perform.
function scoreBusinessOutlook(annual) {
  if (annual.length < 2) {
    return { score: 60, tone: 'warning', description: 'Limited history to assess a growth trend' };
  }

  const first = annual[0];
  const last = annual[annual.length - 1];
  const years = annual.length - 1;
  const cagr =
    first.revenue_cr && last.revenue_cr ? (Math.pow(last.revenue_cr / first.revenue_cr, 1 / years) - 1) * 100 : null;

  let score = 60;
  if (cagr != null) {
    if (cagr > 15) score = 90;
    else if (cagr > 8) score = 76;
    else if (cagr > 3) score = 60;
    else if (cagr > 0) score = 48;
    else score = 28;
  }

  const description =
    cagr != null
      ? `Revenue grew at a ${cagr.toFixed(1)}% CAGR over the researched period (a financial-trend proxy, not an independent industry outlook)`
      : 'Insufficient multi-year data to assess a growth trend';

  return { score, tone: toneForScore(score), description };
}

// Deliberately conservative: starts neutral and only moves on real
// evidence (a disclosed external rating, or an actual flagged
// discrepancy) - never asserts "good governance" without a basis for it.
function scoreManagementGovernance(qualitative, discrepancies) {
  let score = 65;
  const notes = [];

  if (qualitative?.external_credit_rating) {
    score += 15;
    notes.push(`External credit rating on record: ${qualitative.external_credit_rating}`);
  }

  const highSeverityCount = discrepancies.filter((d) => d.severity === 'high').length;
  if (highSeverityCount > 0) {
    score -= 15 * highSeverityCount;
    notes.push(`${highSeverityCount} high-severity data discrepanc${highSeverityCount === 1 ? 'y' : 'ies'} flagged`);
  }

  score = clamp(score, 0, 100);

  const description =
    notes.length > 0
      ? notes.join('; ')
      : 'No governance-related red flags identified in the reviewed disclosures - management quality itself is not independently verified';

  return { score, tone: toneForScore(score), description };
}

// --- Scorecard -----------------------------------------------------------

const SCORECARD_CATEGORIES = [
  { key: 'financialHealth', label: 'Financial Health', weight: 30 },
  { key: 'creditRisk', label: 'Credit Risk', weight: 25 },
  { key: 'businessOutlook', label: 'Business Outlook', weight: 20 },
  { key: 'cashFlowLiquidity', label: 'Cash Flow & Liquidity', weight: 15 },
  { key: 'managementGovernance', label: 'Management & Governance', weight: 10 },
];

function computeScorecard(data) {
  const healthScore = computeFinancialHealthScore(data.annual);

  const scores = {
    financialHealth: { score: healthScore.score, tone: healthScore.tone, description: 'Profitability, leverage, coverage and cash conversion combined' },
    creditRisk: scoreCreditRisk(data.annual),
    businessOutlook: scoreBusinessOutlook(data.annual),
    cashFlowLiquidity: scoreCashFlowLiquidity(data.annual),
    managementGovernance: scoreManagementGovernance(data.qualitative, data.discrepancies),
  };

  const rows = SCORECARD_CATEGORIES.map((category) => ({
    ...category,
    ...scores[category.key],
    weightedScore: (scores[category.key].score * category.weight) / 100,
  }));

  const totalScore = rows.reduce((sum, row) => sum + row.weightedScore, 0);
  const riskRating = computeRiskRating(totalScore);

  return { rows, totalScore, riskRating };
}

function computeRiskRating(totalScore) {
  if (totalScore >= 80) return { grade: 'A', label: 'Low Risk', tone: 'success' };
  if (totalScore >= 65) return { grade: 'B', label: 'Moderate Risk', tone: 'warning' };
  if (totalScore >= 50) return { grade: 'C', label: 'High Risk', tone: 'danger' };
  return { grade: 'D', label: 'Very High Risk', tone: 'danger' };
}

// --- Decision summary (indicative terms) ----------------------------------

const TENURE_BY_GRADE = { A: 36, B: 24, C: 12, D: 6 };
const RATE_PREMIUM_BY_GRADE = { A: 0.75, B: 1.75, C: 3.0, D: 4.5 };
const BASE_RATE_PCT = 8.5;

/**
 * A simple, transparent rate-card policy - not a real bank's pricing
 * model. Every input (tenure, rate, security, covenant tier) is a direct
 * function of the computed risk grade, so an analyst can see exactly why
 * a term was suggested and override it.
 */
function computeDecisionSummary({ scorecard, loanAmountInr, recommendation }) {
  const grade = scorecard.riskRating.grade;
  const recommendedLimitInr = recommendation.decision === 'DECLINE' ? 0 : loanAmountInr;

  return {
    recommendedLimitInr,
    tenureMonths: TENURE_BY_GRADE[grade] ?? 12,
    interestRatePct: BASE_RATE_PCT + (RATE_PREMIUM_BY_GRADE[grade] ?? 3),
    security: scorecard.totalScore >= 75 ? 'Unsecured' : 'Secured',
    covenantTier: scorecard.totalScore >= 75 ? 'Standard' : 'Enhanced',
  };
}

function computeKeyConditions(latestFiscalYear, riskRating) {
  const conditions = [
    `Submission of latest audited financial statements for ${latestFiscalYear}.`,
    'Board resolution authorizing the borrowing and confirming terms.',
  ];
  if (riskRating.grade === 'C' || riskRating.grade === 'D') {
    conditions.push('Submission of a cash flow projection covering the facility tenure.');
  }
  return conditions;
}

function computeCovenants(scorecard) {
  const creditRiskRow = scorecard.rows.find((r) => r.key === 'creditRisk');
  const isConservative = creditRiskRow.score >= 75;

  return [
    `Maintain Total Debt / EBITDA < ${isConservative ? '2.5' : '3.5'}x`,
    `Maintain Interest Coverage Ratio > ${isConservative ? '3.0' : '2.0'}x`,
    'Quarterly financial reporting',
    'Intimation for material events',
  ];
}

const NEXT_STEPS = [
  'Share term sheet with borrower',
  'Receive acceptance and required documents',
  'Legal documentation & execution',
  'Disbursement upon completion of conditions',
];

// --- Scenario analysis -----------------------------------------------------

/**
 * Recomputes the scorecard with the latest year's income-statement and
 * working-capital figures scaled by `factor` (balance-sheet items -
 * borrowings, cash, interest - held constant, since those don't move
 * mechanically with a revenue swing). A genuine sensitivity check, not a
 * second AI opinion.
 */
function scaleLatestYear(annual, factor) {
  const scaledLast = { ...annual[annual.length - 1] };
  ['revenue_cr', 'ebitda_cr', 'net_profit_cr', 'cfo_cr', 'fcf_cr', 'receivables_cr', 'payables_cr'].forEach((field) => {
    if (scaledLast[field] != null) scaledLast[field] = scaledLast[field] * factor;
  });
  return [...annual.slice(0, -1), scaledLast];
}

function computeScenarioAnalysis(data) {
  const baseScorecard = computeScorecard(data);

  const scenarios = [
    { key: 'base', label: 'Base Case (Current)', factor: 1 },
    { key: 'downside', label: 'Downside Case (-20% Revenue)', factor: 0.8 },
    { key: 'upside', label: 'Upside Case (+20% Revenue)', factor: 1.2 },
  ];

  return scenarios.map((scenario) => {
    const scorecard = scenario.factor === 1 ? baseScorecard : computeScorecard({ ...data, annual: scaleLatestYear(data.annual, scenario.factor) });
    const scoreDelta = scorecard.totalScore - baseScorecard.totalScore;

    let comment = 'Stable performance and projections';
    if (scenario.key !== 'base') {
      const ratingChanged = scorecard.riskRating.grade !== baseScorecard.riskRating.grade;
      comment = ratingChanged
        ? `Risk rating would shift to ${scorecard.riskRating.grade} (${scorecard.riskRating.label})`
        : `Risk rating remains within the ${baseScorecard.riskRating.label.toLowerCase()} band`;
    }

    return {
      key: scenario.key,
      label: scenario.label,
      riskRating: scorecard.riskRating,
      impact: scenario.key === 'base' ? null : scoreDelta,
      comment,
    };
  });
}

module.exports = {
  computeScorecard,
  computeRiskRating,
  computeDecisionSummary,
  computeKeyConditions,
  computeCovenants,
  computeScenarioAnalysis,
  NEXT_STEPS,
};
