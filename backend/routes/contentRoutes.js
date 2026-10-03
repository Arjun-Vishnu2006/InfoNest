const express = require('express');

const {
  getContent,
  getContentById,
  createContent,
  updateContent,
  deleteContent,
  updateContentStatus,
  getContentFeed,
} = require('../controllers/contentController');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', getContent);
router.get('/feed', protect, getContentFeed);
router.get('/:id', getContentById);

router.post(
  '/',
  protect,
  authorize('Learner', 'ContentCreator', 'Admin'),
  createContent
);

router.put(
  '/:id',
  protect,
  authorize('ContentCreator', 'Admin'),
  updateContent
);

router.delete(
  '/:id',
  protect,
  authorize('ContentCreator', 'Admin'),
  deleteContent
);

router.patch(
  '/:id/status',
  protect,
  authorize('Admin'),
  updateContentStatus
);

module.exports = router;