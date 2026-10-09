const { z } = require('zod');

const researchRequestSchema = z.object({
  companyName: z.string().trim().min(2, 'companyName must be at least 2 characters'),
  loanAmountInr: z.coerce.number().positive('loanAmountInr must be a positive number'),
});

function validateResearchRequest(body) {
  return researchRequestSchema.safeParse(body);
}

module.exports = { validateResearchRequest };
