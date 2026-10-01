const { body } = require('express-validator');

const createPackageValidator = [
  body('subjectId').isInt().withMessage('subjectId must be an integer'),
  body('name').notEmpty().withMessage('name is required'),
  body('duration').isInt({ min: 1 }).withMessage('duration must be an integer greater than 0'),
  body('listPrice').isDecimal().withMessage('listPrice must be a decimal'),
  body('salePrice').isDecimal().withMessage('salePrice must be a decimal'),
  body('description').optional()
];

const updatePackageValidator = [
  body('name').optional(),
  body('duration').optional().isInt({ min: 1 }).withMessage('duration must be an integer greater than 0'),
  body('listPrice').optional().isDecimal().withMessage('listPrice must be a decimal'),
  body('salePrice').optional().isDecimal().withMessage('salePrice must be a decimal'),
  body('description').optional(),
  body('status').optional().isBoolean().withMessage('status must be a boolean')
];

module.exports = {
  createPackageValidator,
  updatePackageValidator
};
