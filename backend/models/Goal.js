const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Goal title is required'],
      trim: true,
      maxlength: 150,
    },

    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },

    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },

    targetHoursPerWeek: { type: Number, min: 0, default: 10 },
    targetCompletionDate: { type: Date },
    progressPercent: { type: Number, min: 0, max: 100, default: 0 },
    completedHours: { type: Number, min: 0, default: 0 },
    streakDays: { type: Number, min: 0, default: 0 },

    status: {
      type: String,
      enum: ['active', 'archived', 'pending'],
      default: 'active',
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

goalSchema.index({
  title: 'text',
  category: 'text',
  description: 'text',
});

module.exports = mongoose.model('Goal', goalSchema);