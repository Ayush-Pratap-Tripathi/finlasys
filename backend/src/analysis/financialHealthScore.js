const { ebitdaMarginPct, interestCoverageRatio, cashConversionRatio, netDebt, latestAndPriorYear } = require('./financialRatios');

/**
 * Deterministic 0-100 financial health score built from four transparent,
 * independently-documented sub-scores. This is a heuristic, not a trained
 * model - every weight and threshold here is fixed and inspectable, per the
 * assignment's "no black box" requirement. Adjust the thresholds below to
 * change scoring behavior; there is nothing else to tune.
 */

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

// Profitability: rewards a healthy EBITDA margin and margin expansion.
function profitabilityScore(latest, prior) {
  const margin = ebitdaMarginPct(latest);
  if (margin == null) return { score: 0, max: 35 };

  const base = clamp(margin, 0, 30);
  const priorMargin = ebitdaMarginPct(prior);
  const trendBonus = priorMargin != null && margin > priorMargin ? 5 : 0;

  return { score: clamp(base + trendBonus, 0, 35), max: 35 };
}

// Leverage: rewards low debt relative to EBITDA. A net-cash position (debt
// this or less than zero) scores the maximum.
function leverageScore(latest) {
  const debt = netDebt(latest);
  if (debt == null || !latest.ebitda_cr) return { score: 20, max: 25 };
  if (debt <= 0) return { score: 25, max: 25 };

  const debtToEbitda = debt / latest.ebitda_cr;
  if (debtToEbitda < 1) return { score: 22, max: 25 };
  if (debtToEbitda < 2) return { score: 17, max: 25 };
  if (debtToEbitda < 3) return { score: 12, max: 25 };
  if (debtToEbitda < 4) return { score: 7, max: 25 };
  return { score: 2, max: 25 };
}

// Coverage: rewards ample EBITDA relative to interest obligations.
function coverageScore(latest) {
  const coverage = interestCoverageRatio(latest);
  if (coverage == null) return { score: 20, max: 20 }; // no meaningful interest burden
  if (coverage > 6) return { score: 20, max: 20 };
  if (coverage > 4) return { score: 16, max: 20 };
  if (coverage > 2.5) return { score: 12, max: 20 };
  if (coverage > 1.5) return { score: 6, max: 20 };
  return { score: 0, max: 20 };
}

// Cash conversion: rewards operating cash flow that keeps pace with EBITDA.
function cashConversionScore(latest) {
  const ratio = cashConversionRatio(latest);
  if (ratio == null) return { score: 0, max: 20 };
  if (ratio > 0.9) return { score: 20, max: 20 };
  if (ratio > 0.7) return { score: 16, max: 20 };
  if (ratio > 0.5) return { score: 10, max: 20 };
  if (ratio > 0.3) return { score: 5, max: 20 };
  return { score: 0, max: 20 };
}

function computeFinancialHealthScore(annual) {
  const { latest, prior } = latestAndPriorYear(annual);
  if (!latest) return { score: 0, label: 'UNKNOWN', tone: 'neutral' };

  const parts = {
    profitability: profitabilityScore(latest, prior),
    leverage: leverageScore(latest),
    coverage: coverageScore(latest),
    cashConversion: cashConversionScore(latest),
  };

  const totalMax = Object.values(parts).reduce((sum, part) => sum + part.max, 0);
  const totalScore = Object.values(parts).reduce((sum, part) => sum + part.score, 0);
  const score = Math.round((totalScore / totalMax) * 100);

  let label = 'WEAK';
  let tone = 'danger';
  if (score >= 70) {
    label = 'STRONG';
    tone = 'success';
  } else if (score >= 50) {
    label = 'MODERATE';
    tone = 'warning';
  }

  return { score, label, tone, breakdown: parts };
}

module.exports = { computeFinancialHealthScore };
