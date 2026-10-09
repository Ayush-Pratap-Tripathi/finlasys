import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { LandingPage } from './pages/LandingPage';
import { DashboardLayoutPage } from './pages/DashboardLayoutPage';
import { DashboardOverviewPage } from './pages/DashboardOverviewPage';
import { DashboardFinancialHealthPage } from './pages/DashboardFinancialHealthPage';
import { DashboardRiskSignalsPage } from './pages/DashboardRiskSignalsPage';
import { DashboardEvidencePage } from './pages/DashboardEvidencePage';
import { DashboardLendingDecisionPage } from './pages/DashboardLendingDecisionPage';

function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            borderRadius: '12px',
            background: '#0f172a',
            color: '#fff',
            fontSize: '14px',
          },
        }}
      />
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route path="/analysis" element={<DashboardLayoutPage />}>
          <Route index element={<DashboardOverviewPage />} />
          <Route path="financial-health" element={<DashboardFinancialHealthPage />} />
          <Route path="risk-signals" element={<DashboardRiskSignalsPage />} />
          <Route path="evidence" element={<DashboardEvidencePage />} />
          <Route path="lending-decision" element={<DashboardLendingDecisionPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
