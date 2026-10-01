const express = require('express');
const router = express.Router();
const registrationController = require('../controllers/registration.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');
const validate = require('../middlewares/validate.middleware');
const {
  createRegistrationValidator,
  updateRegistrationStatusValidator,
  createRegistrationByStaffValidator
} = require('../validators/registration.validator');

// Routes for Students
router.post(
  '/',
  authenticate,
  authorize('Student'),
  createRegistrationValidator,
  validate,
  registrationController.createRegistration
);

router.get(
  '/my',
  authenticate,
  authorize('Student'),
  registrationController.getMyRegistrations
);

router.put(
  '/my/:id',
  authenticate,
  authorize('Student'),
  registrationController.updateMyRegistration
);

router.patch(
  '/my/:id/cancel',
  authenticate,
  authorize('Student'),
  registrationController.cancelRegistration
);

// Routes for Sale/Admin
router.get(
  '/',
  authenticate,
  authorize('Sale', 'Admin'),
  registrationController.getAllRegistrations
);

router.get(
  '/:id',
  authenticate,
  authorize('Sale', 'Admin'),
  registrationController.getRegistrationById
);

router.patch(
  '/:id/status',
  authenticate,
  authorize('Sale', 'Admin'),
  updateRegistrationStatusValidator,
  validate,
  registrationController.updateRegistrationStatus
);

router.post(
  '/staff',
  authenticate,
  authorize('Sale', 'Admin'),
  createRegistrationByStaffValidator,
  validate,
  registrationController.createRegistrationByStaff
);

module.exports = router;
