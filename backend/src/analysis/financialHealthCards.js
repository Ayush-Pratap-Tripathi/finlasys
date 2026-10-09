const {
  yoyChangePct,
  ebitdaMarginPct,
  netProfitMarginPct,
  netDebt,
  debtToEbitda,
  interestCoverageRatio,
  cashConversionRatio,
  fcfMarginPct,
  receivablesDays,
  payablesDays,
  workingCapitalDays,
  latestAndPriorYear,
} = require('./financialRatios');

/**
 * Card + trend-chart data for the Financial Health page's four ratio tabs
 * (Profitability, Leverage, Cash Flow, Working Capital) and the Key Ratios
 * summary table. Each card carries a raw numeric `value` and a `unit` hint
 * ('cr' | 'ratio' | 'percent' | 'days') rather than a formatted string -
 * formatting is left to the frontend.
 */

function computeProfitabilityTab(annual) {
  const { latest, prior } = latestAndPriorYear(annual);
  if (!latest) return null;

  const priorLabel = prior ? `vs ${prior.fiscal_year}` : null;
  const margin = ebitdaMarginPct(latest);
  const priorMargin = prior ? ebitdaMarginPct(prior) : null;
  const netMargin = netProfitMarginPct(latest);
  const priorNetMargin = prior ? netProfitMarginPct(prior) : null;

  const cards = [
    {
      key: 'revenue',
      label: `Revenue (${latest.fiscal_year})`,
      unit: 'cr',
      value: latest.revenue_cr,
      changePct: prior ? yoyChangePct(latest.revenue_cr, prior.revenue_cr) : null,
      changeLabel: priorLabel,
      goodDirection: 'up',
    },
    {
      key: 'ebitda',
      label: `EBITDA (${latest.fiscal_year})`,
      unit: 'cr',
      value: latest.ebitda_cr,
      changePct: prior ? yoyChangePct(latest.ebitda_cr, prior.ebitda_cr) : null,
      changeLabel: priorLabel,
      goodDirection: 'up',
    },
    {
      key: 'net_profit',
      label: `Net Profit (${latest.fiscal_year})`,
      unit: 'cr',
      value: latest.net_profit_cr,
      changePct: prior ? yoyChangePct(latest.net_profit_cr, prior.net_profit_cr) : null,
      changeLabel: priorLabel,
      goodDirection: 'up',
    },
    {
      key: 'ebitda_margin',
      label: `EBITDA Margin (${latest.fiscal_year})`,
      unit: 'percent',
      value: margin,
      changePct: margin != null && priorMargin != null ? margin - priorMargin : null,
      changeLabel: priorLabel,
      goodDirection: 'up',
    },
    {
      key: 'net_profit_margin',
      label: `Net Profit Margin (${latest.fiscal_year})`,
      unit: 'percent',
      value: netMargin,
      changePct: netMargin != null && priorNetMargin != null ? netMargin - priorNetMargin : null,
      changeLabel: priorLabel,
      goodDirection: 'up',
    },
  ];

  const trendData = annual.map((year) => ({
    fiscal_year: year.fiscal_year,
    revenue: year.revenue_cr,
    ebitda: year.ebitda_cr,
    netProfit: year.net_profit_cr,
    ebitdaMargin: ebitdaMarginPct(year),
    netMargin: netProfitMarginPct(year),
  }));

  return { cards, trendData };
}

