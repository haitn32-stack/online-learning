const registrationService = require('../services/registration.service');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/response.util');

const createRegistration = async (req, res) => {
  try {
    const data = await registrationService.createRegistration(req.user.id, req.body);
    return successResponse(res, data, 'Registration created successfully', 201);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

const getMyRegistrations = async (req, res) => {
  try {
    const data = await registrationService.getMyRegistrations(req.user.id, req.query);
    return paginatedResponse(res, data, 'Registrations fetched successfully');
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

const cancelRegistration = async (req, res) => {
  try {
    const data = await registrationService.cancelRegistration(req.user.id, req.params.id);
    return successResponse(res, data, 'Registration cancelled successfully');
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

const updateMyRegistration = async (req, res) => {
  try {
    const data = await registrationService.updateMyRegistration(req.user.id, req.params.id, req.body);
    return successResponse(res, data, 'Registration updated successfully');
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

const getAllRegistrations = async (req, res) => {
  try {
    const data = await registrationService.getAllRegistrations(req.query);
    return paginatedResponse(res, data, 'All registrations fetched successfully');
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

const getRegistrationById = async (req, res) => {
  try {
    const data = await registrationService.getRegistrationById(req.params.id);
    return successResponse(res, data, 'Registration fetched successfully');
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

const updateRegistrationStatus = async (req, res) => {
  try {
    const { status, staffNotes } = req.body;
    const data = await registrationService.updateRegistrationStatus(req.params.id, status, staffNotes);
    return successResponse(res, data, 'Registration status updated successfully');
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

const createRegistrationByStaff = async (req, res) => {
  try {
    const data = await registrationService.createRegistrationByStaff(req.body);
    return successResponse(res, data, 'Registration created successfully by staff', 201);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

module.exports = {
  createRegistration,
  getMyRegistrations,
  cancelRegistration,
  updateMyRegistration,
  getAllRegistrations,
  getRegistrationById,
  updateRegistrationStatus,
  createRegistrationByStaff
};
