const mongoose = require('mongoose');

const riskSchema = new mongoose.Schema(
  {
    roadmapId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Roadmap',
      required: true,
      index: true,
    },

    description: {
      type: String,
      required: [true, 'Risk description is required'],
      trim: true,
      maxlength: 2000,
    },

    severity: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },

    mitigation: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Risk', riskSchema);