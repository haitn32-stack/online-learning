const { body } = require('express-validator');

const createSettingValidator = [
  body('settingType')
    .notEmpty()
    .withMessage('Setting type is required'),
  body('settingKey')
    .notEmpty()
    .withMessage('Setting key is required'),
  body('settingValue')
    .notEmpty()
    .withMessage('Setting value is required'),
  body('orderNum')
    .optional()
    .isInt()
    .withMessage('Order number must be an integer'),
];

const updateSettingValidator = [
  body('settingValue')
    .optional()
    .notEmpty()
    .withMessage('Setting value cannot be empty'),
  body('orderNum')
    .optional()
    .isInt()
    .withMessage('Order number must be an integer'),
  body('status')
    .optional()
    .isBoolean()
    .withMessage('Status must be a boolean'),
];

module.exports = {
  createSettingValidator,
  updateSettingValidator,
};
