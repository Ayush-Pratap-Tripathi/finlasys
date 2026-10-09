import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { DashboardTopbar } from '../components/dashboard/DashboardTopbar';
import { AnalysisState } from '../components/dashboard/AnalysisState';
import { DataCoverageCard } from '../components/dashboard/evidence/DataCoverageCard';
import { SourcesOverviewCard } from '../components/dashboard/evidence/SourcesOverviewCard';
import { DataQualitySummaryCard } from '../components/dashboard/evidence/DataQualitySummaryCard';
import { EvidenceTabs } from '../components/dashboard/evidence/EvidenceTabs';
import { KeyMetricsEvidenceTab } from '../components/dashboard/evidence/KeyMetricsEvidenceTab';
import { SourceDirectoryTab } from '../components/dashboard/evidence/SourceDirectoryTab';
import { DiscrepanciesTab } from '../components/dashboard/evidence/DiscrepanciesTab';
import { AssumptionsTab } from '../components/dashboard/evidence/AssumptionsTab';
import { DataQualityTab } from '../components/dashboard/evidence/DataQualityTab';
import { usePageAnalysis } from '../hooks/usePageAnalysis';
import { fetchEvidenceAnalysis } from '../lib/analysisApi';

export function DashboardEvidencePage() {
  const { result } = useOutletContext();
  const { data, meta } = result;
  const [activeTab, setActiveTab] = useState('key-metrics');

  const { status, data: analysis, error } = usePageAnalysis(() => fetchEvidenceAnalysis(data, meta), [data, meta]);

  const latestYear = data.annual[data.annual.length - 1];

  const tabs = [
    { key: 'key-metrics', label: 'Key Metrics Evidence' },
    { key: 'source-directory', label: 'Source Directory' },
    { key: 'discrepancies', label: 'Discrepancies', count: data.discrepancies.length },
    { key: 'assumptions', label: 'Assumptions', count: data.assumptions.length },
    { key: 'data-quality', label: 'Data Quality' },
  ];

  return (
    <div>
      <DashboardTopbar
        title="Evidence & Sources"
        subtitle="All data used in the analysis with source transparency and data quality"
        fiscalYear={latestYear?.fiscal_year}
      />

      <div className="space-y-6 p-8">
        <AnalysisState status={status} error={error}>
          {analysis && (
            <>
              <div className="grid gap-4 lg:grid-cols-3">
                <DataCoverageCard coverage={analysis.coverage} />
                <SourcesOverviewCard overview={analysis.sourcesOverview} />
                <DataQualitySummaryCard qualityScore={analysis.qualityScore} qualityCounts={analysis.qualityCounts} />
              </div>

              <EvidenceTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

              {activeTab === 'key-metrics' && <KeyMetricsEvidenceTab rows={analysis.keyMetricsEvidence} />}
              {activeTab === 'source-directory' && <SourceDirectoryTab sources={data.sources_directory} />}
              {activeTab === 'discrepancies' && <DiscrepanciesTab discrepancies={data.discrepancies} />}
              {activeTab === 'assumptions' && <AssumptionsTab assumptions={data.assumptions} />}
              {activeTab === 'data-quality' && (
                <DataQualityTab keyMetricsEvidence={analysis.keyMetricsEvidence} qualityScore={analysis.qualityScore} />
              )}
            </>
          )}
        </AnalysisState>
      </div>
    </div>
  );
}
