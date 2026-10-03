const express = require('express');

const { body } = require('express-validator');

const validate = require('../middleware/validate');

const {
  protect,
  authorize,
} = require('../middleware/auth');

const {
  listGoals,
  getGoal,
  createGoal,
  updateGoal,
  deleteGoal,
} = require('../controllers/goalController');

const router = express.Router();

// =====================================================
// VALIDATION
// =====================================================

const goalValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 150 })
    .withMessage(
      'Title cannot exceed 150 characters'
    ),

  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required'),

  body('description')
    .trim()
    .notEmpty()
    .withMessage(
      'Description is required'
    ),

  body('targetHoursPerWeek').optional().isFloat({ min: 0 }).withMessage('Weekly target must be a non-negative number'),
  body('targetCompletionDate').optional({ nullable: true }).isISO8601().withMessage('Target date must be a valid date'),
  body('progressPercent').optional().isFloat({ min: 0, max: 100 }).withMessage('Progress must be between 0 and 100'),
  body('completedHours').optional().isFloat({ min: 0 }).withMessage('Completed hours must be non-negative'),
];

// =====================================================
// PUBLIC ROUTES
// =====================================================

// Get all goals
router.get(
  '/',
  listGoals
);

// Get a single goal
router.get(
  '/:id',
  getGoal
);

// =====================================================
// PROTECTED ROUTES
// =====================================================

// All routes below this point require login
router.use(protect);

// =====================================================
// CREATE GOAL
// =====================================================

// Learners can create their own goals.
// ContentCreators and Admins are also permitted.
router.post(
  '/',
  authorize(
    'Learner',
    'ContentCreator',
    'Admin'
  ),
  goalValidation,
  validate,
  createGoal
);

// =====================================================
// UPDATE GOAL
// =====================================================

// Controller should check ownership or Admin access.
router.put(
  '/:id',
  authorize(
    'Learner',
    'ContentCreator',
    'Admin'
  ),
  goalValidation,
  validate,
  updateGoal
);

// =====================================================
// DELETE GOAL
// =====================================================

router.delete(
  '/:id',
  authorize(
    'Learner',
    'ContentCreator',
    'Admin'
  ),
  deleteGoal
);

module.exports = router;