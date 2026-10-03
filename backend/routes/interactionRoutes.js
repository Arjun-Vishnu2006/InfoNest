const express = require('express');

const {
  likeContent,
  getLikeCount,
} = require('../controllers/interactionController');

const { protect } = require('../middleware/auth');

const router = express.Router();

router.post(
  '/content/:contentId/like',
  protect,
  likeContent
);

router.get(
  '/content/:contentId/likes',
  getLikeCount
);

module.exports = router;