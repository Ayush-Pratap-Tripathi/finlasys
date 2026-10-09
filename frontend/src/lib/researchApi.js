import { apiClient } from './apiClient';

/**
 * Requests a full credit-research dataset for a company from the backend
 * gateway. Throws with a human-readable message on failure (derived by
 * apiClient's response interceptor) so callers can surface it directly
 * (e.g. in a toast) without re-deriving one.
 */
export async function requestCompanyResearch({ companyName, loanAmountInr }) {
  try {
    const { data } = await apiClient.post('/research', { companyName, loanAmountInr });
    return data;
  } catch (error) {
    throw new Error(error.userMessage || 'Could not reach the research service. Is the backend running?');
  }
}
