const express = require('express');

const {
  createReview,
  getRoadmapReviews,
  updateReview,
  deleteReview,
  getUserReputation,
} = require('../controllers/reviewController');

const { protect } = require('../middleware/auth');

const router = express.Router();

router.get(
  '/roadmap/:roadmapId',
  getRoadmapReviews
);

router.get(
  '/reputation/:userId',
  getUserReputation
);

router.post(
  '/',
  protect,
  createReview
);

router.put(
  '/:id',
  protect,
  updateReview
);

router.delete(
  '/:id',
  protect,
  deleteReview
);

module.exports = router;