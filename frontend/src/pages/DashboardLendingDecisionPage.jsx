import { useOutletContext } from 'react-router-dom';
import { DashboardTopbar } from '../components/dashboard/DashboardTopbar';
import { AnalysisState } from '../components/dashboard/AnalysisState';
import { FinalRecommendationCard } from '../components/dashboard/lending-decision/FinalRecommendationCard';
import { KeyDecisionDriversCard } from '../components/dashboard/lending-decision/KeyDecisionDriversCard';
import { RiskRatingCard } from '../components/dashboard/lending-decision/RiskRatingCard';
import { DecisionSummaryCard } from '../components/dashboard/lending-decision/DecisionSummaryCard';
import { ScorecardSummaryTable } from '../components/dashboard/lending-decision/ScorecardSummaryTable';
import { ScenarioAnalysisTable } from '../components/dashboard/lending-decision/ScenarioAnalysisTable';
import { KeyConditionsCard } from '../components/dashboard/lending-decision/KeyConditionsCard';
import { CovenantsCard } from '../components/dashboard/lending-decision/CovenantsCard';
import { NextStepsCard } from '../components/dashboard/lending-decision/NextStepsCard';
import { usePageAnalysis } from '../hooks/usePageAnalysis';
import { fetchLendingDecisionAnalysis } from '../lib/analysisApi';

export function DashboardLendingDecisionPage() {
  const { result } = useOutletContext();
  const { data, meta } = result;

  const { status, data: analysis, error } = usePageAnalysis(() => fetchLendingDecisionAnalysis(data, meta), [data, meta]);

  const latestYear = data.annual[data.annual.length - 1];

  return (
    <div>
      <DashboardTopbar
        title="Lending Decision"
        subtitle="Final recommendation based on comprehensive credit analysis"
        fiscalYear={latestYear?.fiscal_year}
      />

      <div className="space-y-6 p-8">
        <AnalysisState status={status} error={error}>
          {analysis && (
            <>
              <div className="grid gap-6 lg:grid-cols-3">
                <FinalRecommendationCard recommendation={analysis.recommendation} />
                <KeyDecisionDriversCard rows={analysis.scorecard.rows} />
                <div className="space-y-6">
                  <RiskRatingCard riskRating={analysis.scorecard.riskRating} totalScore={analysis.scorecard.totalScore} />
                </div>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <ScorecardSummaryTable scorecard={analysis.scorecard} />
                <DecisionSummaryCard summary={analysis.decisionSummary} conditionsCount={analysis.conditions.length} />
              </div>

              <ScenarioAnalysisTable scenarios={analysis.scenarios} />

              <div className="grid gap-6 lg:grid-cols-3">
                <KeyConditionsCard conditions={analysis.conditions} />
                <CovenantsCard covenants={analysis.covenants} />
                <NextStepsCard steps={analysis.nextSteps} />
              </div>

              <div className="rounded-xl border border-ink-200 bg-ink-50 p-4 text-xs text-ink-500">
                This recommendation is based on data and assumptions as of {latestYear?.fiscal_year}
                {!meta.groundedWithLiveSearch && ' (not verified against a live source)'}. Please review all details
                before making the final decision.
              </div>
            </>
          )}
        </AnalysisState>
      </div>
    </div>
  );
}
