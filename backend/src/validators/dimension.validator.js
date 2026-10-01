const { body } = require('express-validator');

const createDimensionValidator = [
  body('subjectId').isInt().withMessage('subjectId must be an integer'),
  body('name').notEmpty().withMessage('name is required').isLength({ min: 2, max: 100 }).withMessage('name must be between 2 and 100 characters'),
  body('type').notEmpty().withMessage('type is required'),
  body('description').optional()
];

const updateDimensionValidator = [
  body('name').optional().isLength({ min: 2, max: 100 }).withMessage('name must be between 2 and 100 characters'),
  body('type').optional(),
  body('description').optional()
];

module.exports = {
  createDimensionValidator,
  updateDimensionValidator
};
