class AppError extends Error {
  constructor(message, statusCode, details) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.details = details;
  }
}

class ValidationError extends AppError {
  constructor(message, details) {
    super(message, 400, details);
  }
}

class UpstreamServiceError extends AppError {
  constructor(message, details) {
    super(message, 502, details);
  }
}

class AIResponseParseError extends AppError {
  constructor(message, details) {
    super(message, 502, details);
  }
}

class AIResponseValidationError extends AppError {
  constructor(message, details) {
    super(message, 422, details);
  }
}

module.exports = {
  AppError,
  ValidationError,
  UpstreamServiceError,
  AIResponseParseError,
  AIResponseValidationError,
};
