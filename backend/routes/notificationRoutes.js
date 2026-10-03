const express = require('express');

const {
  getNotifications,
  getUnreadNotifications,
  markAsRead,
  markAllAsRead,
  createNotification,
} = require('../controllers/notificationController');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/', getNotifications);

router.get('/unread', getUnreadNotifications);

router.patch('/read-all', markAllAsRead);

router.patch('/:id/read', markAsRead);

router.post(
  '/',
  authorize('Admin'),
  createNotification
);

module.exports = router;