const asyncHandler = require('express-async-handler');

const Roadmap = require('../models/Roadmap');
const Goal = require('../models/Goal');

// @desc    Search/browse published roadmaps
// @route   GET /api/v1/roadmaps?search=&goalId=
// @access  Public
const listRoadmaps = asyncHandler(
  async (req, res) => {
    const { search, goalId } = req.query;

    const filter = {
      status: 'published',
    };

    if (goalId) {
      filter.goalId = goalId;
    }

    if (search) {
      filter.$text = {
        $search: search,
      };
    }

    let query = Roadmap.find(filter)
      .populate(
        'creatorId',
        'name reputationScore'
      )
      .populate(
        'goalId',
        'title category'
      );

    if (search) {
      query = query.sort({
        score: {
          $meta: 'textScore',
        },
      });
    } else {
      query = query.sort({
        createdAt: -1,
      });
    }

    const roadmaps = await query;

    res.status(200).json({
      success: true,
      data: { roadmaps },
    });
  }
);

// @desc    View a published roadmap
// @route   GET /api/v1/roadmaps/:id
// @access  Public
const getRoadmap = asyncHandler(
  async (req, res) => {
    const roadmap =
      await Roadmap.findOne({
        _id: req.params.id,
        status: 'published',
      })
        .populate(
          'creatorId',
          'name reputationScore expertiseArea'
        )
        .populate(
          'goalId',
          'title category'
        );

    if (!roadmap) {
      res.status(404);
      throw new Error(
        'Roadmap not found'
      );
    }

    res.status(200).json({
      success: true,
      data: { roadmap },
    });
  }
);

// @desc    Create a roadmap
// @route   POST /api/v1/roadmaps
// @access  Private/ContentCreator
const createRoadmap = asyncHandler(
  async (req, res) => {
    const {
      goalId,
      title,
      description,
      steps,
      resources,
      estimatedTimeline,
      challenges,
      practicalTips,
    } = req.body;

    const goal = await Goal.findById(
      goalId
    );

    if (!goal) {
      res.status(404);
      throw new Error('Goal not found');
    }

    const roadmap =
      await Roadmap.create({
        goalId,
        creatorId: req.user._id,
        title,
        description,
        steps,
        resources,
        estimatedTimeline,
        challenges,
        practicalTips,
        status: 'draft',
      });

    res.status(201).json({
      success: true,
      data: { roadmap },
    });
  }
);

// @desc    Update owned roadmap or Admin roadmap
// @route   PUT /api/v1/roadmaps/:id
// @access  Private/ContentCreator owner or Admin
const updateRoadmap = asyncHandler(
  async (req, res) => {
    const roadmap =
      await Roadmap.findById(
        req.params.id
      );

    if (!roadmap) {
      res.status(404);
      throw new Error(
        'Roadmap not found'
      );
    }

    if (
      req.user.role !== 'Admin' &&
      String(roadmap.creatorId) !==
        String(req.user._id)
    ) {
      res.status(403);
      throw new Error(
        'You are not permitted to edit this roadmap'
      );
    }

    roadmap.versionHistory.push({
      editedAt: new Date(),
      snapshot: roadmap.toObject(),
    });

    const editable = [
      'title',
      'description',
      'steps',
      'resources',
      'estimatedTimeline',
      'challenges',
      'practicalTips',
    ];

    editable.forEach((field) => {
      if (req.body[field] !== undefined) {
        roadmap[field] =
          req.body[field];
      }
    });

    // Only Admin can directly publish/remove
    if (
      req.user.role === 'Admin' &&
      req.body.status !== undefined
    ) {
      roadmap.status =
        req.body.status;
    }

    await roadmap.save();

    res.status(200).json({
      success: true,
      data: { roadmap },
    });
  }
);

// @desc    Delete owned roadmap or Admin roadmap
// @route   DELETE /api/v1/roadmaps/:id
// @access  Private/ContentCreator owner or Admin
const deleteRoadmap = asyncHandler(
  async (req, res) => {
    const roadmap =
      await Roadmap.findById(
        req.params.id
      );

    if (!roadmap) {
      res.status(404);
      throw new Error(
        'Roadmap not found'
      );
    }

    if (
      req.user.role !== 'Admin' &&
      String(roadmap.creatorId) !==
        String(req.user._id)
    ) {
      res.status(403);
      throw new Error(
        'You are not permitted to delete this roadmap'
      );
    }

    await roadmap.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Roadmap removed',
    });
  }
);

// @desc    List roadmaps created by the authenticated user (including drafts)
// @route   GET /api/v1/roadmaps/my
// @access  Private
const getMyRoadmaps = asyncHandler(async (req, res) => {
  const roadmaps = await Roadmap.find({ creatorId: req.user._id, status: { $ne: 'removed' } })
    .populate('goalId', 'title category progressPercent')
    .sort({ updatedAt: -1 });

  res.status(200).json({
    success: true,
    data: { roadmaps },
  });
});

// @desc    Toggle a roadmap step completed/uncompleted
// @route   PATCH /api/v1/roadmaps/:id/step/:stepOrder/toggle
// @access  Private
const toggleStep = asyncHandler(async (req, res) => {
  const roadmap = await Roadmap.findById(req.params.id);

  if (!roadmap) {
    res.status(404);
    throw new Error('Roadmap not found');
  }

  if (String(roadmap.creatorId) !== String(req.user._id) && req.user.role !== 'Admin') {
    res.status(403);
    throw new Error('Not authorized to modify this roadmap');
  }

  const stepOrder = parseInt(req.params.stepOrder, 10);
  const step = roadmap.steps.find(s => s.order === stepOrder);

  if (!step) {
    res.status(404);
    throw new Error('Step not found');
  }

  step.completed = !step.completed;
  await roadmap.save();

  res.status(200).json({
    success: true,
    data: { roadmap },
  });
});

module.exports = {
  listRoadmaps,
  getRoadmap,
  createRoadmap,
  updateRoadmap,
  deleteRoadmap,
  getMyRoadmaps,
  toggleStep,
};