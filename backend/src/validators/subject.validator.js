const { body } = require('express-validator');

const createSubjectValidator = [
    body('title').notEmpty().withMessage('Title is required').isLength({ min: 3, max: 200 }).withMessage('Title must be between 3 and 200 characters'),
    body('description').notEmpty().withMessage('Description is required'),
    body('categoryId').isInt().withMessage('Category ID must be an integer'),
    body('tagLine').optional().isString()
];

const updateSubjectValidator = [
    body('title').optional().isLength({ min: 3, max: 200 }),
    body('description').optional().isString(),
    body('categoryId').optional().isInt(),
    body('tagLine').optional().isString(),
    body('status').optional().isBoolean()
];

const publishSubjectValidator = [
    body('published').isBoolean().withMessage('Published status must be a boolean')
];

module.exports = {
    createSubjectValidator,
    updateSubjectValidator,
    publishSubjectValidator
};
