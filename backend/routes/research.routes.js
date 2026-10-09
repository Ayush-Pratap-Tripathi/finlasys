const express = require('express');

function createResearchRouter(companyResearchController) {
  const router = express.Router();
  router.post('/research', companyResearchController);
  return router;
}

module.exports = createResearchRouter;
