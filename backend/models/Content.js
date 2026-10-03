const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema(
  {
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    title: {
      type: String,
      required: [true, 'Content title is required'],
      trim: true,
      maxlength: 150,
    },

    description: {
      type: String,
      required: [true, 'Content description is required'],
      trim: true,
      maxlength: 5000,
    },

    contentType: {
      type: String,
      enum: ['article', 'guide', 'media', 'link'],
      default: 'article',
    },

    contentUrl: {
      type: String,
      trim: true,
      default: '',
    },

    category: {
      type: String,
      trim: true,
      maxlength: 100,
      default: '',
    },

    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

contentSchema.index({
  title: 'text',
  description: 'text',
});

module.exports = mongoose.model('Content', contentSchema);