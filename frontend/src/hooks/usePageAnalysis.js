import { useEffect, useState } from 'react';

/**
 * Fetches one dashboard page's computed analysis from its dedicated backend
 * endpoint. Each page owns one call to this with its own fetcher, so pages
 * never share or recompute each other's data - see lib/analysisApi.js.
 */
export function usePageAnalysis(fetcher, deps) {
  const [state, setState] = useState({ status: 'loading', data: null, error: null });

  useEffect(() => {
    let cancelled = false;
    setState({ status: 'loading', data: null, error: null });

    fetcher()
      .then((data) => {
        if (!cancelled) setState({ status: 'success', data, error: null });
      })
      .catch((error) => {
        if (!cancelled) setState({ status: 'error', data: null, error });
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return state;
}
