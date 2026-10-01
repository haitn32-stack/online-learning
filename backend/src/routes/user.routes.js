const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { updateProfileValidator, changePasswordValidator, createUserValidator, updateUserValidator } = require('../validators/user.validator');
const validate = require('../middlewares/validate.middleware');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Simple setup, assume properly configured elsewhere

router.get('/profile', authenticate, userController.getProfile);
router.put('/profile', authenticate, updateProfileValidator, validate, userController.updateProfile);
router.put('/change-password', authenticate, changePasswordValidator, validate, userController.changePassword);
router.put('/avatar', authenticate, upload.single('avatar'), userController.updateAvatar);

router.get('/', authenticate, authorize('Admin'), userController.getAllUsers);
router.get('/:id', authenticate, authorize('Admin'), userController.getUserById);
router.post('/', authenticate, authorize('Admin'), createUserValidator, validate, userController.createUser);
router.put('/:id', authenticate, authorize('Admin'), updateUserValidator, validate, userController.updateUser);

module.exports = router;
