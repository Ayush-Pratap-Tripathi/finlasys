const { jsonrepair } = require('jsonrepair');

/**
 * Pulls a single JSON object out of raw LLM text output, tolerating
 * markdown code fences or stray commentary the model adds despite
 * instructions not to. Falls back to jsonrepair for minor syntax slips
 * (a dropped comma, a trailing comma) that occasionally show up in long
 * generated JSON even when the model is explicitly told to only emit JSON.
 */
function extractJson(text) {
  if (!text || !text.trim()) {
    throw new Error('Empty response from AI provider');
  }

  let cleaned = text.trim();

  const fenceMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenceMatch) {
    cleaned = fenceMatch[1].trim();
  }

  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  if (start === -1 || end === -1 || end < start) {
    throw new Error('No JSON object found in AI response');
  }

  cleaned = cleaned.slice(start, end + 1);

  try {
    return JSON.parse(cleaned);
  } catch (parseErr) {
    try {
      return JSON.parse(jsonrepair(cleaned));
    } catch (repairErr) {
      throw new Error(`${parseErr.message} (repair also failed: ${repairErr.message})`);
    }
  }
}

module.exports = extractJson;
