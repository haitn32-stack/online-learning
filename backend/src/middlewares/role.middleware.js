const { errorResponse } = require('../utils/response.util');

/**
 * Middleware to check user roles
 * @param  {...string} allowedRoles List of allowed roles
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, 'Not authenticated', 401);
    }

    if (!allowedRoles.includes(req.user.role)) {
      return errorResponse(res, 'Forbidden: You do not have permission to perform this action', 403);
    }

    next();
  };
};

module.exports = {
  authorize
};
