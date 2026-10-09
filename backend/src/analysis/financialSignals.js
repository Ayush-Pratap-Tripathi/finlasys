const {
  yoyChangePct,
  ebitdaMarginPct,
  interestCoverageRatio,
  netDebt,
  debtToEbitda,
  workingCapitalDays,
  latestAndPriorYear,
} = require('./financialRatios');

/**
 * Rule-based risk/opportunity signal detectors. Each function inspects the
 * latest vs. prior year and returns either a signal object or null if it
 * doesn't apply/there isn't enough data - nothing is force-fit into always
 * producing an opinion. `severity` drives sort order and badge tone:
 * danger > warning > success.
 *
 * Each signal carries everything the Risk & Opportunity Signals page needs
 * to render a full card: `metrics` (2-3 stat boxes), `impact` (direction +
 * plain-language consequence), and `chartKeys` (which fields from
 * buildSignalTrendData to plot). The Overview page's top-3 summary only
 * reads id/title/description/severity/badgeLabel - the extra fields are
 * additive, not a breaking change to that consumer.
 */

const SEVERITY_WEIGHT = { danger: 3, warning: 2, success: 1 };

/** One row per fiscal year with every field any signal's mini-chart might plot. */
function buildSignalTrendData(annual) {
  return annual.map((year) => ({
    fiscal_year: year.fiscal_year,
    revenue: year.revenue_cr,
    ebitda: year.ebitda_cr,
    netProfit: year.net_profit_cr,
    receivables: year.receivables_cr,
    borrowings: year.borrowings_cr,
    cfo: year.cfo_cr,
    ebitdaMargin: ebitdaMarginPct(year),
    interestCoverage: interestCoverageRatio(year),
    debtToEbitda: debtToEbitda(year),
    workingCapitalDays: workingCapitalDays(year),
  }));
}

function pct(value) {
  return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
}

function receivablesOutpacingRevenue(latest, prior) {
  const receivablesGrowth = yoyChangePct(latest.receivables_cr, prior.receivables_cr);
  const revenueGrowth = yoyChangePct(latest.revenue_cr, prior.revenue_cr);
  if (receivablesGrowth == null || revenueGrowth == null) return null;

  const gap = receivablesGrowth - revenueGrowth;
  if (gap < 3) return null;

  const severity = gap >= 15 ? 'danger' : 'warning';
  return {
    id: 'receivables-outpacing-revenue',
    title: 'Receivables growing faster than revenue',
    description: `Receivables grew ${receivablesGrowth.toFixed(0)}% while revenue grew ${revenueGrowth.toFixed(0)}% in ${latest.fiscal_year}, indicating increasing working-capital pressure.`,
    severity,
    badgeLabel: severity === 'danger' ? 'HIGH RISK' : 'MODERATE RISK',
    metrics: [
      { label: 'Receivables Growth', value: pct(receivablesGrowth) },
      { label: 'Revenue Growth', value: pct(revenueGrowth) },
      { label: 'Gap', value: `${gap.toFixed(0)}pp` },
    ],
    impact: {
      direction: 'negative',
      text: 'High receivables growth can lead to cash flow pressure and higher working-capital requirements.',
    },
    chartKeys: [
      { key: 'receivables', label: 'Receivables (₹ Cr)', color: '#2563eb' },
      { key: 'revenue', label: 'Revenue (₹ Cr)', color: '#16a34a' },
    ],
  };
}

