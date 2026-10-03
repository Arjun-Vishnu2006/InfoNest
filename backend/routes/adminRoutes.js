const express = require('express');

const {
  getDashboard,
  getPendingContent,
  getSystemUsers,
} = require('../controllers/adminController');

const {
  protect,
  authorize,
} = require('../middleware/auth');

const router = express.Router();

router.use(
  protect,
  authorize('Admin')
);

router.get('/dashboard', getDashboard);

router.get('/pending-content', getPendingContent);

router.get('/users', getSystemUsers);

module.exports = router;