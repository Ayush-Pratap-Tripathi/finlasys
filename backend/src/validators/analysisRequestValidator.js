const { z } = require('zod');
const { creditAnalysisSchema } = require('../schemas/creditAnalysisSchema');

/**
 * Every analysis endpoint takes back exactly what /research handed the
 * frontend: the raw researched `data` (validated against the same fixed
 * contract the AI's output is checked against) and, where the computation
 * needs it, the `meta` envelope (loan amount requested, whether the run
 * used live web search, etc).
 */
const researchMetaSchema = z.object({
  requestedCompany: z.string().optional(),
  requestedLoanAmountInr: z.number().optional(),
  model: z.string().optional(),
  groundedWithLiveSearch: z.boolean().optional(),
  groundingFallbackReason: z.string().nullable().optional(),
  generatedAt: z.string().optional(),
});

const analysisWithDataOnlySchema = z.object({
  data: creditAnalysisSchema,
});

const analysisWithMetaSchema = z.object({
  data: creditAnalysisSchema,
  meta: researchMetaSchema,
});

function validateDataOnlyRequest(body) {
  return analysisWithDataOnlySchema.safeParse(body);
}

function validateWithMetaRequest(body) {
  return analysisWithMetaSchema.safeParse(body);
}

module.exports = { validateDataOnlyRequest, validateWithMetaRequest };