function debtOutpacingEbitda(latest, prior) {
  if (!latest.borrowings_cr || !prior.borrowings_cr) return null; // no meaningful debt base
  const debtGrowth = yoyChangePct(latest.borrowings_cr, prior.borrowings_cr);
  const ebitdaGrowth = yoyChangePct(latest.ebitda_cr, prior.ebitda_cr);
  if (debtGrowth == null || ebitdaGrowth == null) return null;

  const gap = debtGrowth - ebitdaGrowth;
  if (gap < 5) return null;

  const severity = gap >= 20 ? 'danger' : 'warning';
  return {
    id: 'debt-outpacing-ebitda',
    title: 'Debt increasing faster than EBITDA',
    description: `Borrowings grew ${debtGrowth.toFixed(0)}% while EBITDA grew ${ebitdaGrowth.toFixed(0)}% in ${latest.fiscal_year}, causing leverage to inch up.`,
    severity,
    badgeLabel: severity === 'danger' ? 'HIGH RISK' : 'MODERATE RISK',
    metrics: [
      { label: 'Debt Growth', value: pct(debtGrowth) },
      { label: 'EBITDA Growth', value: pct(ebitdaGrowth) },
      { label: 'Gap', value: `${gap.toFixed(0)}pp` },
    ],
    impact: {
      direction: 'negative',
      text: 'Rising leverage may reduce financial flexibility and increase risk in case of earnings volatility.',
    },
    chartKeys: [
      { key: 'borrowings', label: 'Borrowings (₹ Cr)', color: '#dc2626' },
      { key: 'ebitda', label: 'EBITDA (₹ Cr)', color: '#16a34a' },
    ],
  };
}

function cashFlowLaggingProfit(latest, prior) {
  const profitGrowth = yoyChangePct(latest.net_profit_cr, prior.net_profit_cr);
  const cfoGrowth = yoyChangePct(latest.cfo_cr, prior.cfo_cr);
  if (profitGrowth == null || cfoGrowth == null) return null;
  if (!(profitGrowth > 0 && cfoGrowth < 0)) return null;

  return {
    id: 'cash-flow-lagging-profit',
    title: 'Profit growing but cash generation declined',
    description: `Net profit grew ${profitGrowth.toFixed(0)}% in ${latest.fiscal_year} while operating cash flow fell ${Math.abs(cfoGrowth).toFixed(0)}%, worth watching for earnings quality.`,
    severity: 'warning',
    badgeLabel: 'MODERATE RISK',
    metrics: [
      { label: 'Net Profit Growth', value: pct(profitGrowth) },
      { label: 'Operating Cash Flow Growth', value: pct(cfoGrowth) },
    ],
    impact: {
      direction: 'negative',
      text: 'A widening gap between profit and cash generation can signal aggressive revenue recognition or collection delays.',
    },
    chartKeys: [
      { key: 'netProfit', label: 'Net Profit (₹ Cr)', color: '#2563eb' },
      { key: 'cfo', label: 'Operating Cash Flow (₹ Cr)', color: '#d97706' },
    ],
  };
}

function marginTrend(latest, prior) {
  const latestMargin = ebitdaMarginPct(latest);
  const priorMargin = ebitdaMarginPct(prior);
  if (latestMargin == null || priorMargin == null) return null;

  const changePp = latestMargin - priorMargin;
  if (Math.abs(changePp) < 0.5) return null;

  const metrics = [
    { label: `EBITDA Margin (${latest.fiscal_year})`, value: `${latestMargin.toFixed(1)}%` },
    { label: `EBITDA Margin (${prior.fiscal_year})`, value: `${priorMargin.toFixed(1)}%` },
    { label: 'Change', value: `${changePp >= 0 ? '+' : ''}${changePp.toFixed(1)}pp` },
  ];
  const chartKeys = [{ key: 'ebitdaMargin', label: 'EBITDA Margin (%)', color: '#2563eb' }];

  if (changePp > 0) {
    return {
      id: 'margin-improving',
      title: 'Strong profitability and margins',
      description: `EBITDA margin improved to ${latestMargin.toFixed(1)}% in ${latest.fiscal_year} from ${priorMargin.toFixed(1)}%, reflecting operational efficiency.`,
      severity: 'success',
      badgeLabel: 'POSITIVE',
      metrics,
      impact: { direction: 'positive', text: 'Healthy and improving margins provide a buffer for debt servicing and support business stability.' },
      chartKeys,
    };
  }

  return {
    id: 'margin-declining',
    title: 'EBITDA margin compression',
    description: `EBITDA margin fell to ${latestMargin.toFixed(1)}% in ${latest.fiscal_year} from ${priorMargin.toFixed(1)}%, worth monitoring against cost trends.`,
    severity: 'warning',
    badgeLabel: 'MODERATE RISK',
    metrics,
    impact: { direction: 'negative', text: 'Margin compression can pressure profitability and debt-servicing capacity if the trend continues.' },
    chartKeys,
  };
}

