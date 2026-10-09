const { yoyChangePct, ebitdaMarginPct, interestCoverageRatio, netDebt, latestAndPriorYear } = require('./financialRatios');

/**
 * The 6-card "Key Financial Indicators" strip and the "Recent Financial
 * Trend Summary" table on the Overview page. Each indicator/row carries a
 * raw numeric `value` (or `recentValues`/`allValues`) plus a `unit` hint
 * ('cr' | 'ratio' | 'percent') so the frontend can format it - formatting a
 * number for display is a presentation concern, not part of the analysis.
 */

function computeKeyIndicators(annual) {
  const { latest, prior } = latestAndPriorYear(annual);
  if (!latest) return null;

  const priorLabel = prior ? `vs ${prior.fiscal_year}` : null;
  const trendOf = (key) => annual.map((year) => year[key]);

  const debt = netDebt(latest);
  const priorDebt = prior ? netDebt(prior) : null;
  const isNetCash = debt != null && debt < 0;

  const margin = ebitdaMarginPct(latest);
  const priorMargin = prior ? ebitdaMarginPct(prior) : null;

  const coverage = interestCoverageRatio(latest);

  return {
    fiscalYear: latest.fiscal_year,
    indicators: [
      {
        key: 'revenue',
        label: 'Revenue',
        unit: 'cr',
        value: latest.revenue_cr,
        changePct: prior ? yoyChangePct(latest.revenue_cr, prior.revenue_cr) : null,
        changeLabel: priorLabel,
        trendValues: trendOf('revenue_cr'),
        goodDirection: 'up',
      },
      {
        key: 'ebitda',
        label: 'EBITDA',
        unit: 'cr',
        value: latest.ebitda_cr,
        changePct: prior ? yoyChangePct(latest.ebitda_cr, prior.ebitda_cr) : null,
        changeLabel: priorLabel,
        trendValues: trendOf('ebitda_cr'),
        goodDirection: 'up',
      },
      {
        key: 'net_profit',
        label: 'Net Profit',
        unit: 'cr',
        value: latest.net_profit_cr,
        changePct: prior ? yoyChangePct(latest.net_profit_cr, prior.net_profit_cr) : null,
        changeLabel: priorLabel,
        trendValues: trendOf('net_profit_cr'),
        goodDirection: 'up',
      },
      {
        key: 'net_debt',
        label: isNetCash ? 'Net Cash' : 'Net Debt',
        unit: 'cr',
        value: debt != null ? Math.abs(debt) : null,
        changePct: debt != null && priorDebt != null ? yoyChangePct(Math.abs(debt), Math.abs(priorDebt)) : null,
        changeLabel: priorLabel,
        trendValues: annual.map((year) => Math.abs(netDebt(year) ?? 0)),
        // Growing net debt is bad; growing net cash is good.
        goodDirection: isNetCash ? 'up' : 'down',
      },
      {
        key: 'interest_coverage',
        label: 'Interest Coverage',
        unit: 'ratio',
        value: coverage,
        changePct:
          prior && coverage != null && interestCoverageRatio(prior) != null
            ? yoyChangePct(coverage, interestCoverageRatio(prior))
            : null,
        changeLabel: priorLabel,
        trendValues: annual.map((year) => interestCoverageRatio(year)).filter((v) => v != null),
        goodDirection: 'up',
      },
      {
        key: 'ebitda_margin',
        label: 'EBITDA Margin',
        unit: 'percent',
        value: margin,
        changePct: margin != null && priorMargin != null ? margin - priorMargin : null,
        changeLabel: priorLabel,
        trendValues: annual.map((year) => ebitdaMarginPct(year)).filter((v) => v != null),
        goodDirection: 'up',
      },
    ],
  };
}

const TREND_ROWS = [
  { key: 'revenue', label: 'Revenue (₹ Cr)', unit: 'cr', accessor: (year) => year.revenue_cr },
  { key: 'ebitda', label: 'EBITDA (₹ Cr)', unit: 'cr', accessor: (year) => year.ebitda_cr },
  { key: 'net_profit', label: 'Net Profit (₹ Cr)', unit: 'cr', accessor: (year) => year.net_profit_cr },
  { key: 'net_debt', label: 'Net Debt (₹ Cr)', unit: 'cr', parensForNegative: true, accessor: (year) => netDebt(year) },
  { key: 'interest_coverage', label: 'Interest Coverage (x)', unit: 'ratio', accessor: (year) => interestCoverageRatio(year) },
];

function computeFinancialTrendSummary(annual) {
  const recentYears = annual.slice(-3);
  if (recentYears.length === 0) return null;

  return {
    years: recentYears.map((y) => y.fiscal_year),
    rows: TREND_ROWS.map((row) => ({
      key: row.key,
      label: row.label,
      unit: row.unit,
      parensForNegative: Boolean(row.parensForNegative),
      recentValues: recentYears.map((year) => row.accessor(year)),
      allValues: annual.map(row.accessor).filter((v) => v != null),
    })),
  };
}

module.exports = { computeKeyIndicators, computeFinancialTrendSummary };
