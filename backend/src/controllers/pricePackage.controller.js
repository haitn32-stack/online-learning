const pricePackageService = require('../services/pricePackage.service');
const { successResponse, errorResponse } = require('../utils/response.util');

const getPackagesBySubject = async (req, res) => {
  try {
    const { subjectId } = req.params;
    const packages = await pricePackageService.getPackagesBySubject(subjectId);
    return successResponse(res, 'Price Packages retrieved successfully', packages);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

const getPackageById = async (req, res) => {
  try {
    const { id } = req.params;
    const pricePackage = await pricePackageService.getPackageById(id);
    if (!pricePackage) {
      return errorResponse(res, 'Price Package not found', 404);
    }
    return successResponse(res, 'Price Package retrieved successfully', pricePackage);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

const createPackage = async (req, res) => {
  try {
    const pricePackage = await pricePackageService.createPackage(req.body);
    return successResponse(res, 'Price Package created successfully', pricePackage, 201);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

const updatePackage = async (req, res) => {
  try {
    const { id } = req.params;
    const pricePackage = await pricePackageService.updatePackage(id, req.body);
    return successResponse(res, 'Price Package updated successfully', pricePackage);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

module.exports = {
  getPackagesBySubject,
  getPackageById,
  createPackage,
  updatePackage
};
