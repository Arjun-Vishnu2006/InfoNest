const asyncHandler = require('express-async-handler');
const Like = require('../models/Like');
const Content = require('../models/Content');

const likeContent = asyncHandler(async (req, res) => {
  const content = await Content.findOne({
    _id: req.params.contentId,
    status: 'approved',
  });

  if (!content) {
    res.status(404);
    throw new Error('Content not found');
  }

  const existingLike = await Like.findOne({
    userId: req.user._id,
    contentId: req.params.contentId,
  });

  if (existingLike) {
    await existingLike.deleteOne();

    return res.json({
      success: true,
      liked: false,
      message: 'Content unliked',
    });
  }

  await Like.create({
    userId: req.user._id,
    contentId: req.params.contentId,
  });

  res.json({
    success: true,
    liked: true,
    message: 'Content liked',
  });
});

const getLikeCount = asyncHandler(async (req, res) => {
  const count = await Like.countDocuments({
    contentId: req.params.contentId,
  });

  res.json({
    success: true,
    count,
  });
});

module.exports = {
  likeContent,
  getLikeCount,
};