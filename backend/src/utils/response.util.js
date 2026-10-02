/**
 * Standard success response (handles flexible parameter ordering)
 */
const successResponse = (res, arg2 = null, arg3 = 'Success', statusCode = 200) => {
  let data = arg2;
  let message = arg3;
  let status = typeof statusCode === 'number' ? statusCode : 200;

  if (typeof arg2 === 'string' && (typeof arg3 !== 'string' || typeof arg3 === 'number')) {
    message = arg2;
    data = typeof arg3 === 'number' ? null : arg3;
    if (typeof arg3 === 'number') status = arg3;
  }

  return res.status(status).json({
    success: true,
    message: typeof message === 'string' ? message : 'Success',
    data: data
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
 * Paginated response (handles getPagingData object directly or positional args)
 */
const paginatedResponse = (res, data, page, limit, total, message = 'Success') => {
  let itemsData = data;
  let pageNum = page;
  let limitNum = limit;
  let totalNum = total;
  let msg = message;

  if (data && typeof data === 'object' && 'items' in data && 'totalItems' in data) {
    itemsData = data.items;
    pageNum = page || data.currentPage || 1;
    limitNum = limit || 10;
    totalNum = data.totalItems;
    if (typeof page === 'string') msg = page;
  }

  const finalTotal = totalNum !== undefined ? totalNum : (Array.isArray(itemsData) ? itemsData.length : 0);
  const finalLimit = parseInt(limitNum, 10) || 10;
  const finalPage = parseInt(pageNum, 10) || 1;
  const finalTotalPages = Math.ceil(finalTotal / finalLimit) || 1;

  return res.status(200).json({
    success: true,
    message: typeof msg === 'string' ? msg : 'Success',
    data: itemsData,
    pagination: {
      page: finalPage,
      limit: finalLimit,
      totalItems: finalTotal,
      totalPages: finalTotalPages
    }
  });
};

module.exports = {
  successResponse,
  errorResponse,
  paginatedResponse
};
