const mongoose = require('mongoose');

const stepSchema = new mongoose.Schema(
  {
    order: {
      type: Number,
      required: true,
      min: 1,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: '',
    },

    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    _id: false,
  }
);

const versionSchema = new mongoose.Schema(
  {
    editedAt: {
      type: Date,
      default: Date.now,
    },

    snapshot: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  {
    _id: false,
  }
);

const roadmapSchema = new mongoose.Schema(
  {
    goalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Goal',
      required: true,
    },

    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    title: {
      type: String,
      required: [true, 'Roadmap title is required'],
      trim: true,
      maxlength: 150,
    },

    description: {
      type: String,
      required: [true, 'Roadmap description is required'],
      trim: true,
      maxlength: 5000,
    },

    steps: {
      type: [stepSchema],
      default: [],
    },

    resources: {
      type: [
        {
          label: {
            type: String,
            trim: true,
            maxlength: 150,
          },

          url: {
            type: String,
            trim: true,
          },

          type: {
            type: String,
            enum: [
              'article',
              'book',
              'video',
              'website',
              'other',
            ],
            default: 'other',
          },
        },
      ],
      default: [],
    },

    estimatedTimeline: {
      type: String,
      trim: true,
      maxlength: 100,
      default: '',
    },

    challenges: {
      type: String,
      trim: true,
      maxlength: 5000,
      default: '',
    },

    practicalTips: {
      type: String,
      trim: true,
      maxlength: 5000,
      default: '',
    },

    status: {
      type: String,
      enum: ['draft', 'published', 'removed'],
      default: 'draft',
    },

    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    reviewCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    eliteReviewCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    versionHistory: {
      type: [versionSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

roadmapSchema.index({
  title: 'text',
  description: 'text',
});

module.exports = mongoose.model('Roadmap', roadmapSchema);