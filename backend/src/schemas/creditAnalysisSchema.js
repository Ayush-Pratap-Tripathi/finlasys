const { z } = require('zod');

/**
 * This is the fixed contract for what raw research data every company
 * lookup must produce, regardless of which company or loan amount was
 * requested. The frontend's pages (Overview, Financial Health, Risk &
 * Opportunity Signals, Evidence & Sources, Lending Decision) are all built
 * to read from this shape.
 *
 * Deliberately NOT included here: scores, risk ratings, recommendations,
 * covenants, or scenario analysis. Those are derived/computed by our own
 * deterministic business logic from this raw data in a later stage - the AI
 * layer's only responsibility is finding and citing facts (Single
 * Responsibility), so the decision logic stays reproducible and auditable
 * instead of being a black box.
 */

const sourceRefSchema = z.object({
  name: z.string(),
  url: z.string(),
  role: z.enum(['primary', 'secondary']).optional(),
});

const annualFinancialsSchema = z.object({
  fiscal_year: z.string(),
  revenue_cr: z.number().nullable(),
  ebitda_cr: z.number().nullable(),
  depreciation_cr: z.number().nullable(),
  interest_cr: z.number().nullable(),
  net_profit_cr: z.number().nullable(),
  borrowings_cr: z.number().nullable(),
  cash_and_current_investments_cr: z.number().nullable(),
  receivables_cr: z.number().nullable(),
  payables_cr: z.number().nullable(),
  cfo_cr: z.number().nullable(),
  fcf_cr: z.number().nullable(),
  sources: z.array(sourceRefSchema).default([]),
});

const quarterSchema = z.object({
  quarter: z.string(),
  revenue_cr: z.number().nullable(),
  interest_cr: z.number().nullable(),
  net_profit_cr: z.number().nullable(),
});

const marketSchema = z.object({
  price_inr: z.number().nullable(),
  as_of: z.string().nullable(),
  market_cap_cr: z.number().nullable(),
  pe: z.number().nullable(),
});

const shareholdingSchema = z.object({
  promoter_pct: z.number().nullable(),
  fii_pct: z.number().nullable(),
  dii_pct: z.number().nullable(),
  pledge_pct: z.number().nullable(),
});

const qualitativeSchema = z.object({
  external_credit_rating: z.string().nullable(),
  key_risks: z.array(z.string()).default([]),
  recent_material_events: z.array(z.string()).default([]),
});

const sourceDirectoryEntrySchema = z.object({
  name: z.string(),
  url: z.string(),
  type: z.enum(['primary', 'secondary', 'other']),
  category: z.string(),
  reliability: z.number().min(1).max(5),
  last_used: z.string().nullable(),
  data_period: z.string().nullable(),
  status: z.enum(['verified', 'partial', 'unverified']),
  provides: z.array(z.string()).default([]),
  why_trusted: z.string(),
});

const discrepancyValueSchema = z.object({
  source: z.string(),
  value_cr: z.number(),
  role: z.enum(['primary', 'secondary']).optional(),
});

const discrepancySchema = z.object({
  metric: z.string(),
  // Not every discrepancy is a currency figure (e.g. shareholding % or a
  // ratio can disagree across sources too) - the frontend formats
  // `values[].value_cr` (and selected_value_cr) according to this unit
  // rather than assuming Rs crore for everything.
  unit: z.enum(['inr_cr', 'percent', 'ratio']).default('inr_cr'),
  values: z.array(discrepancyValueSchema).min(1),
  selected_value_cr: z.number().nullable(),
  selected_source: z.string().nullable(),
  difference_pct: z.number().nullable(),
  likely_reason: z.string(),
  severity: z.enum(['low', 'medium', 'high']),
});

const assumptionSchema = z.object({
  title: z.string(),
  what_we_assumed: z.string(),
  why_we_assumed_it: z.string(),
  how_we_applied_it: z.string(),
  impact: z.enum(['low', 'medium', 'high']),
  related_metrics: z.array(z.string()).default([]),
  confidence: z.enum(['low', 'medium', 'high', 'very_high']),
  source: sourceRefSchema.partial().nullable(),
});

const segmentRevenueByYearSchema = z.object({
  fiscal_year: z.string(),
  revenue_cr: z.number().nullable(),
});

const segmentSchema = z.object({
  name: z.string(),
  revenue_by_year: z.array(segmentRevenueByYearSchema).min(1),
  // Segment-level operating result for the latest year only - not every
  // company discloses this even when it discloses segment revenue.
  latest_ebitda_cr: z.number().nullable(),
});

