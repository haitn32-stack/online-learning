const dimensionService = require('../services/dimension.service');
const { successResponse, errorResponse } = require('../utils/response.util');

const getDimensionsBySubject = async (req, res) => {
  try {
    const { subjectId } = req.params;
    const dimensions = await dimensionService.getDimensionsBySubject(subjectId);
    return successResponse(res, 'Dimensions retrieved successfully', dimensions);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

const getDimensionById = async (req, res) => {
  try {
    const { id } = req.params;
    const dimension = await dimensionService.getDimensionById(id);
    if (!dimension) {
      return errorResponse(res, 'Dimension not found', 404);
    }
    return successResponse(res, 'Dimension retrieved successfully', dimension);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

const createDimension = async (req, res) => {
  try {
    const dimension = await dimensionService.createDimension(req.body);
    return successResponse(res, 'Dimension created successfully', dimension, 201);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

const updateDimension = async (req, res) => {
  try {
    const { id } = req.params;
    const dimension = await dimensionService.updateDimension(id, req.body);
    return successResponse(res, 'Dimension updated successfully', dimension);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

module.exports = {
  getDimensionsBySubject,
  getDimensionById,
  createDimension,
  updateDimension
};
