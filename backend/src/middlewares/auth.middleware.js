const jwt = require('jsonwebtoken');
const config = require('../configs');
const { errorResponse } = require('../utils/response.util');
const db = require('../models');

/**
 * Middleware to authenticate user using JWT
 */
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(res, 'Authentication token missing or invalid', 401);
    }

    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = jwt.verify(token, config.jwt.secret);
    
    // Find user
    const user = await db.User.findByPk(decoded.id);
    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    if (!user.status) {
      return errorResponse(res, 'User account is inactive', 403);
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return errorResponse(res, 'Token expired', 401);
    }
    return errorResponse(res, 'Invalid authentication token', 401);
  }
};

module.exports = {
  authenticate
};
