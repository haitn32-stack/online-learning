const authService = require('../services/auth.service');
const { successResponse, errorResponse } = require('../utils/response.util');

const register = async (req, res) => {
    try {
        const user = await authService.register(req.body);
        return successResponse(res, user, 'Registration successful. Please check your email.', 201);
    } catch (error) {
        return errorResponse(res, error.message, 400);
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const data = await authService.login(email, password);
        return successResponse(res, data, 'Login successful', 200);
    } catch (error) {
        return errorResponse(res, error.message, 401);
    }
};

const verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;
        const user = await authService.verifyEmail(token);
        return successResponse(res, user, 'Email verified successfully', 200);
    } catch (error) {
        return errorResponse(res, error.message, 400);
    }
};

const requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;
        await authService.requestPasswordReset(email);
        return successResponse(res, null, 'Password reset email sent', 200);
    } catch (error) {
        return errorResponse(res, error.message, 400);
    }
};

const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        await authService.resetPassword(token, newPassword);
        return successResponse(res, null, 'Password reset successful', 200);
    } catch (error) {
        return errorResponse(res, error.message, 400);
    }
};

module.exports = {
    register,
    login,
    verifyEmail,
    requestPasswordReset,
    resetPassword
};
