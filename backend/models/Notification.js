const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    message: {
      type: String,
      required: [true, 'Notification message is required'],
      trim: true,
      maxlength: 500,
    },

    type: {
      type: String,
      enum: [
        'roadmap',
        'chat',
        'review',
        'system',
        'announcement',
      ],
      default: 'system',
    },

    isRead: {
      type: Boolean,
      default: false,
    },

    link: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

notificationSchema.index({
  userId: 1,
  isRead: 1,
  createdAt: -1,
});

module.exports = mongoose.model(
  'Notification',
  notificationSchema
);