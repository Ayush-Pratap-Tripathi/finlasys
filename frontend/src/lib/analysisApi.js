import { apiClient } from './apiClient';

/**
 * One function per dedicated analysis endpoint. Each posts back exactly the
 * raw research payload the backend needs and returns the computed result -
 * no computation happens here or in any caller, matching researchApi.js's
 * error-handling convention (a clean, human-readable Error on failure).
 */
async function postAnalysis(path, body) {
  try {
    const { data } = await apiClient.post(path, body);
    return data;
  } catch (error) {
    throw new Error(error.userMessage || 'Could not reach the analysis service. Is the backend running?');
  }
}

export function fetchOverviewAnalysis(data) {
  return postAnalysis('/analysis/overview', { data });
}

export function fetchFinancialHealthAnalysis(data) {
  return postAnalysis('/analysis/financial-health', { data });
}

export function fetchRiskSignalsAnalysis(data) {
  return postAnalysis('/analysis/risk-signals', { data });
}

export function fetchEvidenceAnalysis(data, meta) {
  return postAnalysis('/analysis/evidence', { data, meta });
}

export function fetchLendingDecisionAnalysis(data, meta) {
  return postAnalysis('/analysis/lending-decision', { data, meta });
}
