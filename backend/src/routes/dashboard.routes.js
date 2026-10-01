const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');

router.get(
  '/',
  authenticate,
  authorize('Marketing', 'Admin'),
  dashboardController.getDashboardStats
);

module.exports = router;
