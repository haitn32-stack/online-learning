const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { registerValidator, loginValidator, resetPasswordRequestValidator, resetPasswordValidator, verifyEmailValidator } = require('../validators/auth.validator');
const validate = require('../middlewares/validate.middleware');

router.post('/register', registerValidator, validate, authController.register);
router.post('/login', loginValidator, validate, authController.login);
router.get('/verify-email/:token', verifyEmailValidator, validate, authController.verifyEmail);
router.post('/reset-password-request', resetPasswordRequestValidator, validate, authController.requestPasswordReset);
router.post('/reset-password', resetPasswordValidator, validate, authController.resetPassword);

module.exports = router;