function computeLeverageTab(annual) {
  const { latest, prior } = latestAndPriorYear(annual);
  if (!latest) return null;

  const priorLabel = prior ? `vs ${prior.fiscal_year}` : null;
  const debt = netDebt(latest);
  const priorDebt = prior ? netDebt(prior) : null;
  const isNetCash = debt != null && debt < 0;
  const ratio = debtToEbitda(latest);
  const priorRatio = prior ? debtToEbitda(prior) : null;
  const coverage = interestCoverageRatio(latest);
  const priorCoverage = prior ? interestCoverageRatio(prior) : null;

  const cards = [
    {
      key: 'borrowings',
      label: `Borrowings (${latest.fiscal_year})`,
      unit: 'cr',
      value: latest.borrowings_cr,
      changePct: prior ? yoyChangePct(latest.borrowings_cr, prior.borrowings_cr) : null,
      changeLabel: priorLabel,
      goodDirection: 'down',
    },
    {
      key: 'net_debt',
      label: isNetCash ? `Net Cash (${latest.fiscal_year})` : `Net Debt (${latest.fiscal_year})`,
      unit: 'cr',
      value: debt != null ? Math.abs(debt) : null,
      changePct: debt != null && priorDebt != null ? yoyChangePct(Math.abs(debt), Math.abs(priorDebt)) : null,
      changeLabel: priorLabel,
      goodDirection: isNetCash ? 'up' : 'down',
    },
    {
      key: 'debt_to_ebitda',
      label: 'Net Debt / EBITDA',
      unit: 'ratio',
      value: ratio,
      changePct: ratio != null && priorRatio != null ? ratio - priorRatio : null,
      changeLabel: priorLabel,
      goodDirection: 'down',
    },
    {
      key: 'interest_coverage',
      label: 'Interest Coverage',
      unit: 'ratio',
      value: coverage,
      changePct: coverage != null && priorCoverage != null ? yoyChangePct(coverage, priorCoverage) : null,
      changeLabel: priorLabel,
      goodDirection: 'up',
    },
  ];

  const trendData = annual.map((year) => ({
    fiscal_year: year.fiscal_year,
    borrowings: year.borrowings_cr,
    netDebt: netDebt(year),
    debtToEbitda: debtToEbitda(year),
    coverage: interestCoverageRatio(year),
  }));

  return { cards, trendData, isNetCash };
}

function computeCashFlowTab(annual) {
  const { latest, prior } = latestAndPriorYear(annual);
  if (!latest) return null;

  const priorLabel = prior ? `vs ${prior.fiscal_year}` : null;
  const conversion = cashConversionRatio(latest);
  const priorConversion = prior ? cashConversionRatio(prior) : null;
  const fcfMargin = fcfMarginPct(latest);
  const priorFcfMargin = prior ? fcfMarginPct(prior) : null;

  const cards = [
    {
      key: 'cfo',
      label: `Operating Cash Flow (${latest.fiscal_year})`,
      unit: 'cr',
      value: latest.cfo_cr,
      changePct: prior ? yoyChangePct(latest.cfo_cr, prior.cfo_cr) : null,
      changeLabel: priorLabel,
      goodDirection: 'up',
    },
    {
      key: 'fcf',
      label: `Free Cash Flow (${latest.fiscal_year})`,
      unit: 'cr',
      value: latest.fcf_cr,
      changePct: prior && latest.fcf_cr != null && prior.fcf_cr != null ? yoyChangePct(latest.fcf_cr, prior.fcf_cr) : null,
      changeLabel: priorLabel,
      goodDirection: 'up',
    },
    {
      key: 'cash_conversion',
      label: 'Cash Conversion (CFO / EBITDA)',
      unit: 'percent_0dp',
      value: conversion != null ? conversion * 100 : null,
      changePct: conversion != null && priorConversion != null ? (conversion - priorConversion) * 100 : null,
      changeLabel: priorLabel,
      goodDirection: 'up',
    },
    {
      key: 'fcf_margin',
      label: 'FCF Margin',
      unit: 'percent',
      value: fcfMargin,
      changePct: fcfMargin != null && priorFcfMargin != null ? fcfMargin - priorFcfMargin : null,
      changeLabel: priorLabel,
      goodDirection: 'up',
    },
  ];

  const trendData = annual.map((year) => ({
    fiscal_year: year.fiscal_year,
    cfo: year.cfo_cr,
    fcf: year.fcf_cr,
    conversion: cashConversionRatio(year) != null ? cashConversionRatio(year) * 100 : null,
  }));

  return { cards, trendData };
}

