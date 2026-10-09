const OpenAI = require('openai');
const AIProvider = require('./AIProvider');
const { UpstreamServiceError } = require('../errors/AppError');

const DEFAULT_MODEL = 'gpt-5.6';
// gpt-5.6 is a reasoning model - reasoning tokens count against
// max_output_tokens alongside the visible answer, so this needs real
// headroom on top of the JSON payload itself (5 years of financials +
// sources + discrepancies + assumptions).
const MAX_OUTPUT_TOKENS = 32768;

// Deliberately NOT using Structured Outputs (text.format json_schema) here.
// It's schema-compatible (our fields are well within OpenAI's limits,
// unlike Claude's 16-nullable-field cap), but combining it with the
// web_search tool has a documented failure mode: the model silently
// truncates mid-JSON on complex schemas instead of raising an error, which
// would slip past error-based fallback handling entirely. Prompt
// instructions + the existing extractJson -> jsonrepair -> zod-validate ->
// retry pipeline (shared with the other providers) avoids that failure mode
// and has already proven reliable.

function containsWebSearchActivity(output) {
  return (output || []).some((item) => item.type === 'web_search_call');
}

/**
 * Concrete AIProvider backed by OpenAI's Responses API, using the hosted
 * web_search tool for live research. Returns plain text through the same
 * AIProvider contract every provider uses; CompanyResearchService's
 * extractJson + schema-validate step does the parsing/validation.
 *
 * Falls back once to a plain, tool-less prompt-only attempt if the
 * web-search request fails for any reason, mirroring the other providers'
 * resilience pattern.
 */
class OpenAIProvider extends AIProvider {
  constructor({ apiKey, model = DEFAULT_MODEL }) {
    super();
    this.client = new OpenAI({ apiKey });
    this.model = model;
  }

  async generateGroundedJSON({ getSystemInstruction, userPrompt }) {
    const call = (grounded) =>
      this.client.responses.create({
        model: this.model,
        instructions: getSystemInstruction({ grounded }),
        input: userPrompt,
        max_output_tokens: MAX_OUTPUT_TOKENS,
        reasoning: { effort: 'medium' },
        ...(grounded ? { tools: [{ type: 'web_search' }] } : {}),
      });

    try {
      const response = await call(true);
      return {
        text: response.output_text,
        grounded: containsWebSearchActivity(response.output),
        groundingFallbackReason: null,
      };
    } catch (err) {
      try {
        const response = await call(false);
        return {
          text: response.output_text,
          grounded: false,
          groundingFallbackReason: err.message,
        };
      } catch (fallbackErr) {
        throw new UpstreamServiceError(
          `OpenAI request failed on both web-search and fallback attempts: ${fallbackErr.message}`,
          { webSearchError: err.message, fallbackError: fallbackErr.message }
        );
      }
    }
  }
}

module.exports = OpenAIProvider;