function interestCoverageStrength(latest) {
  const coverage = interestCoverageRatio(latest);
  if (coverage == null) return null;

  if (coverage < 2) {
    return {
      id: 'coverage-weak',
      title: 'Interest coverage is thin',
      description: `EBITDA covers interest expense only ${coverage.toFixed(1)}x in ${latest.fiscal_year}, leaving little cushion if earnings soften.`,
      severity: 'danger',
      badgeLabel: 'HIGH RISK',
      metrics: [{ label: 'Interest Coverage', value: `${coverage.toFixed(1)}x` }],
      impact: { direction: 'negative', text: 'Thin coverage leaves little room for an earnings downturn without risking debt-servicing capacity.' },
      chartKeys: [{ key: 'interestCoverage', label: 'Interest Coverage (x)', color: '#dc2626' }],
    };
  }
  if (coverage > 10) {
    return {
      id: 'coverage-strong',
      title: 'Very strong interest coverage',
      description: `EBITDA covers interest expense ${coverage.toFixed(1)}x in ${latest.fiscal_year}, indicating minimal debt-servicing risk.`,
      severity: 'success',
      badgeLabel: 'POSITIVE',
      metrics: [{ label: 'Interest Coverage', value: `${coverage.toFixed(1)}x` }],
      impact: { direction: 'positive', text: 'Very high EBITDA coverage of interest expense indicates minimal debt-servicing risk.' },
      chartKeys: [{ key: 'interestCoverage', label: 'Interest Coverage (x)', color: '#16a34a' }],
    };
  }
  return null;
}

function profitGrowthSignal(latest, prior) {
  const growth = yoyChangePct(latest.net_profit_cr, prior.net_profit_cr);
  if (growth == null || growth < 8) return null;

  return {
    id: 'profit-growth',
    title: 'Double-digit profit growth',
    description: `Net profit grew ${growth.toFixed(0)}% in ${latest.fiscal_year} versus the prior year.`,
    severity: 'success',
    badgeLabel: 'POSITIVE',
    metrics: [{ label: 'Net Profit Growth', value: pct(growth) }],
    impact: { direction: 'positive', text: 'Consistent, strong profit growth strengthens the overall credit profile.' },
    chartKeys: [{ key: 'netProfit', label: 'Net Profit (₹ Cr)', color: '#16a34a' }],
  };
}

function leveragePosition(latest, prior) {
  const ratio = debtToEbitda(latest);
  if (ratio == null) return null;
  const priorRatio = debtToEbitda(prior);

  if (ratio <= 0) {
    const debt = netDebt(latest);
    return {
      id: 'net-cash-position',
      title: 'Net-cash balance sheet',
      description: `The company holds more cash than debt in ${latest.fiscal_year} (net debt/EBITDA of ${ratio.toFixed(2)}x), giving it a debt-free or net-cash position.`,
      severity: 'success',
      badgeLabel: 'POSITIVE',
      metrics: [
        { label: 'Net Debt / EBITDA', value: `${ratio.toFixed(2)}x` },
        { label: 'Net Cash', value: `₹${Math.abs(Math.round(debt)).toLocaleString('en-IN')} Cr` },
      ],
      impact: {
        direction: 'positive',
        text: 'A net-cash position gives significant flexibility to fund growth or absorb shocks without relying on external borrowing.',
      },
      chartKeys: [{ key: 'debtToEbitda', label: 'Net Debt / EBITDA (x)', color: '#16a34a' }],
    };
  }

  if (priorRatio != null && ratio - priorRatio >= 0.5) {
    return {
      id: 'leverage-increasing',
      title: 'Leverage trending up',
      description: `Net debt/EBITDA rose to ${ratio.toFixed(2)}x in ${latest.fiscal_year} from ${priorRatio.toFixed(2)}x, a meaningful increase in leverage.`,
      severity: ratio >= 3 ? 'danger' : 'warning',
      badgeLabel: ratio >= 3 ? 'HIGH RISK' : 'MODERATE RISK',
      metrics: [
        { label: `Net Debt / EBITDA (${latest.fiscal_year})`, value: `${ratio.toFixed(2)}x` },
        { label: `Net Debt / EBITDA (${prior.fiscal_year})`, value: `${priorRatio.toFixed(2)}x` },
      ],
      impact: { direction: 'negative', text: 'Rising leverage reduces headroom for further borrowing and increases sensitivity to earnings shocks.' },
      chartKeys: [{ key: 'debtToEbitda', label: 'Net Debt / EBITDA (x)', color: '#d97706' }],
    };
  }

  return null;
}

