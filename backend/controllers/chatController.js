const asyncHandler = require('express-async-handler');
const Chat = require('../models/Chat');
const User = require('../models/User');

const sendMessage = asyncHandler(async (req, res) => {
  const { receiverId, message } = req.body;

  const receiver = await User.findById(receiverId);

  if (!receiver) {
    res.status(404);
    throw new Error('Receiver not found');
  }

  const chat = await Chat.create({
    senderId: req.user._id,
    receiverId,
    message,
    status: 'sent',
  });

  res.status(201).json({
    success: true,
    message: 'Message sent successfully',
    data: chat,
  });
});

const getConversation = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const messages = await Chat.find({
    $or: [
      {
        senderId: req.user._id,
        receiverId: userId,
      },
      {
        senderId: userId,
        receiverId: req.user._id,
      },
    ],
  })
    .populate('senderId', 'name profilePicture')
    .populate('receiverId', 'name profilePicture')
    .sort({ createdAt: 1 });

  res.json({
    success: true,
    count: messages.length,
    data: messages,
  });
});

const markMessageRead = asyncHandler(async (req, res) => {
  const chat = await Chat.findById(req.params.id);

  if (!chat) {
    res.status(404);
    throw new Error('Message not found');
  }

  if (chat.receiverId.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized');
  }

  chat.status = 'read';
  await chat.save();

  res.json({
    success: true,
    message: 'Message marked as read',
    data: chat,
  });
});

const deleteMessage = asyncHandler(async (req, res) => {
  const chat = await Chat.findById(req.params.id);

  if (!chat) {
    res.status(404);
    throw new Error('Message not found');
  }

  if (chat.senderId.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized');
  }

  chat.status = 'deleted';
  await chat.save();

  res.json({
    success: true,
    message: 'Message deleted',
  });
});

module.exports = {
  sendMessage,
  getConversation,
  markMessageRead,
  deleteMessage,
};