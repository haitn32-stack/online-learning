/**
 * Standard success response
 */
const successResponse = (res, data = null, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

/**
 * Standard error response
 */
const errorResponse = (res, message = 'Internal Server Error', statusCode = 500, errors = null) => {
  const response = {
    success: false,
    message
  };
  
  if (errors) {
    response.errors = errors;
  }
  
  return res.status(statusCode).json(response);
};

/**
 * Paginated response
 */
const paginatedResponse = (res, data, page, limit, total, message = 'Success') => {
  return res.status(200).json({
    success: true,
    message,
    data,
    pagination: {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      totalItems: total,
      totalPages: Math.ceil(total / limit)
    }
  });
};

module.exports = {
  successResponse,
  errorResponse,
  paginatedResponse
};
