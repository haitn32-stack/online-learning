const { body } = require('express-validator');
const { ROLES } = require('../constants');

const updateProfileValidator = [
    body('fullName').optional().isLength({ min: 2, max: 100 }).withMessage('Full name must be between 2 and 100 characters'),
    body('phone').optional().isMobilePhone().withMessage('Invalid phone number'),
    body('gender').optional().isIn(['Male', 'Female', 'Other']).withMessage('Gender must be Male, Female, or Other')
];

const changePasswordValidator = [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters long')
];

const createUserValidator = [
    body('fullName').notEmpty().withMessage('Full name is required').isLength({ min: 2, max: 100 }),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role').isIn(Object.values(ROLES || { Admin: 'Admin', Expert: 'Expert', Customer: 'Customer' })).withMessage('Invalid role')
];

const updateUserValidator = [
    body('fullName').optional().isLength({ min: 2, max: 100 }),
    body('phone').optional().isMobilePhone(),
    body('role').optional().isIn(Object.values(ROLES || { Admin: 'Admin', Expert: 'Expert', Customer: 'Customer' })),
    body('status').optional().isBoolean().withMessage('Status must be a boolean')
];

module.exports = {
    updateProfileValidator,
    changePasswordValidator,
    createUserValidator,
    updateUserValidator
};
