function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  const statusCode = err.statusCode || err.status || 500;

  const payload = { error: err.message || 'Internal server error' };
  if (err.details) payload.details = err.details;

  if (statusCode >= 500) {
    console.error(err);
  }

  res.status(statusCode).json(payload);
}

module.exports = errorHandler;
