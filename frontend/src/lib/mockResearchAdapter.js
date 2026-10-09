import mockResearchResponse from '../mocks/infosysMockResponse.json';

// Short but visible, so the loading UI is still exercised without making
// every test run wait for a real multi-minute AI call.
const SIMULATED_DELAY_MS = 2500;

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function isResearchRequest(config) {
  return Boolean(config.url && config.url.includes('/research') && config.method === 'post');
}

/**
 * Custom axios adapter that fabricates a response for the research endpoint
 * instead of making a network call, so the UI can be built and tested
 * against realistic data without spending AI provider credits. Always
 * returns the same fixed mock regardless of the requested company/loan
 * amount - swap the JSON in src/mocks if a different scenario is needed.
 *
 * Wired in via a request interceptor (see apiClient.js) rather than used
 * directly, so it only ever applies to requests that opt in.
 */
export async function mockResearchAdapter(config) {
  await delay(SIMULATED_DELAY_MS);

  if (!isResearchRequest(config)) {
    throw new Error(`No mock configured for ${config.method?.toUpperCase()} ${config.url}`);
  }

  return {
    data: mockResearchResponse,
    status: 200,
    statusText: 'OK',
    headers: {},
    config,
  };
}
