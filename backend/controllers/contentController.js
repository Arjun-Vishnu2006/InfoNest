const asyncHandler = require('express-async-handler');
const Content = require('../models/Content');

// Get approved content
const getContent = asyncHandler(async (req, res) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(
    Math.max(parseInt(req.query.limit, 10) || 10, 1),
    50
  );

  const skip = (page - 1) * limit;

  const filter = {
    status: 'approved',
  };

  if (req.query.category) {
    filter.category = req.query.category;
  }

  const search = req.query.search?.trim();

  if (search) {
    filter.$text = { $search: search };
  }

  const [content, total] = await Promise.all([
    Content.find(filter)
      .populate('creatorId', 'name profilePicture reputationScore')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),

    Content.countDocuments(filter),
  ]);

  res.json({
    success: true,
    page,
    limit,
    total,
    data: content,
  });
});

// Get content by ID
const getContentById = asyncHandler(async (req, res) => {
  const content = await Content.findOne({
    _id: req.params.id,
    status: 'approved',
  }).populate(
    'creatorId',
    'name profilePicture reputationScore expertiseArea'
  );

  if (!content) {
    res.status(404);
    throw new Error('Content not found');
  }

  res.json({
    success: true,
    data: content,
  });
});

// Create content
const createContent = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    contentType,
    contentUrl,
    category,
  } = req.body;

  const content = await Content.create({
    creatorId: req.user._id,
    title,
    description,
    contentType,
    contentUrl,
    category,
    status: 'pending',
  });

  res.status(201).json({
    success: true,
    message: 'Content submitted for approval',
    data: content,
  });
});

// Update content
const updateContent = asyncHandler(async (req, res) => {
  const content = await Content.findById(req.params.id);

  if (!content) {
    res.status(404);
    throw new Error('Content not found');
  }

  if (
    req.user.role !== 'Admin' &&
    content.creatorId.toString() !== req.user._id.toString()
  ) {
    res.status(403);
    throw new Error('Not authorized to update this content');
  }

  const fields = [
    'title',
    'description',
    'contentType',
    'contentUrl',
    'category',
  ];

  fields.forEach((field) => {
    if (req.body[field] !== undefined) {
      content[field] = req.body[field];
    }
  });

  if (req.user.role !== 'Admin') {
    content.status = 'pending';
  }

  await content.save();

  res.json({
    success: true,
    message: 'Content updated successfully',
    data: content,
  });
});

// Delete content
const deleteContent = asyncHandler(async (req, res) => {
  const content = await Content.findById(req.params.id);

  if (!content) {
    res.status(404);
    throw new Error('Content not found');
  }

  if (
    req.user.role !== 'Admin' &&
    content.creatorId.toString() !== req.user._id.toString()
  ) {
    res.status(403);
    throw new Error('Not authorized to delete this content');
  }

  await content.deleteOne();

  res.json({
    success: true,
    message: 'Content deleted successfully',
  });
});

// Admin approve/reject content
const updateContentStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!['approved', 'rejected', 'pending'].includes(status)) {
    res.status(400);
    throw new Error('Invalid content status');
  }

  const content = await Content.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true }
  );

  if (!content) {
    res.status(404);
    throw new Error('Content not found');
  }

  res.json({
    success: true,
    message: `Content ${status}`,
    data: content,
  });
});

// @desc    Get personalized content feed based on user profile
// @route   GET /api/v1/content/feed
// @access  Private
const getContentFeed = asyncHandler(async (req, res) => {
  const User = require('../models/User');
  const user = await User.findById(req.user._id).select('skills expertiseArea about').lean();

  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 20, 1), 50);
  const skip = (page - 1) * limit;

  const filter = { status: 'approved' };

  // Try to personalize: if user has skills or expertise, boost matching content
  const keywords = [...(user?.skills || []), user?.expertiseArea].filter(Boolean);
  let content;
  let total;

  if (keywords.length > 0) {
    const expressions = keywords.map(k => new RegExp(k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'));
    const personalizedFilter = {
      ...filter,
      $or: [
        { title: { $in: expressions } },
        { description: { $in: expressions } },
        { category: { $in: expressions } },
      ],
    };

    const [personalized, personalizedTotal] = await Promise.all([
      Content.find(personalizedFilter)
        .populate('creatorId', 'name profilePicture reputationScore expertiseArea')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Content.countDocuments(personalizedFilter),
    ]);

    // If personalized results exist, use them; otherwise fall back to all content
    if (personalized.length > 0) {
      content = personalized;
      total = personalizedTotal;
    } else {
      [content, total] = await Promise.all([
        Content.find(filter)
          .populate('creatorId', 'name profilePicture reputationScore expertiseArea')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit),
        Content.countDocuments(filter),
      ]);
    }
  } else {
    [content, total] = await Promise.all([
      Content.find(filter)
        .populate('creatorId', 'name profilePicture reputationScore expertiseArea')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Content.countDocuments(filter),
    ]);
  }

  res.json({
    success: true,
    page,
    limit,
    total,
    data: content,
  });
});

module.exports = {
  getContent,
  getContentById,
  createContent,
  updateContent,
  deleteContent,
  updateContentStatus,
  getContentFeed,
};