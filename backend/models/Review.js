const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    reviewerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    roadmapId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Roadmap',
      required: true,
    },

    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: 1,
      max: 5,
    },

    comment: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: '',
    },

    // Rating eligibility: 25% minimum progress. 100% creates an Elite Rating.
    completionPercentage: {
      type: Number,
      required: true,
      min: 25,
      max: 100,
      default: 25,
    },

    isElite: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// One review per user per roadmap
reviewSchema.index(
  {
    reviewerId: 1,
    roadmapId: 1,
  },
  {
    unique: true,
  }
);

module.exports = mongoose.model('Review', reviewSchema);