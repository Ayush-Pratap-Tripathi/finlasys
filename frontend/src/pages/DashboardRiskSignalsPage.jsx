import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { DashboardTopbar } from '../components/dashboard/DashboardTopbar';
import { AnalysisState } from '../components/dashboard/AnalysisState';
import { SignalSummaryCards } from '../components/dashboard/risk-signals/SignalSummaryCards';
import { OverallRiskScoreCard } from '../components/dashboard/risk-signals/OverallRiskScoreCard';
import { SignalFilterTabs } from '../components/dashboard/risk-signals/SignalFilterTabs';
import { SignalCard } from '../components/dashboard/risk-signals/SignalCard';
import { Card } from '../components/ui/Card';
import { usePageAnalysis } from '../hooks/usePageAnalysis';
import { fetchRiskSignalsAnalysis } from '../lib/analysisApi';

export function DashboardRiskSignalsPage() {
  const { result } = useOutletContext();
  const { data } = result;
  const [activeFilter, setActiveFilter] = useState('all');

  const { status, data: analysis, error } = usePageAnalysis(() => fetchRiskSignalsAnalysis(data), [data]);

  const latestYear = data.annual[data.annual.length - 1];
  const allSignals = analysis?.allSignals ?? [];
  const visibleSignals = activeFilter === 'all' ? allSignals : allSignals.filter((s) => s.severity === activeFilter);

  return (
    <div>
      <DashboardTopbar
        title="Risk & Opportunity Signals"
        subtitle="Key insights derived from financial data and trends"
        fiscalYear={latestYear?.fiscal_year}
      />

      <div className="space-y-6 p-8">
        <AnalysisState status={status} error={error}>
          {analysis && (
            <>
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
                <SignalSummaryCards signals={allSignals} />
                <div className="col-span-2 lg:col-span-1">
                  <OverallRiskScoreCard riskScore={analysis.riskScore} />
                </div>
              </div>

              <SignalFilterTabs signals={allSignals} activeFilter={activeFilter} onChange={setActiveFilter} />

              <div className="space-y-4">
                {visibleSignals.length === 0 ? (
                  <Card className="p-10 text-center text-sm text-ink-500">No signals in this category.</Card>
                ) : (
                  visibleSignals.map((signal) => (
                    <SignalCard key={signal.id} signal={signal} trendData={analysis.trendData} />
                  ))
                )}
              </div>
            </>
          )}
        </AnalysisState>
      </div>
    </div>
  );
}
