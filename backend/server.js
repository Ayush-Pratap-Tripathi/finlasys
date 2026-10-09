const express = require('express');
const cors = require('cors');

const env = require('./src/config/env');
const buildContainer = require('./src/container');
const errorHandler = require('./src/middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

const { researchRouter, analysisRouter } = buildContainer();
app.use('/api', researchRouter);
app.use('/api', analysisRouter);

app.use(errorHandler);

app.listen(env.PORT, () => {
  console.log(`Server running on http://localhost:${env.PORT}`);
});
