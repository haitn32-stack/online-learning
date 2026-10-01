const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blog.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');
const { validate } = require('../middlewares/validate.middleware');
const {
  createBlogValidator,
  updateBlogValidator
} = require('../validators/blog.validator');

// Public routes
router.get('/public', blogController.getPublicBlogs);
router.get('/public/:id', blogController.getBlogById);

// Protected routes (Marketing / Admin)
router.get(
  '/',
  authenticate,
  authorize('Marketing', 'Admin'),
  blogController.getAllBlogs
);

router.post(
  '/',
  authenticate,
  authorize('Marketing'),
  createBlogValidator,
  validate,
  blogController.createBlog
);

router.put(
  '/:id',
  authenticate,
  authorize('Marketing'),
  updateBlogValidator,
  validate,
  blogController.updateBlog
);

router.patch(
  '/:id/featured',
  authenticate,
  authorize('Marketing'),
  blogController.toggleFeatured
);

module.exports = router;
