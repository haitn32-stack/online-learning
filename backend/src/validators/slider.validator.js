const { body } = require('express-validator');

const createSliderValidator = [
  body('title')
    .notEmpty()
    .withMessage('Title is required'),
  body('imageUrl')
    .notEmpty()
    .withMessage('Image URL is required'),
  body('backlink')
    .optional()
    .isURL()
    .withMessage('Backlink must be a valid URL'),
  body('orderNum')
    .optional()
    .isInt()
    .withMessage('Order number must be an integer'),
  body('notes')
    .optional()
    .isString()
    .withMessage('Notes must be a string'),
];

const updateSliderValidator = [
  body('title')
    .optional()
    .notEmpty()
    .withMessage('Title cannot be empty'),
  body('imageUrl')
    .optional()
    .notEmpty()
    .withMessage('Image URL cannot be empty'),
  body('backlink')
    .optional()
    .isURL()
    .withMessage('Backlink must be a valid URL'),
  body('orderNum')
    .optional()
    .isInt()
    .withMessage('Order number must be an integer'),
  body('status')
    .optional()
    .isBoolean()
    .withMessage('Status must be a boolean'),
  body('notes')
    .optional()
    .isString()
    .withMessage('Notes must be a string'),
];

module.exports = {
  createSliderValidator,
  updateSliderValidator,
};
