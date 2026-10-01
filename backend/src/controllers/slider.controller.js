const sliderService = require('../services/slider.service');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/response.util');

const getActiveSliders = async (req, res) => {
  try {
    const data = await sliderService.getActiveSliders();
    return successResponse(res, data, 'Active sliders fetched successfully');
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

const getAllSliders = async (req, res) => {
  try {
    const data = await sliderService.getAllSliders(req.query);
    return paginatedResponse(res, data, 'All sliders fetched successfully');
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

const getSliderById = async (req, res) => {
  try {
    const data = await sliderService.getSliderById(req.params.id);
    return successResponse(res, data, 'Slider fetched successfully');
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

const createSlider = async (req, res) => {
  try {
    const data = await sliderService.createSlider(req.body);
    return successResponse(res, data, 'Slider created successfully', 201);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

const updateSlider = async (req, res) => {
  try {
    const data = await sliderService.updateSlider(req.params.id, req.body);
    return successResponse(res, data, 'Slider updated successfully');
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

module.exports = {
  getActiveSliders,
  getAllSliders,
  getSliderById,
  createSlider,
  updateSlider
};
