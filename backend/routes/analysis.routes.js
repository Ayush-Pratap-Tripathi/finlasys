const express = require('express');

function createAnalysisRouter(analysisController) {
  const router = express.Router();
  router.post('/analysis/overview', analysisController.getOverview);
  router.post('/analysis/financial-health', analysisController.getFinancialHealth);
  router.post('/analysis/risk-signals', analysisController.getRiskSignals);
  router.post('/analysis/evidence', analysisController.getEvidence);
  router.post('/analysis/lending-decision', analysisController.getLendingDecision);
  return router;
}

module.exports = createAnalysisRouter;
