const { body } = require('express-validator');

const createQuizValidator = [
    body('subjectId').isInt().withMessage('subjectId must be an integer'),
    body('title').isLength({ min: 3, max: 200 }).withMessage('title must be between 3 and 200 characters'),
    body('duration').isInt({ min: 1 }).withMessage('duration must be at least 1 minute'),
    body('passRate').isInt({ min: 0, max: 100 }).withMessage('passRate must be between 0 and 100'),
    body('level').isIn(['Easy', 'Medium', 'Hard', 'Mixed']).withMessage('level must be Easy, Medium, Hard, or Mixed'),
    body('questionCount').isInt({ min: 1 }).withMessage('questionCount must be at least 1'),
    body('type').optional().isIn(['Practice', 'Test']).withMessage('type must be Practice or Test')
];

const updateQuizValidator = [
    body('subjectId').optional().isInt().withMessage('subjectId must be an integer'),
    body('title').optional().isLength({ min: 3, max: 200 }).withMessage('title must be between 3 and 200 characters'),
    body('duration').optional().isInt({ min: 1 }).withMessage('duration must be at least 1 minute'),
    body('passRate').optional().isInt({ min: 0, max: 100 }).withMessage('passRate must be between 0 and 100'),
    body('level').optional().isIn(['Easy', 'Medium', 'Hard', 'Mixed']).withMessage('level must be Easy, Medium, Hard, or Mixed'),
    body('questionCount').optional().isInt({ min: 1 }).withMessage('questionCount must be at least 1'),
    body('type').optional().isIn(['Practice', 'Test']).withMessage('type must be Practice or Test'),
    body('status').optional().isBoolean().withMessage('status must be a boolean')
];

const submitQuizValidator = [
    body('quizId').isInt().withMessage('quizId must be an integer'),
    body('answers').isArray().withMessage('answers must be an array'),
    body('answers.*.questionId').isInt().withMessage('questionId must be an integer'),
    body('answers.*.selectedAnswer').isIn(['A', 'B', 'C', 'D']).withMessage('selectedAnswer must be A, B, C, or D')
];

module.exports = {
    createQuizValidator,
    updateQuizValidator,
    submitQuizValidator
};
