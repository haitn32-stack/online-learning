const express = require('express');
const router = express.Router();
const subjectController = require('../controllers/subject.controller');
const { createSubjectValidator, updateSubjectValidator, publishSubjectValidator } = require('../validators/subject.validator');
const validate = require('../middlewares/validate.middleware');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');

router.get('/public', subjectController.getPublishedSubjects);
router.get('/public/:id', subjectController.getSubjectById);

router.get('/', authenticate, authorize('Expert', 'Admin'), subjectController.getAllSubjects);
router.get('/:id', authenticate, authorize('Expert', 'Admin'), subjectController.getSubjectById);
router.post('/', authenticate, authorize('Expert'), createSubjectValidator, validate, subjectController.createSubject);
router.put('/:id', authenticate, authorize('Expert', 'Admin'), updateSubjectValidator, validate, subjectController.updateSubject);
router.patch('/:id/publish', authenticate, authorize('Admin'), publishSubjectValidator, validate, subjectController.togglePublish);

module.exports = router;
