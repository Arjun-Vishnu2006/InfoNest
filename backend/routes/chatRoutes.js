const express = require('express');

const {
  sendMessage,
  getInbox,
  getConversation,
  markMessageRead,
  deleteMessage,
} = require('../controllers/chatController');

const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/', getInbox);

router.post('/', sendMessage);

router.get('/conversation/:userId', getConversation);

router.patch('/:id/read', markMessageRead);

router.delete('/:id', deleteMessage);

module.exports = router;
