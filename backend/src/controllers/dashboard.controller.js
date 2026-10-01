const dashboardService = require('../services/dashboard.service');
const { successResponse, errorResponse } = require('../utils/response.util');

const getDashboardStats = async (req, res) => {
  try {
    const data = await dashboardService.getDashboardStats();
    return successResponse(res, data, 'Dashboard stats fetched successfully');
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

module.exports = {
  getDashboardStats
};
