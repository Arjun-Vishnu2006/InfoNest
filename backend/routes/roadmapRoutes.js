const express = require('express');
const { body } = require('express-validator');

const validate = require('../middleware/validate');
const {
  protect,
  authorize,
} = require('../middleware/auth');

const {
  listRoadmaps,
  getRoadmap,
  createRoadmap,
  updateRoadmap,
  deleteRoadmap,
  getMyRoadmaps,
  toggleStep,
} = require('../controllers/roadmapController');

const router = express.Router();

// Public routes
router.get('/', listRoadmaps);
router.get('/:id', getRoadmap);

// Protected routes
router.use(protect);

router.get('/my', getMyRoadmaps);
router.patch('/:id/step/:stepOrder/toggle', toggleStep);

// Content Creator creates roadmap
router.post(
  '/',
  authorize('Learner', 'ContentCreator', 'Admin'),
  [
    body('goalId')
      .notEmpty()
      .withMessage(
        'Goal ID is required'
      ),

    body('title')
      .trim()
      .notEmpty()
      .withMessage(
        'Roadmap title is required'
      )
      .isLength({ max: 150 })
      .withMessage(
        'Roadmap title cannot exceed 150 characters'
      ),

    body('description')
      .trim()
      .notEmpty()
      .withMessage(
        'Roadmap description is required'
      )
      .isLength({ max: 5000 })
      .withMessage(
        'Roadmap description cannot exceed 5000 characters'
      ),
  ],
  validate,
  createRoadmap
);

// Owner ContentCreator or Admin
router.put(
  '/:id',
  authorize(
    'ContentCreator',
    'Admin'
  ),
  updateRoadmap
);

router.delete(
  '/:id',
  authorize(
    'ContentCreator',
    'Admin'
  ),
  deleteRoadmap
);

module.exports = router;