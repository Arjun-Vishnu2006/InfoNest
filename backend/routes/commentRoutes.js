const express = require('express');

const {
  getComments,
  createComment,
  updateComment,
  deleteComment,
} = require('../controllers/commentController');

const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/:contentId', getComments);

router.post('/', protect, createComment);

router.put('/:id', protect, updateComment);

router.delete('/:id', protect, deleteComment);

module.exports = router;