const asyncHandler = require('express-async-handler');
const Goal = require('../models/Goal');

const escapeRegex = (value) =>
  value.replace(
    /[.*+?^${}()|[\]\\]/g,
    '\\$&'
  );

// @desc    List / search goals
// @route   GET /api/v1/goals?search=&category=
// @access  Public
const listGoals = asyncHandler(
  async (req, res) => {
    const { search, category, createdBy } = req.query;

    const filter = {};

    if (category) {
      filter.category = category;
    }

    if (createdBy) {
      filter.createdBy = createdBy;
    }

    if (search) {
      filter.$text = {
        $search: search,
      };
    }

    let query = Goal.find(filter);

    if (search) {
      query = query.sort({
        score: {
          $meta: 'textScore',
        },
      });
    } else {
      query = query.sort({
        title: 1,
      });
    }

    const goals = await query;

    res.status(200).json({
      success: true,
      data: { goals },
    });
  }
);

// @desc    Get a single goal
// @route   GET /api/v1/goals/:id
// @access  Public
const getGoal = asyncHandler(
  async (req, res) => {
    const goal = await Goal.findById(
      req.params.id
    );

    if (!goal) {
      res.status(404);
      throw new Error('Goal not found');
    }

    res.status(200).json({
      success: true,
      data: { goal },
    });
  }
);

// @desc    Create a goal
// @route   POST /api/v1/goals
// @access  Private/ContentCreator/Admin
const createGoal = asyncHandler(
  async (req, res) => {
    const {
      title,
      category,
      description,
      targetHoursPerWeek,
      targetCompletionDate,
    } = req.body;

    const normalizedTitle =
      title.trim();

    const duplicate =
      await Goal.findOne({
        createdBy: req.user._id,
        title: new RegExp(
          `^${escapeRegex(normalizedTitle)}$`,
          'i'
        ),
      });

    if (duplicate) {
      res.status(409);
      throw new Error(
        'A goal with this title already exists'
      );
    }

    const goal = await Goal.create({
      title: normalizedTitle,
      category,
      description,
      targetHoursPerWeek: targetHoursPerWeek ?? 10,
      targetCompletionDate: targetCompletionDate || undefined,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      data: { goal },
    });
  }
);

// @desc    Update a goal
// @route   PUT /api/v1/goals/:id
// @access  Private/ContentCreator owner or Admin
const updateGoal = asyncHandler(
  async (req, res) => {
    const goal = await Goal.findById(
      req.params.id
    );

    if (!goal) {
      res.status(404);
      throw new Error('Goal not found');
    }

    if (
      req.user.role !== 'Admin' &&
      String(goal.createdBy) !==
        String(req.user._id)
    ) {
      res.status(403);
      throw new Error(
        'You are not permitted to edit this goal'
      );
    }

    if (req.body.title !== undefined) {
      const normalizedTitle =
        req.body.title.trim();

      const duplicate =
        await Goal.findOne({
          _id: { $ne: goal._id },
          createdBy: req.user._id,
          title: new RegExp(
            `^${escapeRegex(
              normalizedTitle
            )}$`,
            'i'
          ),
        });

      if (duplicate) {
        res.status(409);
        throw new Error(
          'A goal with this title already exists'
        );
      }

      goal.title = normalizedTitle;
    }

    [
      'category',
      'description',
      'status',
      'targetHoursPerWeek',
      'targetCompletionDate',
      'progressPercent',
      'completedHours',
      'streakDays',
    ].forEach((field) => {
      if (req.body[field] !== undefined) {
        goal[field] = req.body[field];
      }
    });

    await goal.save();

    res.status(200).json({
      success: true,
      data: { goal },
    });
  }
);

// @desc    Delete a goal
// @route   DELETE /api/v1/goals/:id
// @access  Private/Admin
const deleteGoal = asyncHandler(
  async (req, res) => {
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
      res.status(404);
      throw new Error('Goal not found');
    }

    if (
      req.user.role !== 'Admin' &&
      String(goal.createdBy) !== String(req.user._id)
    ) {
      res.status(403);
      throw new Error('You are not permitted to delete this goal');
    }

    await Goal.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Goal removed',
    });
  }
);

module.exports = {
  listGoals,
  getGoal,
  createGoal,
  updateGoal,
  deleteGoal,
};