function workingCapitalPressure(latest, prior) {
  const latestDays = workingCapitalDays(latest);
  const priorDays = workingCapitalDays(prior);
  if (latestDays == null || priorDays == null) return null;

  const changeDays = latestDays - priorDays;
  if (changeDays < 5) return null;

  return {
    id: 'working-capital-rising',
    title: 'Working-capital requirements rising',
    description: `Net working-capital days increased to ${latestDays.toFixed(0)} in ${latest.fiscal_year} from ${priorDays.toFixed(0)} in ${prior.fiscal_year}, tying up more cash in operations.`,
    severity: changeDays >= 15 ? 'danger' : 'warning',
    badgeLabel: changeDays >= 15 ? 'HIGH RISK' : 'MODERATE RISK',
    metrics: [
      { label: `WC Days (${latest.fiscal_year})`, value: `${latestDays.toFixed(0)}d` },
      { label: `WC Days (${prior.fiscal_year})`, value: `${priorDays.toFixed(0)}d` },
      { label: 'Change', value: `+${changeDays.toFixed(0)}d` },
    ],
    impact: { direction: 'negative', text: 'Rising working-capital days mean more cash is tied up in operations rather than available for debt service.' },
    chartKeys: [{ key: 'workingCapitalDays', label: 'Working Capital Days', color: '#d97706' }],
  };
}

const DETECTORS = [
  receivablesOutpacingRevenue,
  debtOutpacingEbitda,
  cashFlowLaggingProfit,
  marginTrend,
  interestCoverageStrength,
  profitGrowthSignal,
  leveragePosition,
  workingCapitalPressure,
];

/** Runs every detector and returns all signals it found, sorted danger -> warning -> success. */
function computeAllSignals(annual) {
  const { latest, prior } = latestAndPriorYear(annual);
  if (!latest || !prior) return [];

  const signals = DETECTORS.map((detect) => detect(latest, prior)).filter(Boolean);

  return signals.sort((a, b) => SEVERITY_WEIGHT[b.severity] - SEVERITY_WEIGHT[a.severity]);
}

function computeTopSignals(annual, count = 3) {
  return computeAllSignals(annual).slice(0, count);
}

/**
 * A signal-driven risk score, deliberately separate from the Financial
 * Health Score (see financialHealthScore.js): this one only reflects how
 * many risk signals fired and how severe they are, not the underlying
 * fundamentals directly, so it answers "how much is flagged right now"
 * rather than "how strong is the balance sheet".
 */
function computeRiskScore(signals) {
  const BASE = 35;
  const weighted = signals.reduce((total, signal) => {
    if (signal.severity === 'danger') return total + 18;
    if (signal.severity === 'warning') return total + 9;
    return total - 7; // success
  }, BASE);

  const score = Math.min(100, Math.max(0, Math.round(weighted)));

  let label = 'LOW RISK';
  let tone = 'success';
  if (score >= 65) {
    label = 'HIGH RISK';
    tone = 'danger';
  } else if (score >= 35) {
    label = 'MODERATE RISK';
    tone = 'warning';
  }

  const descriptions = {
    'LOW RISK': 'Few or no risk signals identified; the data supports a favorable risk profile.',
    'MODERATE RISK': 'Some risks are present, but manageable with proper monitoring and conditions.',
    'HIGH RISK': 'Multiple significant risk signals were identified that warrant careful review before lending.',
  };

  return { score, label, tone, description: descriptions[label] };
}

module.exports = { buildSignalTrendData, computeAllSignals, computeTopSignals, computeRiskScore };
