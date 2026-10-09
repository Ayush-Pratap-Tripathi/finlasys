import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { DashboardTopbar } from '../components/dashboard/DashboardTopbar';
import { AnalysisState } from '../components/dashboard/AnalysisState';
import { FinancialHealthTabs } from '../components/dashboard/financial-health/FinancialHealthTabs';
import { ProfitabilityTab } from '../components/dashboard/financial-health/ProfitabilityTab';
import { LeverageTab } from '../components/dashboard/financial-health/LeverageTab';
import { CashFlowTab } from '../components/dashboard/financial-health/CashFlowTab';
import { WorkingCapitalTab } from '../components/dashboard/financial-health/WorkingCapitalTab';
import { KeyRatiosTab } from '../components/dashboard/financial-health/KeyRatiosTab';
import { SegmentViewTab } from '../components/dashboard/financial-health/SegmentViewTab';
import { usePageAnalysis } from '../hooks/usePageAnalysis';
import { fetchFinancialHealthAnalysis } from '../lib/analysisApi';

const TAB_COMPONENTS = {
  profitability: ProfitabilityTab,
  leverage: LeverageTab,
  'cash-flow': CashFlowTab,
  'working-capital': WorkingCapitalTab,
  'key-ratios': KeyRatiosTab,
  'segment-view': SegmentViewTab,
};

const TAB_PROP_KEYS = {
  profitability: 'profitability',
  leverage: 'leverage',
  'cash-flow': 'cashFlow',
  'working-capital': 'workingCapital',
  'key-ratios': 'keyRatios',
  'segment-view': 'segments',
};

export function DashboardFinancialHealthPage() {
  const { result } = useOutletContext();
  const { data } = result;
  const [activeTab, setActiveTab] = useState('profitability');

  const { status, data: analysis, error } = usePageAnalysis(() => fetchFinancialHealthAnalysis(data), [data]);

  const latestYear = data.annual[data.annual.length - 1];
  const primarySource = latestYear?.sources?.find((s) => s.role === 'primary') ?? latestYear?.sources?.[0];
  const ActiveTabComponent = TAB_COMPONENTS[activeTab];

  return (
    <div>
      <DashboardTopbar
        title="Financial Health"
        subtitle={`Detailed view of ${data.company.name}'s financial performance and position`}
        fiscalYear={latestYear?.fiscal_year}
      />

      <div className="px-8 pt-4">
        <FinancialHealthTabs activeTab={activeTab} onChange={setActiveTab} />
      </div>

      <div className="p-8">
        <AnalysisState status={status} error={error}>
          {analysis && <ActiveTabComponent {...{ [TAB_PROP_KEYS[activeTab]]: analysis[TAB_PROP_KEYS[activeTab]] }} />}
        </AnalysisState>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-2 text-xs text-ink-400">
          <p>All financials are consolidated figures from company filings.</p>
          {primarySource && (
            <p>
              Source: {primarySource.name}{' '}
              <a
                href={primarySource.url}
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-brand-600 hover:text-brand-700"
              >
                View Source
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
