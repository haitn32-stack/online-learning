const express = require('express');
const router = express.Router();
const questionController = require('../controllers/question.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');
const validate = require('../middlewares/validate.middleware');
const { createQuestionValidator, updateQuestionValidator, importQuestionsValidator } = require('../validators/question.validator');

router.get('/', authenticate, authorize('Expert', 'Admin'), questionController.getAllQuestions);
router.get('/:id', authenticate, authorize('Expert', 'Admin'), questionController.getQuestionById);
router.post('/', authenticate, authorize('Expert'), createQuestionValidator, validate, questionController.createQuestion);
router.put('/:id', authenticate, authorize('Expert'), updateQuestionValidator, validate, questionController.updateQuestion);
router.patch('/:id/toggle-status', authenticate, authorize('Expert'), questionController.toggleQuestionStatus);
router.post('/import', authenticate, authorize('Expert'), importQuestionsValidator, validate, questionController.importQuestions);

module.exports = router;
