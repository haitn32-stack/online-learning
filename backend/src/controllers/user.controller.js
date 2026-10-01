const userService = require('../services/user.service');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/response.util');

const getProfile = async (req, res) => {
    try {
        const user = await userService.getUserById(req.user.id);
        return successResponse(res, user, 'Profile fetched successfully');
    } catch (error) {
        return errorResponse(res, error.message, 404);
    }
};

const updateProfile = async (req, res) => {
    try {
        const user = await userService.updateProfile(req.user.id, req.body);
        return successResponse(res, user, 'Profile updated successfully');
    } catch (error) {
        return errorResponse(res, error.message, 400);
    }
};

const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        await userService.changePassword(req.user.id, currentPassword, newPassword);
        return successResponse(res, null, 'Password changed successfully');
    } catch (error) {
        return errorResponse(res, error.message, 400);
    }
};

const updateAvatar = async (req, res) => {
    try {
        const avatarPath = req.file ? req.file.path : null;
        if (!avatarPath) throw new Error('Avatar image is required');
        const user = await userService.updateAvatar(req.user.id, avatarPath);
        return successResponse(res, user, 'Avatar updated successfully');
    } catch (error) {
        return errorResponse(res, error.message, 400);
    }
};

const getAllUsers = async (req, res) => {
    try {
        const result = await userService.getAllUsers(req.query);
        return paginatedResponse(res, result.items, result.currentPage, req.query.size || 10, result.totalItems, 'Users fetched successfully');
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

const getUserById = async (req, res) => {
    try {
        const user = await userService.getUserById(req.params.id);
        return successResponse(res, user, 'User fetched successfully');
    } catch (error) {
        return errorResponse(res, error.message, 404);
    }
};

const createUser = async (req, res) => {
    try {
        const user = await userService.createUser(req.body);
        return successResponse(res, user, 'User created successfully', 201);
    } catch (error) {
        return errorResponse(res, error.message, 400);
    }
};

const updateUser = async (req, res) => {
    try {
        const user = await userService.updateUser(req.params.id, req.body);
        return successResponse(res, user, 'User updated successfully');
    } catch (error) {
        return errorResponse(res, error.message, 400);
    }
};

module.exports = {
    getProfile,
    updateProfile,
    changePassword,
    updateAvatar,
    getAllUsers,
    getUserById,
    createUser,
    updateUser
};
