const { validateDataOnlyRequest, validateWithMetaRequest } = require('../validators/analysisRequestValidator');
const { ValidationError } = require('../errors/AppError');

/**
 * Factory so each handler receives its service via injection rather than
 * constructing/importing a concrete implementation itself - same pattern as
 * companyResearchController.js. One handler per analysis endpoint, each a
 * pure HTTP adapter: validate, call the service, respond.
 */
function createAnalysisController(analysisService) {
  function makeHandler({ validate, run }) {
    return function handler(req, res, next) {
      try {
        const parsed = validate(req.body);
        if (!parsed.success) {
          throw new ValidationError('Invalid request body', { issues: parsed.error.issues });
        }

        const result = run(parsed.data);
        res.json(result);
      } catch (err) {
        next(err);
      }
    };
  }

  return {
    getOverview: makeHandler({ validate: validateDataOnlyRequest, run: (body) => analysisService.getOverview(body) }),
    getFinancialHealth: makeHandler({ validate: validateDataOnlyRequest, run: (body) => analysisService.getFinancialHealth(body) }),
    getRiskSignals: makeHandler({ validate: validateDataOnlyRequest, run: (body) => analysisService.getRiskSignals(body) }),
    getEvidence: makeHandler({ validate: validateWithMetaRequest, run: (body) => analysisService.getEvidence(body) }),
    getLendingDecision: makeHandler({ validate: validateWithMetaRequest, run: (body) => analysisService.getLendingDecision(body) }),
  };
}

module.exports = createAnalysisController;
