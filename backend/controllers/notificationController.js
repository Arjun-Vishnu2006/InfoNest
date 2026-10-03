const asyncHandler = require('express-async-handler');
const Notification = require('../models/Notification');

const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({
    userId: req.user._id,
  }).sort({ createdAt: -1 });

  res.json({
    success: true,
    count: notifications.length,
    data: notifications,
  });
});

const getUnreadNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({
    userId: req.user._id,
    isRead: false,
  }).sort({ createdAt: -1 });

  res.json({
    success: true,
    count: notifications.length,
    data: notifications,
  });
});

const markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndUpdate(
    {
      _id: req.params.id,
      userId: req.user._id,
    },
    {
      isRead: true,
    },
    {
      new: true,
    }
  );

  if (!notification) {
    res.status(404);
    throw new Error('Notification not found');
  }

  res.json({
    success: true,
    message: 'Notification marked as read',
    data: notification,
  });
});

const markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    {
      userId: req.user._id,
      isRead: false,
    },
    {
      isRead: true,
    }
  );

  res.json({
    success: true,
    message: 'All notifications marked as read',
  });
});

const createNotification = asyncHandler(async (req, res) => {
  const {
    userId,
    message,
    type,
    link,
  } = req.body;

  const notification = await Notification.create({
    userId,
    message,
    type,
    link,
  });

  res.status(201).json({
    success: true,
    message: 'Notification created successfully',
    data: notification,
  });
});

module.exports = {
  getNotifications,
  getUnreadNotifications,
  markAsRead,
  markAllAsRead,
  createNotification,
};