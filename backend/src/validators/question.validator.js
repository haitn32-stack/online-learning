const { body } = require('express-validator');

const createQuestionValidator = [
    body('subjectId').isInt().withMessage('subjectId must be an integer'),
    body('dimensionId').optional().isInt().withMessage('dimensionId must be an integer'),
    body('content').notEmpty().withMessage('content is required'),
    body('optionA').notEmpty().withMessage('optionA is required'),
    body('optionB').notEmpty().withMessage('optionB is required'),
    body('optionC').notEmpty().withMessage('optionC is required'),
    body('optionD').notEmpty().withMessage('optionD is required'),
    body('correctAnswer').isIn(['A', 'B', 'C', 'D']).withMessage('correctAnswer must be one of A, B, C, D'),
    body('explanation').optional().isString(),
    body('level').optional().isIn(['Easy', 'Medium', 'Hard']).withMessage('level must be Easy, Medium, or Hard')
];

const updateQuestionValidator = [
    body('subjectId').optional().isInt().withMessage('subjectId must be an integer'),
    body('dimensionId').optional().isInt().withMessage('dimensionId must be an integer'),
    body('content').optional().notEmpty().withMessage('content cannot be empty'),
    body('optionA').optional().notEmpty().withMessage('optionA cannot be empty'),
    body('optionB').optional().notEmpty().withMessage('optionB cannot be empty'),
    body('optionC').optional().notEmpty().withMessage('optionC cannot be empty'),
    body('optionD').optional().notEmpty().withMessage('optionD cannot be empty'),
    body('correctAnswer').optional().isIn(['A', 'B', 'C', 'D']).withMessage('correctAnswer must be one of A, B, C, D'),
    body('explanation').optional().isString(),
    body('level').optional().isIn(['Easy', 'Medium', 'Hard']).withMessage('level must be Easy, Medium, or Hard')
];

const importQuestionsValidator = [
    body('subjectId').isInt().withMessage('subjectId must be an integer'),
    body('questions').isArray({ min: 1 }).withMessage('questions must be a non-empty array'),
    body('questions.*.content').notEmpty().withMessage('content is required'),
    body('questions.*.optionA').notEmpty().withMessage('optionA is required'),
    body('questions.*.optionB').notEmpty().withMessage('optionB is required'),
    body('questions.*.optionC').notEmpty().withMessage('optionC is required'),
    body('questions.*.optionD').notEmpty().withMessage('optionD is required'),
    body('questions.*.correctAnswer').isIn(['A', 'B', 'C', 'D']).withMessage('correctAnswer must be A, B, C, or D'),
    body('questions.*.explanation').optional().isString(),
    body('questions.*.level').optional().isIn(['Easy', 'Medium', 'Hard']),
    body('questions.*.dimensionId').optional().isInt()
];

module.exports = {
    createQuestionValidator,
    updateQuestionValidator,
    importQuestionsValidator
};
