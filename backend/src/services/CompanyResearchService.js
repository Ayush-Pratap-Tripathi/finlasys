const extractJson = require('../utils/extractJson');
const { buildUserPrompt, buildSystemInstruction } = require('../prompts/creditAnalysisPrompt');
const { creditAnalysisSchema } = require('../schemas/creditAnalysisSchema');
const { AIResponseParseError, AIResponseValidationError } = require('../errors/AppError');

const MAX_ATTEMPTS = 2;

/**
 * Orchestrates a single company research request: build the prompt, call
 * whichever AIProvider was injected, then parse and validate the result
 * against the fixed schema. Depends only on the AIProvider abstraction, so
 * the provider (Gemini today) can be swapped for another implementation
 * without any change here (Dependency Inversion + Open/Closed).
 *
 * Retries once on parse/validation failure: LLM output is stochastic, and a
 * malformed or schema-invalid response is usually a one-off generation slip
 * rather than a systemic problem, so a second attempt commonly succeeds
 * where re-parsing the same broken text never would.
 */
class CompanyResearchService {
  constructor(aiProvider) {
    this.aiProvider = aiProvider;
  }

  async researchCompany({ companyName, loanAmountInr }) {
    const userPrompt = buildUserPrompt({ companyName, loanAmountInr });

    let lastError;
    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
      try {
        return await this._attemptOnce({ userPrompt, companyName, loanAmountInr });
      } catch (err) {
        const isRetryable = err instanceof AIResponseParseError || err instanceof AIResponseValidationError;
        if (!isRetryable || attempt === MAX_ATTEMPTS) {
          throw err;
        }
        lastError = err;
      }
    }
    throw lastError;
  }

  async _attemptOnce({ userPrompt, companyName, loanAmountInr }) {
    const { text, grounded, groundingFallbackReason } = await this.aiProvider.generateGroundedJSON({
      getSystemInstruction: buildSystemInstruction,
      userPrompt,
    });

    let parsed;
    try {
      parsed = extractJson(text);
    } catch (err) {
      throw new AIResponseParseError(`Could not parse AI response as JSON: ${err.message}`, {
        rawText: text,
      });
    }

    const validation = creditAnalysisSchema.safeParse(parsed);
    if (!validation.success) {
      throw new AIResponseValidationError('AI response did not match the required data schema', {
        issues: validation.error.issues,
        rawData: parsed,
      });
    }

    return {
      meta: {
        requestedCompany: companyName,
        requestedLoanAmountInr: loanAmountInr,
        model: this.aiProvider.model,
        groundedWithLiveSearch: grounded,
        groundingFallbackReason: groundingFallbackReason || null,
        generatedAt: new Date().toISOString(),
      },
      data: validation.data,
    };
  }
}

module.exports = CompanyResearchService;
