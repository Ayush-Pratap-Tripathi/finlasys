const { validateResearchRequest } = require('../validators/researchRequestValidator');
const { ValidationError } = require('../errors/AppError');

/**
 * Factory so the controller receives its service via injection rather than
 * constructing/importing a concrete implementation itself - keeps this file
 * a pure HTTP adapter with a single responsibility.
 */
function createCompanyResearchController(companyResearchService) {
  return async function postCompanyResearch(req, res, next) {
    try {
      const parsed = validateResearchRequest(req.body);
      if (!parsed.success) {
        throw new ValidationError('Invalid request body', { issues: parsed.error.issues });
      }

      const { companyName, loanAmountInr } = parsed.data;
      const result = await companyResearchService.researchCompany({ companyName, loanAmountInr });

      res.json(result);
    } catch (err) {
      next(err);
    }
  };
}

module.exports = createCompanyResearchController;
