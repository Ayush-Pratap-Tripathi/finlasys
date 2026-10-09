const { computeFinancialHealthScore } = require('../analysis/financialHealthScore');
const { computeAllSignals, computeTopSignals, computeRiskScore, buildSignalTrendData } = require('../analysis/financialSignals');
const { computeLendingRecommendation } = require('../analysis/lendingRecommendation');
const { computeKeyIndicators, computeFinancialTrendSummary } = require('../analysis/overviewCards');
const {
  computeProfitabilityTab,
  computeLeverageTab,
  computeCashFlowTab,
  computeWorkingCapitalTab,
  computeKeyRatiosTab,
} = require('../analysis/financialHealthCards');
const { computeSegmentSummary, buildSegmentTrendData } = require('../analysis/segmentAnalysis');
const {
  computeSourcesOverview,
  computeCoverageSummary,
  computeKeyMetricsEvidence,
  computeDataQualityScore,
  summarizeQualityCounts,
} = require('../analysis/evidenceAnalysis');
const {
  computeScorecard,
  computeDecisionSummary,
  computeKeyConditions,
  computeCovenants,
  computeScenarioAnalysis,
  NEXT_STEPS,
} = require('../analysis/lendingDecisionAnalysis');

/**
 * One method per dashboard page/process. Each method is self-sufficient -
 * it recomputes everything it needs (health score, signals, recommendation)
 * from the raw research data rather than depending on another endpoint's
 * result, so pages never have to be fetched in a particular order. The
 * underlying computations are pure and cheap (no I/O), so this repetition
 * costs nothing beyond a few extra function calls per request.
 */
class AnalysisService {
  getOverview({ data }) {
    const healthScore = computeFinancialHealthScore(data.annual);
    const allSignals = computeAllSignals(data.annual);
    const topSignals = computeTopSignals(data.annual, 3);
    const recommendation = computeLendingRecommendation({
      healthScore,
      signals: allSignals,
      discrepancies: data.discrepancies,
      assumptions: data.assumptions,
    });
    const keyIndicators = computeKeyIndicators(data.annual);
    const financialTrend = computeFinancialTrendSummary(data.annual);

    return { healthScore, topSignals, recommendation, keyIndicators, financialTrend };
  }

  getFinancialHealth({ data }) {
    const segmentSummary = computeSegmentSummary(data.segments, data.annual);
    const segments = segmentSummary
      ? { summary: segmentSummary, trendData: buildSegmentTrendData(data.segments), segmentNames: data.segments.map((s) => s.name) }
      : null;

    return {
      profitability: computeProfitabilityTab(data.annual),
      leverage: computeLeverageTab(data.annual),
      cashFlow: computeCashFlowTab(data.annual),
      workingCapital: computeWorkingCapitalTab(data.annual),
      keyRatios: computeKeyRatiosTab(data.annual),
      segments,
    };
  }

  getRiskSignals({ data }) {
    const allSignals = computeAllSignals(data.annual);
    const riskScore = computeRiskScore(allSignals);
    const trendData = buildSignalTrendData(data.annual);

    return { allSignals, riskScore, trendData };
  }

  getEvidence({ data, meta }) {
    const coverage = computeCoverageSummary(data);
    const sourcesOverview = computeSourcesOverview(data.sources_directory);
    const keyMetricsEvidence = computeKeyMetricsEvidence(data);
    const qualityScore = computeDataQualityScore(data, meta);
    const qualityCounts = summarizeQualityCounts(keyMetricsEvidence);

    return { coverage, sourcesOverview, keyMetricsEvidence, qualityScore, qualityCounts };
  }

  getLendingDecision({ data, meta }) {
    const healthScore = computeFinancialHealthScore(data.annual);
    const allSignals = computeAllSignals(data.annual);
    const recommendation = computeLendingRecommendation({
      healthScore,
      signals: allSignals,
      discrepancies: data.discrepancies,
      assumptions: data.assumptions,
    });

    const scorecard = computeScorecard(data);
    const decisionSummary = computeDecisionSummary({ scorecard, loanAmountInr: meta.requestedLoanAmountInr, recommendation });
    const latestFiscalYear = data.annual[data.annual.length - 1]?.fiscal_year;
    const conditions = computeKeyConditions(latestFiscalYear, scorecard.riskRating);
    const covenants = computeCovenants(scorecard);
    const scenarios = computeScenarioAnalysis(data);

    return { recommendation, scorecard, decisionSummary, conditions, covenants, nextSteps: NEXT_STEPS, scenarios };
  }
}

module.exports = AnalysisService;
