const express = require('express');
const router = express.Router();
const settingController = require('../controllers/setting.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');
const { validate } = require('../middlewares/validate.middleware');
const {
  createSettingValidator,
  updateSettingValidator
} = require('../validators/setting.validator');

// Protected routes (Admin only)
router.get(
  '/',
  authenticate,
  authorize('Admin'),
  settingController.getAllSettings
);

router.get(
  '/:id',
  authenticate,
  authorize('Admin'),
  settingController.getSettingById
);

router.post(
  '/',
  authenticate,
  authorize('Admin'),
  createSettingValidator,
  validate,
  settingController.createSetting
);

router.put(
  '/:id',
  authenticate,
  authorize('Admin'),
  updateSettingValidator,
  validate,
  settingController.updateSetting
);

router.patch(
  '/:id/toggle-status',
  authenticate,
  authorize('Admin'),
  settingController.toggleSettingStatus
);

module.exports = router;
