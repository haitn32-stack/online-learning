const express = require('express');
const router = express.Router();
const dimensionController = require('../controllers/dimension.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');
const { validate } = require('../middlewares/validate.middleware');
const { createDimensionValidator, updateDimensionValidator } = require('../validators/dimension.validator');
const { ROLES } = require('../constants');

router.get('/subject/:subjectId', authenticate, authorize(ROLES.EXPERT, ROLES.ADMIN), dimensionController.getDimensionsBySubject);
router.get('/:id', authenticate, authorize(ROLES.EXPERT, ROLES.ADMIN), dimensionController.getDimensionById);
router.post('/', authenticate, authorize(ROLES.EXPERT), createDimensionValidator, validate, dimensionController.createDimension);
router.put('/:id', authenticate, authorize(ROLES.EXPERT), updateDimensionValidator, validate, dimensionController.updateDimension);

module.exports = router;
