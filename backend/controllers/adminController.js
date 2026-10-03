const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Content = require('../models/Content');
const Roadmap = require('../models/Roadmap');

const getDashboard = asyncHandler(async (req, res) => {
  const [
    totalUsers,
    activeUsers,
    totalContent,
    pendingContent,
    totalRoadmaps,
    publishedRoadmaps,
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ isActive: true }),
    Content.countDocuments(),
    Content.countDocuments({ status: 'pending' }),
    Roadmap.countDocuments(),
    Roadmap.countDocuments({ status: 'published' }),
  ]);

  res.json({
    success: true,
    data: {
      totalUsers,
      activeUsers,
      totalContent,
      pendingContent,
      totalRoadmaps,
      publishedRoadmaps,
    },
  });
});

const getPendingContent = asyncHandler(async (req, res) => {
  const content = await Content.find({
    status: 'pending',
  })
    .populate('creatorId', 'name email')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: content.length,
    data: content,
  });
});

const getSystemUsers = asyncHandler(async (req, res) => {
  const users = await User.find()
    .select('-password -refreshTokens')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: users.length,
    data: users,
  });
});

module.exports = {
  getDashboard,
  getPendingContent,
  getSystemUsers,
};