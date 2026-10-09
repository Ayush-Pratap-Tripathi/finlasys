import { LayoutDashboard, LineChart, ShieldAlert, FileStack, ShieldCheck } from 'lucide-react';

export const DASHBOARD_NAV_ITEMS = [
  { key: 'overview', label: 'Overview', path: '/analysis', icon: LayoutDashboard },
  { key: 'financial-health', label: 'Financial Health', path: '/analysis/financial-health', icon: LineChart },
  { key: 'risk-signals', label: 'Risk & Opportunity Signals', path: '/analysis/risk-signals', icon: ShieldAlert },
  { key: 'evidence', label: 'Evidence & Sources', path: '/analysis/evidence', icon: FileStack },
  { key: 'lending-decision', label: 'Lending Decision', path: '/analysis/lending-decision', icon: ShieldCheck },
];
