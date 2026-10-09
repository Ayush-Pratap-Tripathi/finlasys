const { yoyChangePct, latestAndPriorYear } = require('./financialRatios');

/**
 * Derives everything the Segment View tab needs from the raw `segments`
 * array researched by the backend (name + per-year revenue + latest EBITDA
 * only - see backend/src/schemas/creditAnalysisSchema.js). All margins,
 * shares, growth rates, and "largest/highest-margin" picks are computed
 * here, not asked of the AI, for the same reason every other ratio on this
 * page is: reproducible, auditable numbers instead of a black box.
 */

function revenueForYear(segment, fiscalYear) {
  const entry = segment.revenue_by_year.find((y) => y.fiscal_year === fiscalYear);
  return entry?.revenue_cr ?? null;
}

function computeSegmentSummary(segments, annual) {
  if (!segments || segments.length === 0) return null;

  const { latest, prior } = latestAndPriorYear(annual);
  if (!latest) return null;

  const rows = segments
    .map((segment) => {
      const latestRevenue = revenueForYear(segment, latest.fiscal_year);
      const priorRevenue = prior ? revenueForYear(segment, prior.fiscal_year) : null;
      const margin = latestRevenue && segment.latest_ebitda_cr != null ? (segment.latest_ebitda_cr / latestRevenue) * 100 : null;

      return {
        name: segment.name,
        revenueCr: latestRevenue,
        ebitdaCr: segment.latest_ebitda_cr,
        marginPct: margin,
        yoyGrowthPct: latestRevenue != null && priorRevenue != null ? yoyChangePct(latestRevenue, priorRevenue) : null,
        trend: segment.revenue_by_year,
      };
    })
    .filter((row) => row.revenueCr != null);

  const totalRevenue = rows.reduce((sum, row) => sum + row.revenueCr, 0);
  const totalEbitda = rows.reduce((sum, row) => sum + (row.ebitdaCr ?? 0), 0);
  const priorTotalRevenue = rows.reduce((sum, row) => {
    const prior_ = prior ? revenueForYear(segments.find((s) => s.name === row.name), prior.fiscal_year) : null;
    return sum + (prior_ ?? 0);
  }, 0);

  const rowsWithShare = rows
    .map((row) => ({ ...row, sharePct: totalRevenue ? (row.revenueCr / totalRevenue) * 100 : null }))
    .sort((a, b) => b.revenueCr - a.revenueCr);

  const largestSegment = rowsWithShare[0] ?? null;
  const highestMarginSegment = rows.filter((r) => r.marginPct != null).sort((a, b) => b.marginPct - a.marginPct)[0] ?? null;

  return {
    fiscalYear: latest.fiscal_year,
    segmentCount: segments.length,
    totalRevenueCr: totalRevenue,
    totalEbitdaCr: totalEbitda,
    totalRevenueYoyPct: priorTotalRevenue ? yoyChangePct(totalRevenue, priorTotalRevenue) : null,
    largestSegment,
    highestMarginSegment,
    rows: rowsWithShare,
  };
}

/** Chart-ready rows: one object per fiscal year, one key per segment. */
function buildSegmentTrendData(segments) {
  if (!segments || segments.length === 0) return [];

  const years = segments[0].revenue_by_year.map((y) => y.fiscal_year);

  return years.map((fiscalYear) => {
    const row = { fiscal_year: fiscalYear };
    segments.forEach((segment) => {
      row[segment.name] = revenueForYear(segment, fiscalYear);
    });
    return row;
  });
}

module.exports = { computeSegmentSummary, buildSegmentTrendData };
