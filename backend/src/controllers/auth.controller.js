const authService = require('../services/auth.service');
const { successResponse, errorResponse } = require('../utils/response.util');
const config = require('../configs');

const register = async (req, res) => {
    try {
        const user = await authService.register(req.body);
        return successResponse(res, user, 'Registration successful. A verification code has been sent to your email.', 201);
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

const verifyCode = async (req, res) => {
    try {
        const { email, code } = req.body;
        const data = await authService.verifyCode(email, code);
        return successResponse(res, data, 'Account verified successfully', 200);
    } catch (error) {
        return errorResponse(res, error.message, 400);
    }
};

const resendCode = async (req, res) => {
    try {
        const { email } = req.body;
        await authService.resendCode(email);
        return successResponse(res, null, 'A new verification code has been sent to your email', 200);
    } catch (error) {
        return errorResponse(res, error.message, 400);
    }
};

const verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;
        const user = await authService.verifyEmail(token);
        
        // If accessed directly from browser link, redirect to frontend login
        if (req.headers.accept && req.headers.accept.includes('text/html')) {
            return res.redirect(`${config.clientUrl}/login?verified=true`);
        }
        return successResponse(res, user, 'Email verified successfully', 200);
    } catch (error) {
        if (req.headers.accept && req.headers.accept.includes('text/html')) {
            return res.redirect(`${config.clientUrl}/login?verified=false&error=${encodeURIComponent(error.message)}`);
        }
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
    verifyCode,
    resendCode,
    verifyEmail,
    requestPasswordReset,
    resetPassword
};
