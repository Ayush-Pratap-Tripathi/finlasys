import axios from 'axios';
import { mockResearchAdapter, isResearchRequest } from './mockResearchAdapter';

const baseURL = import.meta.env.VITE_API_BASE_URL;
const useMockApi = import.meta.env.VITE_MOCK_API === 'true';

if (!baseURL) {
  throw new Error('Missing VITE_API_BASE_URL environment variable');
}

export const apiClient = axios.create({
  baseURL,
  // No timeout: the research call's duration varies a lot by AI provider
  // and can run several minutes, so a fixed ceiling here just means
  // re-guessing it every time the provider changes.
  timeout: 0,
});

// Dev-mode request mocking: swaps in a fake adapter before the request ever
// reaches the network, but ONLY for the /research call - that's the one
// that spends AI provider credits. Every /analysis/* call is real
// computation on the local backend (cheap, instant, no AI spend either
// way), so it always goes over the network even with VITE_MOCK_API=true.
if (useMockApi) {
  apiClient.interceptors.request.use((config) => {
    if (isResearchRequest(config)) {
      config.adapter = mockResearchAdapter;
    }
    return config;
  });
}

// Centralizes error-message extraction so every caller gets a clean,
// human-readable `error.userMessage` instead of re-deriving one from the
// raw axios/backend error shape at each call site.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    error.userMessage = error.response?.data?.error || 'Could not reach the research service. Is the backend running?';
    return Promise.reject(error);
  }
);
