import { useOutletContext } from 'react-router-dom';
import { DashboardTopbar } from '../components/dashboard/DashboardTopbar';
import { AnalysisState } from '../components/dashboard/AnalysisState';
import { LendingRecommendationCard } from '../components/dashboard/overview/LendingRecommendationCard';
import { TopSignalsCard } from '../components/dashboard/overview/TopSignalsCard';
import { KeyIndicatorsGrid } from '../components/dashboard/overview/KeyIndicatorsGrid';
import { FinancialHealthScoreCard } from '../components/dashboard/overview/FinancialHealthScoreCard';
import { FinancialTrendTable } from '../components/dashboard/overview/FinancialTrendTable';
import { usePageAnalysis } from '../hooks/usePageAnalysis';
import { fetchOverviewAnalysis } from '../lib/analysisApi';

export function DashboardOverviewPage() {
  const { result } = useOutletContext();
  const { data, meta } = result;
  const latestYear = data.annual[data.annual.length - 1];

  const { status, data: analysis, error } = usePageAnalysis(() => fetchOverviewAnalysis(data), [data]);

  return (
    <div>
      <DashboardTopbar
        title="Credit Overview"
        subtitle={`Quick summary of ${data.company.name}'s financial health and lending recommendation`}
        fiscalYear={latestYear?.fiscal_year}
      />

      <div className="space-y-6 p-8">
        <AnalysisState status={status} error={error}>
          {analysis && (
            <>
              <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
                <LendingRecommendationCard
                  recommendation={analysis.recommendation}
                  loanAmountInr={meta.requestedLoanAmountInr}
                />
                <TopSignalsCard signals={analysis.topSignals} />
              </div>

              <KeyIndicatorsGrid keyIndicators={analysis.keyIndicators} />

              <div className="grid gap-6 lg:grid-cols-2">
                <FinancialHealthScoreCard healthScore={analysis.healthScore} />
                <FinancialTrendTable financialTrend={analysis.financialTrend} />
              </div>
            </>
          )}
        </AnalysisState>
      </div>
    </div>
  );
}
