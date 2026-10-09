const STORAGE_KEY = 'finlasys.lastResearchResult';

/**
 * The dashboard normally receives its data via router state (see
 * useCompanyResearch's navigate call), which is lost on a hard refresh.
 * Mirroring the last result into sessionStorage lets the dashboard page
 * recover it on refresh/direct navigation without re-running the research
 * call. Session-scoped and per-tab by design - this is a UX convenience,
 * not a persistence layer.
 */
export function saveResearchResult(result) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(result));
  } catch {
    // Storage can fail (private browsing, quota) - losing this convenience
    // cache isn't fatal, so fail silently rather than break the flow.
  }
}

export function loadResearchResult() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
