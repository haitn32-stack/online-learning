const { body } = require('express-validator');

const createBlogValidator = [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 3, max: 200 })
    .withMessage('Title must be between 3 and 200 characters'),
  body('content')
    .notEmpty()
    .withMessage('Content is required'),
  body('categoryId')
    .optional()
    .isInt()
    .withMessage('Category ID must be an integer'),
  body('briefInfo')
    .optional()
    .isString()
    .withMessage('Brief info must be a string'),
  body('featured')
    .optional()
    .isBoolean()
    .withMessage('Featured must be a boolean'),
];

const updateBlogValidator = [
  body('title')
    .optional()
    .isLength({ min: 3, max: 200 })
    .withMessage('Title must be between 3 and 200 characters'),
  body('content')
    .optional()
    .notEmpty()
    .withMessage('Content cannot be empty'),
  body('categoryId')
    .optional()
    .isInt()
    .withMessage('Category ID must be an integer'),
  body('briefInfo')
    .optional()
    .isString()
    .withMessage('Brief info must be a string'),
  body('featured')
    .optional()
    .isBoolean()
    .withMessage('Featured must be a boolean'),
  body('status')
    .optional()
    .isBoolean()
    .withMessage('Status must be a boolean'),
];

module.exports = {
  createBlogValidator,
  updateBlogValidator,
};
