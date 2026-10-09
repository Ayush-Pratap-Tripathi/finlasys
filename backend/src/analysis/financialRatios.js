/**
 * Pure, reusable calculations over a single annual-financials record (one
 * entry from data.annual). Kept separate from signal/score logic so each
 * formula is independently testable and has exactly one definition used
 * everywhere it's needed (cards, tables, signal detectors).
 */

function yoyChangePct(current, previous) {
  if (current == null || previous == null || previous === 0) return null;
  return ((current - previous) / Math.abs(previous)) * 100;
}

function ebitdaMarginPct(year) {
  if (!year || !year.revenue_cr) return null;
  return (year.ebitda_cr / year.revenue_cr) * 100;
}

function cfoMarginPct(year) {
  if (!year || !year.revenue_cr) return null;
  return (year.cfo_cr / year.revenue_cr) * 100;
}

function interestCoverageRatio(year) {
  if (!year || !year.interest_cr) return null;
  return year.ebitda_cr / year.interest_cr;
}

/**
 * Net debt = borrowings - cash. Negative means the company holds more cash
 * than it owes (a net cash position) rather than "negative debt", so this
 * is returned as a signed value and callers decide how to label it (see
 * the "Net Debt" vs "Net Cash" handling in KeyIndicatorsGrid).
 */
function netDebt(year) {
  if (!year || year.borrowings_cr == null || year.cash_and_current_investments_cr == null) return null;
  return year.borrowings_cr - year.cash_and_current_investments_cr;
}

function cashConversionRatio(year) {
  if (!year || !year.ebitda_cr) return null;
  return year.cfo_cr / year.ebitda_cr;
}

function netProfitMarginPct(year) {
  if (!year || !year.revenue_cr) return null;
  return (year.net_profit_cr / year.revenue_cr) * 100;
}

function fcfMarginPct(year) {
  if (!year || !year.revenue_cr || year.fcf_cr == null) return null;
  return (year.fcf_cr / year.revenue_cr) * 100;
}

function debtToEbitda(year) {
  const debt = netDebt(year);
  if (debt == null || !year.ebitda_cr) return null;
  return debt / year.ebitda_cr;
}

/**
 * Days outstanding approximated against revenue rather than COGS/purchases,
 * since the schema doesn't carry cost-of-goods-sold - a documented
 * simplification, not a hidden one (surfaced in the Working Capital tab's
 * methodology note).
 */
function receivablesDays(year) {
  if (!year || !year.revenue_cr || year.receivables_cr == null) return null;
  return (year.receivables_cr / year.revenue_cr) * 365;
}

function payablesDays(year) {
  if (!year || !year.revenue_cr || year.payables_cr == null) return null;
  return (year.payables_cr / year.revenue_cr) * 365;
}

function workingCapitalDays(year) {
  const rDays = receivablesDays(year);
  const pDays = payablesDays(year);
  if (rDays == null || pDays == null) return null;
  return rDays - pDays;
}

function latestAndPriorYear(annual) {
  if (!annual || annual.length === 0) return { latest: null, prior: null };
  const latest = annual[annual.length - 1];
  const prior = annual.length > 1 ? annual[annual.length - 2] : null;
  return { latest, prior };
}

module.exports = {
  yoyChangePct,
  ebitdaMarginPct,
  cfoMarginPct,
  interestCoverageRatio,
  netDebt,
  cashConversionRatio,
  netProfitMarginPct,
  fcfMarginPct,
  debtToEbitda,
  receivablesDays,
  payablesDays,
  workingCapitalDays,
  latestAndPriorYear,
};
