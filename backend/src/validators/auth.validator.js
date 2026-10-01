const { body, param } = require('express-validator');

const registerValidator = [
    body('fullName').notEmpty().withMessage('Full name is required').isLength({ min: 2, max: 100 }).withMessage('Full name must be between 2 and 100 characters'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('phone').optional().isMobilePhone().withMessage('Invalid phone number format')
];

const loginValidator = [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
];

const resetPasswordRequestValidator = [
    body('email').isEmail().withMessage('Valid email is required')
];

const resetPasswordValidator = [
    body('token').notEmpty().withMessage('Token is required'),
    body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters long')
];

const verifyEmailValidator = [
    param('token').notEmpty().withMessage('Token is required')
];

const verifyCodeValidator = [
    body('email').isEmail().withMessage('Valid email is required'),
    body('code').notEmpty().withMessage('Verification code is required')
];

const resendCodeValidator = [
    body('email').isEmail().withMessage('Valid email is required')
];

module.exports = {
    registerValidator,
    loginValidator,
    resetPasswordRequestValidator,
    resetPasswordValidator,
    verifyEmailValidator,
    verifyCodeValidator,
    resendCodeValidator
};
