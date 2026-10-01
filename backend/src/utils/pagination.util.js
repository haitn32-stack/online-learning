/**
 * Calculate limit and offset for database queries
 * @param {number} page - Current page number
 * @param {number} size - Number of items per page
 * @returns {Object} { limit, offset }
 */
const getPagination = (page, size) => {
  const limit = size ? +size : 10;
  const offset = page ? (page - 1) * limit : 0;
  return { limit, offset };
};

/**
 * Format paginated data response
 * @param {Object} data - Result from Sequelize findAndCountAll
 * @param {number} page - Current page number
 * @param {number} limit - Number of items per page
 * @returns {Object} Formatted paging data
 */
const getPagingData = (data, page, limit) => {
  const { count: totalItems, rows: items } = data;
  const currentPage = page ? +page : 1;
  const totalPages = Math.ceil(totalItems / limit);

  return { totalItems, items, totalPages, currentPage };
};

module.exports = {
  getPagination,
  getPagingData
};
