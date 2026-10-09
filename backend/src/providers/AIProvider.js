/**
 * Abstraction that application services depend on (Dependency Inversion).
 * Any concrete AI provider (Gemini, OpenAI, etc.) must implement this shape
 * so providers can be swapped without touching business logic.
 *
 * getSystemInstruction is a callback rather than a fixed string because a
 * provider may need to retry with degraded capabilities (e.g. live search
 * unavailable) and the instruction text has to change to match what the
 * model actually has access to on each attempt.
 */
class AIProvider {
  // eslint-disable-next-line no-unused-vars
  async generateGroundedJSON({ getSystemInstruction, userPrompt }) {
    throw new Error('generateGroundedJSON() must be implemented by a subclass of AIProvider');
  }
}

module.exports = AIProvider;
