const asyncHandler = require('express-async-handler');
const User = require('../models/User');

const publicProfileFields = 'name role expertiseArea headline location about skills education experience profilePicture reputationScore isVerified createdAt';
const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// @desc    Get logged-in user's profile
// @route   GET /api/v1/users/me
// @access  Private
const getMyProfile = asyncHandler(
  async (req, res) => {
    const user = await User.findById(req.user._id);

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    res.status(200).json({
      success: true,
      data: { user },
    });
  }
);

// @desc    Update logged-in user's profile
// @route   PUT /api/v1/users/profile
// @access  Private
const updateProfile = asyncHandler(
  async (req, res) => {
    const allowedUpdates = [
      'name',
      'expertiseArea',
      'profilePicture',
      'headline',
      'location',
      'about',
      'linkedinUrl',
      'skills',
      'education',
      'experience',
      'certificates',
    ];

    const updates = {};

    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated',
      data: { user },
    });
  }
);


// @desc Search learner and creator profiles without exposing contact or account data
// @route GET /api/v1/users/search?q=
// @access Private
const searchUsers = asyncHandler(async (req, res) => {
  const term = String(req.query.q || '').trim();
  if (term.length < 2) {
    return res.status(200).json({ success: true, data: { users: [] } });
  }

  const expression = new RegExp(escapeRegex(term), 'i');
  const users = await User.find({
    _id: { $ne: req.user._id },
    isActive: true,
    role: { $in: ['Learner', 'ContentCreator'] },
    $or: [
      { name: expression }, { headline: expression }, { expertiseArea: expression },
      { about: expression }, { skills: expression }, { role: expression },
    ],
  }).select(publicProfileFields).sort({ name: 1 }).limit(25).lean();

  res.status(200).json({ success: true, data: { users } });
});
// @desc    Get a user profile by id
// @route   GET /api/v1/users/:id
// @access  Private
const getUserById = asyncHandler(
  async (req, res) => {
    const user = await User.findById(req.params.id).select(publicProfileFields);

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    res.status(200).json({
      success: true,
      data: { user },
    });
  }
);

// @desc    List all users
// @route   GET /api/v1/users
// @access  Private/Admin
const listUsers = asyncHandler(
  async (req, res) => {
    const page = Math.max(
      parseInt(req.query.page, 10) || 1,
      1
    );

    const limit = Math.min(
      parseInt(req.query.limit, 10) || 20,
      100
    );

    const [users, total] =
      await Promise.all([
        User.find()
          .skip((page - 1) * limit)
          .limit(limit)
          .sort({ createdAt: -1 }),

        User.countDocuments(),
      ]);

    res.status(200).json({
      success: true,
      data: {
        users,
        page,
        totalPages: Math.ceil(
          total / limit
        ),
        totalUsers: total,
      },
    });
  }
);

// @desc    Activate/deactivate user
// @route   PATCH /api/v1/users/:id/status
// @access  Private/Admin
const setUserStatus = asyncHandler(
  async (req, res) => {
    const { isActive } = req.body;

    if (typeof isActive !== 'boolean') {
      res.status(400);
      throw new Error(
        'isActive must be a boolean'
      );
    }

    const user =
      await User.findByIdAndUpdate(
        req.params.id,
        { isActive },
        {
          new: true,
          runValidators: true,
        }
      );

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    res.status(200).json({
      success: true,
      message: `User ${
        isActive
          ? 'activated'
          : 'deactivated'
      }`,
      data: { user },
    });
  }
);

// @desc    List content creators
// @route   GET /api/v1/users/creators
// @access  Private
const getCreators = asyncHandler(async (req, res) => {
  const filter = { role: 'ContentCreator', isActive: true };
  const search = String(req.query.q || '').trim();

  if (search.length >= 2) {
    const expression = new RegExp(escapeRegex(search), 'i');
    filter.$or = [
      { name: expression },
      { headline: expression },
      { expertiseArea: expression },
      { skills: expression },
    ];
  }

  const creators = await User.find(filter)
    .select(publicProfileFields)
    .sort({ reputationScore: -1, createdAt: -1 })
    .limit(50)
    .lean();

  res.status(200).json({
    success: true,
    data: { creators },
  });
});

// @desc    Global search across users, content, goals, roadmaps
// @route   GET /api/v1/users/global-search?q=
// @access  Private
const globalSearch = asyncHandler(async (req, res) => {
  const term = String(req.query.q || '').trim();
  if (term.length < 2) {
    return res.status(200).json({
      success: true,
      data: { users: [], content: [], roadmaps: [], goals: [] },
    });
  }

  const Content = require('../models/Content');
  const Roadmap = require('../models/Roadmap');
  const Goal = require('../models/Goal');

  const expression = new RegExp(escapeRegex(term), 'i');

  const [users, content, roadmaps, goals] = await Promise.all([
    User.find({
      isActive: true,
      $or: [{ name: expression }, { headline: expression }, { expertiseArea: expression }, { skills: expression }],
    }).select(publicProfileFields).limit(10).lean(),

    Content.find({
      status: 'approved',
      $or: [{ title: expression }, { description: expression }, { category: expression }],
    }).populate('creatorId', 'name profilePicture').limit(10).lean(),

    Roadmap.find({
      status: 'published',
      $or: [{ title: expression }, { description: expression }],
    }).populate('creatorId', 'name').populate('goalId', 'title category').limit(10).lean(),

    Goal.find({
      $or: [{ title: expression }, { category: expression }, { description: expression }],
    }).limit(10).lean(),
  ]);

  res.status(200).json({
    success: true,
    data: { users, content, roadmaps, goals },
  });
});

module.exports = {
  getMyProfile,
  updateProfile,
  getUserById,
  searchUsers,
  listUsers,
  setUserStatus,
  getCreators,
  globalSearch,
};