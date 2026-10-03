const asyncHandler = require('express-async-handler');
const Comment = require('../models/Comment');
const Content = require('../models/Content');

const getComments = asyncHandler(async (req, res) => {
  const comments = await Comment.find({
    contentId: req.params.contentId,
  })
    .populate('userId', 'name profilePicture reputationScore')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: comments.length,
    data: comments,
  });
});

const createComment = asyncHandler(async (req, res) => {
  const { contentId, commentText } = req.body;

  const content = await Content.findOne({
    _id: contentId,
    status: 'approved',
  });

  if (!content) {
    res.status(404);
    throw new Error('Content not found');
  }

  const comment = await Comment.create({
    contentId,
    userId: req.user._id,
    commentText,
  });

  await comment.populate('userId', 'name profilePicture');

  res.status(201).json({
    success: true,
    message: 'Comment added successfully',
    data: comment,
  });
});

const updateComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);

  if (!comment) {
    res.status(404);
    throw new Error('Comment not found');
  }

  if (
    comment.userId.toString() !== req.user._id.toString() &&
    req.user.role !== 'Admin'
  ) {
    res.status(403);
    throw new Error('Not authorized to update this comment');
  }

  comment.commentText = req.body.commentText;
  await comment.save();

  res.json({
    success: true,
    message: 'Comment updated successfully',
    data: comment,
  });
});

const deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);

  if (!comment) {
    res.status(404);
    throw new Error('Comment not found');
  }

  if (
    comment.userId.toString() !== req.user._id.toString() &&
    req.user.role !== 'Admin'
  ) {
    res.status(403);
    throw new Error('Not authorized to delete this comment');
  }

  await comment.deleteOne();

  res.json({
    success: true,
    message: 'Comment deleted successfully',
  });
});

module.exports = {
  getComments,
  createComment,
  updateComment,
  deleteComment,
};