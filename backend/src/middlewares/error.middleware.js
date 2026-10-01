const { errorResponse } = require('../utils/response.util');

/**
 * Global error handling middleware
 */
const errorMiddleware = (err, req, res, next) => {
  console.error('[Error]:', err);

  let statusCode = 500;
  let message = 'Internal Server Error';
  let errors = null;

  // Sequelize validation errors
  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    statusCode = 400;
    message = 'Validation Error';
    errors = err.errors.map(e => ({
      field: e.path,
      message: e.message
    }));
  } 
  // JWT Errors
  else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }
  // Custom application errors (if any)
  else if (err.statusCode) {
    statusCode = err.statusCode;
    message = err.message;
  }

  return errorResponse(res, message, statusCode, errors);
};

module.exports = errorMiddleware;
