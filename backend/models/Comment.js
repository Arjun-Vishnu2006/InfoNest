const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    contentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Content',
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    commentText: {
      type: String,
      required: [true, 'Comment text is required'],
      trim: true,
      maxlength: 2000,
    },
  },
  {
    timestamps: true,
  }
);

commentSchema.index({
  contentId: 1,
  createdAt: -1,
});

module.exports = mongoose.model('Comment', commentSchema);