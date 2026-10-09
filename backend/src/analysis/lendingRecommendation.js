/**
 * Deterministic recommendation derived from the health score and the
 * highest-severity signal found - not a separate AI judgment call, so it
 * stays traceable back to the same numbers shown elsewhere on the page.
 */

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function computeLendingRecommendation({ healthScore, signals, discrepancies, assumptions }) {
  const hasHighRiskSignal = signals.some((signal) => signal.severity === 'danger');

  let decision = 'DECLINE';
  let tone = 'danger';
  if (healthScore.score >= 70 && !hasHighRiskSignal) {
    decision = 'APPROVE';
    tone = 'success';
  } else if (healthScore.score >= 50) {
    decision = 'APPROVE WITH CONDITIONS';
    tone = 'success';
  }

  // Confidence reflects data quality, not just the score: more unresolved
  // discrepancies/assumptions the AI had to record means less certainty in
  // the underlying figures, independent of how strong those figures look.
  const confidencePct = clamp(94 - discrepancies.length * 3 - assumptions.length * 2, 45, 96);
  const confidenceLabel = confidencePct >= 75 ? 'HIGH' : confidencePct >= 55 ? 'MEDIUM' : 'LOW';

  const descriptions = {
    APPROVE: 'Financials are strong across profitability, leverage and coverage with no high-risk signals identified.',
    'APPROVE WITH CONDITIONS':
      'Overall financial position supports lending, but at least one area below warrants monitoring conditions.',
    DECLINE: 'Financial health score and/or risk signals fall below the threshold this analysis supports lending at.',
  };

  return {
    decision,
    tone,
    confidencePct: Math.round(confidencePct),
    confidenceLabel,
    description: descriptions[decision],
  };
}

module.exports = { computeLendingRecommendation };
