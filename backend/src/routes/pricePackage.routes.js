const express = require('express');
const router = express.Router();
const pricePackageController = require('../controllers/pricePackage.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');
const { validate } = require('../middlewares/validate.middleware');
const { createPackageValidator, updatePackageValidator } = require('../validators/pricePackage.validator');
const { ROLES } = require('../constants');

router.get('/subject/:subjectId', pricePackageController.getPackagesBySubject);
router.get('/:id', pricePackageController.getPackageById);
router.post('/', authenticate, authorize(ROLES.ADMIN), createPackageValidator, validate, pricePackageController.createPackage);
router.put('/:id', authenticate, authorize(ROLES.ADMIN), updatePackageValidator, validate, pricePackageController.updatePackage);

module.exports = router;
