const { body } = require('express-validator');

const createRegistrationValidator = [
  body('subjectId')
    .notEmpty()
    .withMessage('Subject ID is required')
    .isInt()
    .withMessage('Subject ID must be an integer'),
  body('packageId')
    .notEmpty()
    .withMessage('Package ID is required')
    .isInt()
    .withMessage('Package ID must be an integer'),
];

const updateRegistrationStatusValidator = [
  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn(['Submitted', 'Paid', 'Cancelled', 'Completed'])
    .withMessage('Invalid status value'),
  body('staffNotes')
    .optional()
    .isString()
    .withMessage('Staff notes must be a string'),
];

const createRegistrationByStaffValidator = [
  body('userId')
    .notEmpty()
    .withMessage('User ID is required')
    .isInt()
    .withMessage('User ID must be an integer'),
  body('subjectId')
    .notEmpty()
    .withMessage('Subject ID is required')
    .isInt()
    .withMessage('Subject ID must be an integer'),
  body('packageId')
    .notEmpty()
    .withMessage('Package ID is required')
    .isInt()
    .withMessage('Package ID must be an integer'),
  body('notes')
    .optional()
    .isString()
    .withMessage('Notes must be a string'),
];

module.exports = {
  createRegistrationValidator,
  updateRegistrationStatusValidator,
  createRegistrationByStaffValidator,
};
