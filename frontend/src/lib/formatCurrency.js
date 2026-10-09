const INR_GROUPING = new Intl.NumberFormat('en-IN');

const ONE_LAKH = 100_000;
const ONE_CRORE = 10_000_000;

/** Formats a raw rupee amount using Indian digit grouping, e.g. 10000000 -> "1,00,00,000". */
export function formatIndianNumber(value) {
  if (value === '' || value === null || value === undefined || Number.isNaN(Number(value))) return '';
  return INR_GROUPING.format(Number(value));
}

/** Strips grouping characters back out so an input value can be parsed as a plain number. */
export function parseIndianNumber(formatted) {
  const digitsOnly = String(formatted).replace(/[^\d]/g, '');
  return digitsOnly === '' ? '' : Number(digitsOnly);
}

/** Renders a rupee amount as a human-readable Lakh/Crore label, e.g. "₹1.00 Crore". */
export function formatAsLakhOrCrore(value) {
  const amount = Number(value);
  if (!amount || Number.isNaN(amount)) return '';

  if (amount >= ONE_CRORE) {
    return `₹${(amount / ONE_CRORE).toFixed(2)} Crore`;
  }
  if (amount >= ONE_LAKH) {
    return `₹${(amount / ONE_LAKH).toFixed(2)} Lakh`;
  }
  return `₹${INR_GROUPING.format(amount)}`;
}

/**
 * Renders a raw numeric analysis value for display according to the `unit`
 * hint the backend attaches to it. Every score, ratio and delta shown on
 * the dashboard is computed server-side (see backend/src/analysis/*) - this
 * is strictly presentation (symbols, suffixes, decimal places), the one
 * piece of number handling left on the frontend by design.
 *
 * `compact` drops the ₹/Cr wrapping for table cells whose column header
 * already states the unit (e.g. "Revenue (₹ Cr)"). `parensForNegative`
 * renders a negative amount as "(1,234)" instead of "-1,234", matching
 * standard accounting notation for a small number of rows (e.g. Net Debt in
 * the trend table) that call for it explicitly.
 */
export function formatMetricValue(value, unit, { compact = false, parensForNegative = false } = {}) {
  if (value == null || Number.isNaN(value)) return '—';

  if (unit === 'cr') {
    const rounded = Math.round(value);
    const grouped = formatIndianNumber(Math.abs(rounded));
    if (compact) {
      return rounded < 0 ? (parensForNegative ? `(${grouped})` : `-${grouped}`) : grouped;
    }
    const withSymbol = `₹${grouped} Cr`;
    return rounded < 0 ? (parensForNegative ? `(${withSymbol})` : `-${withSymbol}`) : withSymbol;
  }

  switch (unit) {
    case 'ratio':
      return `${value.toFixed(1)}x`;
    case 'ratio_2dp':
      return `${value.toFixed(2)}x`;
    case 'percent':
      return `${value.toFixed(1)}%`;
    case 'percent_0dp':
      return `${value.toFixed(0)}%`;
    case 'percent_2dp':
      return `${value.toFixed(2)}%`;
    case 'percent_signed':
      return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
    case 'days':
      return `${value.toFixed(0)} days`;
    case 'days_short':
      return `${value.toFixed(0)}d`;
    default:
      return String(value);
  }
}
