const express = require('express');
const router = express.Router();
const sliderController = require('../controllers/slider.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');
const validate = require('../middlewares/validate.middleware');
const {
  createSliderValidator,
  updateSliderValidator
} = require('../validators/slider.validator');

// Public route
router.get('/public', sliderController.getActiveSliders);

// Protected routes (Marketing / Admin)
router.get(
  '/',
  authenticate,
  authorize('Marketing', 'Admin'),
  sliderController.getAllSliders
);

router.get(
  '/:id',
  authenticate,
  authorize('Marketing', 'Admin'),
  sliderController.getSliderById
);

router.post(
  '/',
  authenticate,
  authorize('Marketing'),
  createSliderValidator,
  validate,
  sliderController.createSlider
);

router.put(
  '/:id',
  authenticate,
  authorize('Marketing'),
  updateSliderValidator,
  validate,
  sliderController.updateSlider
);

module.exports = router;
