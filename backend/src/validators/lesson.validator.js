const { body } = require('express-validator');

const createLessonValidator = [
  body('subjectId').isInt().withMessage('subjectId must be an integer'),
  body('title').notEmpty().withMessage('title is required').isLength({ min: 3, max: 200 }).withMessage('title must be between 3 and 200 characters'),
  body('content').notEmpty().withMessage('content is required'),
  body('videoUrl').optional().isURL().withMessage('videoUrl must be a valid URL'),
  body('orderNum').isInt().withMessage('orderNum must be an integer')
];

const updateLessonValidator = [
  body('title').optional().isLength({ min: 3, max: 200 }).withMessage('title must be between 3 and 200 characters'),
  body('content').optional(),
  body('videoUrl').optional().isURL().withMessage('videoUrl must be a valid URL'),
  body('orderNum').optional().isInt().withMessage('orderNum must be an integer'),
  body('status').optional().isBoolean().withMessage('status must be a boolean')
];

module.exports = {
  createLessonValidator,
  updateLessonValidator
};