const creditAnalysisSchema = z.object({
  company: z.object({
    name: z.string(),
    nse_ticker: z.string().nullable(),
    bse_code: z.string().nullable(),
    industry: z.string().nullable(),
    description: z.string().nullable(),
  }),
  annual: z.array(annualFinancialsSchema).min(1),
  latest_quarters: z.array(quarterSchema).default([]),
  // Business-segment or industry-vertical revenue breakdown, only when the
  // company's own segment-reporting note discloses one. Left empty for
  // single-segment companies or when no breakdown is disclosed - never a
  // forced or estimated split.
  segments: z.array(segmentSchema).default([]),
  market: marketSchema,
  shareholding: shareholdingSchema,
  qualitative: qualitativeSchema,
  sources_directory: z.array(sourceDirectoryEntrySchema).default([]),
  discrepancies: z.array(discrepancySchema).default([]),
  assumptions: z.array(assumptionSchema).default([]),
  data_quality_notes: z.array(z.string()).default([]),
});

// Human-readable mirror of the schema above, embedded directly in the AI
// prompt. Kept as a plain string (rather than generated from the zod schema)
// so the model sees a realistic example shape with inline hints - keep the
// two in sync when the schema changes.
const CREDIT_ANALYSIS_JSON_TEMPLATE = `{
  "company": { "name": "", "nse_ticker": "", "bse_code": "", "industry": "", "description": "" },
  "annual": [
    {
      "fiscal_year": "FY2026",
      "revenue_cr": 0,
      "ebitda_cr": 0,
      "depreciation_cr": 0,
      "interest_cr": 0,
      "net_profit_cr": 0,
      "borrowings_cr": 0,
      "cash_and_current_investments_cr": 0,
      "receivables_cr": null,
      "payables_cr": null,
      "cfo_cr": 0,
      "fcf_cr": 0,
      "sources": [ { "name": "", "url": "", "role": "primary|secondary" } ]
    }
    // ... one entry per fiscal year, oldest to newest, for the last 5 fiscal years available
  ],
  "latest_quarters": [
    { "quarter": "Q1 FY2027", "revenue_cr": 0, "interest_cr": 0, "net_profit_cr": 0 }
    // ... any quarters reported after the latest fiscal year end
  ],
  "segments": [
    {
      "name": "",
      "revenue_by_year": [
        { "fiscal_year": "FY2026", "revenue_cr": 0 }
        // ... one entry per fiscal year the segment note discloses, matching "annual" where possible
      ],
      "latest_ebitda_cr": null
    }
    // ... only if the company's annual report discloses a segment/vertical revenue breakdown;
    // leave this array EMPTY for single-segment companies or if no breakdown is disclosed
  ],
  "market": { "price_inr": 0, "as_of": "YYYY-MM-DD", "market_cap_cr": 0, "pe": null },
  "shareholding": { "promoter_pct": null, "fii_pct": null, "dii_pct": null, "pledge_pct": null },
  "qualitative": {
    "external_credit_rating": null,
    "key_risks": [],
    "recent_material_events": []
  },
  "sources_directory": [
    {
      "name": "",
      "url": "",
      "type": "primary|secondary|other",
      "category": "Financial Statement|Exchange Filing|Announcements|Financial Data|Other Public Source",
      "reliability": 5,
      "last_used": "YYYY-MM-DD",
      "data_period": "FY2026",
      "status": "verified|partial|unverified",
      "provides": ["Income Statement", "Balance Sheet"],
      "why_trusted": ""
    }
    // ... every source actually used above, deduplicated
  ],
  "discrepancies": [
    {
      "metric": "Total Debt (FY2026)",
      "unit": "inr_cr",
      // "unit" must match what "values[].value_cr" actually holds: "inr_cr" for a
      // Rs crore figure, "percent" for something like a shareholding percentage,
      // "ratio" for a multiple like an interest-coverage ratio - never assume Rs crore
      "values": [ { "source": "", "value_cr": 0, "role": "primary|secondary" } ],
      "selected_value_cr": 0,
      "selected_source": "",
      "difference_pct": 0,
      "likely_reason": "",
      "severity": "low|medium|high"
    }
    // ... only where sources genuinely disagree on the same metric
  ],
  "assumptions": [
    {
      "title": "",
      "what_we_assumed": "",
      "why_we_assumed_it": "",
      "how_we_applied_it": "",
      "impact": "low|medium|high",
      "related_metrics": [],
      "confidence": "low|medium|high|very_high",
      "source": { "name": "", "url": "" }
    }
    // ... only where you had to estimate, normalize, or make a judgment call
  ],
  "data_quality_notes": []
}`;

module.exports = { creditAnalysisSchema, CREDIT_ANALYSIS_JSON_TEMPLATE };