function computeWorkingCapitalTab(annual) {
  const { latest, prior } = latestAndPriorYear(annual);
  if (!latest) return null;

  const priorLabel = prior ? `vs ${prior.fiscal_year}` : null;
  const rDays = receivablesDays(latest);
  const priorRDays = prior ? receivablesDays(prior) : null;
  const pDays = payablesDays(latest);
  const priorPDays = prior ? payablesDays(prior) : null;
  const wcDays = workingCapitalDays(latest);
  const priorWcDays = prior ? workingCapitalDays(prior) : null;

  const cards = [
    {
      key: 'receivables',
      label: `Receivables (${latest.fiscal_year})`,
      unit: 'cr',
      value: latest.receivables_cr,
      changePct:
        prior && latest.receivables_cr != null && prior.receivables_cr != null
          ? yoyChangePct(latest.receivables_cr, prior.receivables_cr)
          : null,
      changeLabel: priorLabel,
      goodDirection: 'down',
    },
    {
      key: 'receivables_days',
      label: 'Receivables Days',
      unit: 'days',
      value: rDays,
      changePct: rDays != null && priorRDays != null ? rDays - priorRDays : null,
      changeLabel: priorLabel,
      goodDirection: 'down',
    },
    {
      key: 'payables_days',
      label: 'Payables Days',
      unit: 'days',
      value: pDays,
      changePct: pDays != null && priorPDays != null ? pDays - priorPDays : null,
      changeLabel: priorLabel,
      goodDirection: 'up',
    },
    {
      key: 'working_capital_days',
      label: 'Net Working Capital Days',
      unit: 'days',
      value: wcDays,
      changePct: wcDays != null && priorWcDays != null ? wcDays - priorWcDays : null,
      changeLabel: priorLabel,
      goodDirection: 'down',
    },
  ];

  const trendData = annual.map((year) => ({
    fiscal_year: year.fiscal_year,
    receivables: year.receivables_cr,
    payables: year.payables_cr,
    wcDays: workingCapitalDays(year),
  }));

  return { cards, trendData };
}

const KEY_RATIO_ROWS = [
  { key: 'revenue_growth', label: 'Revenue Growth (%)', unit: 'percent_signed', compute: (year, prior) => (prior ? yoyChangePct(year.revenue_cr, prior.revenue_cr) : null) },
  { key: 'ebitda_margin', label: 'EBITDA Margin (%)', unit: 'percent', compute: (year) => ebitdaMarginPct(year) },
  { key: 'net_profit_margin', label: 'Net Profit Margin (%)', unit: 'percent', compute: (year) => netProfitMarginPct(year) },
  { key: 'net_debt_to_ebitda', label: 'Net Debt / EBITDA (x)', unit: 'ratio_2dp', compute: (year) => debtToEbitda(year) },
  { key: 'interest_coverage', label: 'Interest Coverage (x)', unit: 'ratio', compute: (year) => interestCoverageRatio(year) },
  {
    key: 'cash_conversion',
    label: 'Cash Conversion (%)',
    unit: 'percent_0dp',
    compute: (year) => (cashConversionRatio(year) != null ? cashConversionRatio(year) * 100 : null),
  },
  { key: 'receivables_days', label: 'Receivables Days', unit: 'days_short', compute: (year) => receivablesDays(year) },
];

function computeKeyRatiosTab(annual) {
  return {
    years: annual.map((y) => y.fiscal_year),
    rows: KEY_RATIO_ROWS.map((row) => ({
      key: row.key,
      label: row.label,
      unit: row.unit,
      valuesByYear: annual.map((year, index) => ({
        fiscal_year: year.fiscal_year,
        value: row.compute(year, index > 0 ? annual[index - 1] : null),
      })),
    })),
  };
}

module.exports = {
  computeProfitabilityTab,
  computeLeverageTab,
  computeCashFlowTab,
  computeWorkingCapitalTab,
  computeKeyRatiosTab,
};
