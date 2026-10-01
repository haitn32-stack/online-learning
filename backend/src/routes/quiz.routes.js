const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quiz.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');
const validate = require('../middlewares/validate.middleware');
const { createQuizValidator, updateQuizValidator, submitQuizValidator } = require('../validators/quiz.validator');

router.get('/', authenticate, authorize('Expert', 'Admin'), quizController.getAllQuizzes);
router.get('/subject/:subjectId', authenticate, quizController.getQuizById);
router.get('/:id', authenticate, quizController.getQuizById);
router.post('/', authenticate, authorize('Expert'), createQuizValidator, validate, quizController.createQuiz);
router.put('/:id', authenticate, authorize('Expert'), updateQuizValidator, validate, quizController.updateQuiz);
router.post('/submit', authenticate, authorize('Student'), submitQuizValidator, validate, quizController.submitQuiz);
router.get('/results/my', authenticate, authorize('Student'), quizController.getMyQuizResults);
router.get('/results/:resultId', authenticate, quizController.getQuizResultById);

module.exports = router;
