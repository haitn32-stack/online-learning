const settingService = require('../services/setting.service');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/response.util');

const getAllSettings = async (req, res) => {
  try {
    const data = await settingService.getAllSettings(req.query);
    return paginatedResponse(res, data, 'Settings fetched successfully');
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

const getSettingById = async (req, res) => {
  try {
    const data = await settingService.getSettingById(req.params.id);
    return successResponse(res, data, 'Setting fetched successfully');
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

const createSetting = async (req, res) => {
  try {
    const data = await settingService.createSetting(req.body);
    return successResponse(res, data, 'Setting created successfully', 201);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

const updateSetting = async (req, res) => {
  try {
    const data = await settingService.updateSetting(req.params.id, req.body);
    return successResponse(res, data, 'Setting updated successfully');
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

const toggleSettingStatus = async (req, res) => {
  try {
    const data = await settingService.toggleSettingStatus(req.params.id);
    return successResponse(res, data, 'Setting status toggled successfully');
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

module.exports = {
  getAllSettings,
  getSettingById,
  createSetting,
  updateSetting,
  toggleSettingStatus
};
