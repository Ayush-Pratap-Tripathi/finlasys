const env = require('./config/env');
const OpenAIProvider = require('./providers/OpenAIProvider');
const CompanyResearchService = require('./services/CompanyResearchService');
const AnalysisService = require('./services/AnalysisService');
const createCompanyResearchController = require('./controllers/companyResearchController');
const createAnalysisController = require('./controllers/analysisController');
const createResearchRouter = require('../routes/research.routes');
const createAnalysisRouter = require('../routes/analysis.routes');

/**
 * Composition root: the one place concrete implementations are constructed
 * and wired into the abstractions the rest of the app depends on. Swapping
 * AI providers or adding new ones only requires a change here.
 */
function buildContainer() {
  const aiProvider = new OpenAIProvider({ apiKey: env.OPENAI_API_KEY, model: env.OPENAI_MODEL });
  const companyResearchService = new CompanyResearchService(aiProvider);
  const companyResearchController = createCompanyResearchController(companyResearchService);
  const researchRouter = createResearchRouter(companyResearchController);

  const analysisService = new AnalysisService();
  const analysisController = createAnalysisController(analysisService);
  const analysisRouter = createAnalysisRouter(analysisController);

  return { researchRouter, analysisRouter };
}

module.exports = buildContainer;
