const express = require('express');
const router = express.Router();
const lessonController = require('../controllers/lesson.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');
const { validate } = require('../middlewares/validate.middleware');
const { createLessonValidator, updateLessonValidator } = require('../validators/lesson.validator');
const { ROLES } = require('../constants');

router.get('/subject/:subjectId', authenticate, lessonController.getLessonsBySubject);
router.get('/:id', authenticate, lessonController.getLessonById);
router.post('/', authenticate, authorize(ROLES.EXPERT), createLessonValidator, validate, lessonController.createLesson);
router.put('/:id', authenticate, authorize(ROLES.EXPERT), updateLessonValidator, validate, lessonController.updateLesson);
router.patch('/:id/toggle-status', authenticate, authorize(ROLES.EXPERT), lessonController.toggleLessonStatus);

module.exports = router;
