const { CREDIT_ANALYSIS_JSON_TEMPLATE } = require('../schemas/creditAnalysisSchema');

const SHARED_RULES = `- Report CONSOLIDATED figures in Rs crore for the last 5 fiscal years, plus any quarters reported after the latest fiscal year end.
- Attach at least one source (name + url) to every fiscal year's figures, and list every distinct source you used in "sources_directory" with an honest reliability rating (1-5) and why you trust it.
- If two sources disagree on a metric, record it in "discrepancies" with both values, which one you selected as authoritative and why, and a likely reason for the mismatch (e.g. Ind AS vs IFRS basis, lease liabilities included/excluded, restated financials, timing differences).
- If you had to estimate, normalize, or make a judgment call to fill a gap (e.g. annualizing a quarter's interest expense, normalizing an effective tax rate, deciding whether lease liabilities count as debt, deriving receivables from debtor days), record it as an "assumption" with what you assumed, why, how you applied it, and your confidence.
- If a figure is genuinely unavailable, use null. NEVER invent or silently estimate a number without recording it as an assumption.
- Check whether the company's annual report discloses a business-segment or industry-vertical revenue breakdown (a "Segment Reporting" note). If it does, populate "segments" with each segment's name and revenue for as many of the 5 fiscal years as disclosed, plus segment-level EBITDA/operating result for the latest year if that is disclosed too. If the company is single-segment or does not disclose a breakdown, leave "segments" as an empty array - do not invent or force a split that isn't actually reported.
- Respond with ONLY a single valid JSON object matching the schema below. No markdown code fences, no commentary, no text before or after the JSON.`;

// IMPORTANT: only used when a search tool is actually attached to the
// request. Telling the model to "use web search" when no tool is available
// makes some Gemini models attempt a tool call that doesn't exist, which
// aborts generation with finishReason MALFORMED_FUNCTION_CALL instead of
// producing any text.
const GROUNDED_SYSTEM_INSTRUCTION = `You are the data-gathering layer of a credit-analysis application for Indian listed companies. Your only job is to research and report facts with sources. You must NOT calculate scores, ratios, risk ratings, or a lending recommendation - that is handled by a separate deterministic module downstream.

Rules:
- Use web search to find current, primary-source data. Prefer the company's own investor-relations filings and BSE/NSE exchange filings. Use screener.in, moneycontrol, or similar aggregators only as secondary corroboration.
${SHARED_RULES}`;

// Used only as a fallback when live search is unavailable (e.g. grounding
// quota exhausted). Explicitly tells the model it has no live web access so
// it never implies freshness or verification it can't back up.
const FALLBACK_SYSTEM_INSTRUCTION = `You are the data-gathering layer of a credit-analysis application for Indian listed companies. You do NOT have live web access right now - answer using your best existing knowledge of this company's public financial filings. Your only job is to report facts with sources. You must NOT calculate scores, ratios, risk ratings, or a lending recommendation - that is handled by a separate deterministic module downstream.

Rules:
- Base every figure on your training knowledge of this company's public filings, and cite the source you recall it from (name + url) even though you cannot verify it live.
- Add a data_quality_note stating explicitly that figures were not verified against a live source and may be out of date.
${SHARED_RULES}`;

function buildSystemInstruction({ grounded }) {
  return grounded ? GROUNDED_SYSTEM_INSTRUCTION : FALLBACK_SYSTEM_INSTRUCTION;
}

function buildUserPrompt({ companyName, loanAmountInr }) {
  const loanAmountCr = (loanAmountInr / 1e7).toFixed(2);
  const loanAmountFormatted = loanAmountInr.toLocaleString('en-IN');

  return `Research the Indian publicly listed company: "${companyName}".

Context: this company has requested a working-capital loan of Rs ${loanAmountCr} crore (Rs ${loanAmountFormatted}). This context only tells you where to focus research depth (e.g. liquidity, leverage, receivables quality matter more for larger loan requests) - do not compute a recommendation or score.

Return ONLY a single JSON object matching this schema (field names, nesting, and types must match exactly; the values shown are placeholders/examples, replace them with real researched data, and use null anywhere data is genuinely unavailable):

${CREDIT_ANALYSIS_JSON_TEMPLATE}`;
}

module.exports = { buildSystemInstruction, buildUserPrompt };
