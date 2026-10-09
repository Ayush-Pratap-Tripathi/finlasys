import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { DashboardSidebar } from '../components/dashboard/DashboardSidebar';
import { loadResearchResult } from '../lib/researchResultStore';

/**
 * Shared shell for every /analysis/* route: resolves the research result
 * (router state on first navigation, sessionStorage on refresh/direct
 * visit) and hands it down to nested pages via Outlet context. Every score,
 * ratio and recommendation is computed by the backend's dedicated analysis
 * endpoints (see lib/analysisApi.js) - each page fetches its own, so
 * nothing is composed or cached here.
 */
export function DashboardLayoutPage() {
  const location = useLocation();
  const result = location.state?.result ?? loadResearchResult();

  if (!result) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex min-h-screen bg-ink-50">
      <DashboardSidebar
        company={result.data.company}
        loanAmountInr={result.meta.requestedLoanAmountInr}
        generatedAt={result.meta.generatedAt}
      />
      <main className="min-w-0 flex-1">
        <Outlet context={{ result }} />
      </main>
    </div>
  );
}
