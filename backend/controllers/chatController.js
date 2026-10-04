const asyncHandler = require('express-async-handler');
const Chat = require('../models/Chat');
const User = require('../models/User');
const Notification = require('../models/Notification');

const isObjectId = (value) => require('mongoose').Types.ObjectId.isValid(value);

const getInbox = asyncHandler(async (req, res) => {
  const messages = await Chat.find({ $or: [{ senderId: req.user._id }, { receiverId: req.user._id }] })
    .sort({ createdAt: -1 })
    .populate('senderId', 'name profilePicture')
    .populate('receiverId', 'name profilePicture');
  const conversations = new Map();
  for (const message of messages) {
    const sender = message.senderId;
    const receiver = message.receiverId;
    if (!sender || !receiver) continue;
    const other = sender._id.toString() === req.user._id.toString() ? receiver : sender;
    const key = other._id.toString();
    if (!conversations.has(key)) conversations.set(key, { user: other, latestMessage: message, unreadCount: 0 });
    if (receiver._id.toString() === req.user._id.toString() && message.status !== 'read' && message.status !== 'deleted') conversations.get(key).unreadCount += 1;
  }
  res.json({ success: true, count: conversations.size, data: [...conversations.values()] });
});

const sendMessage = asyncHandler(async (req, res) => {
  const { receiverId, message } = req.body;

  if (!isObjectId(receiverId)) {
    res.status(400);
    throw new Error('A valid receiverId is required');
  }
  if (typeof message !== 'string' || !message.trim() || message.trim().length > 2000) {
    res.status(400);
    throw new Error('Message must contain 1 to 2000 characters');
  }
  if (receiverId === req.user._id.toString()) {
    res.status(400);
    throw new Error('You cannot message yourself');
  }

  const receiver = await User.findById(receiverId);

  if (!receiver) {
    res.status(404);
    throw new Error('Receiver not found');
  }

  const chat = await Chat.create({
    senderId: req.user._id,
    receiverId,
    message: message.trim(),
    status: 'sent',
  });

  await Notification.create({
    userId: receiverId,
    message: `${req.user.name || 'Someone'} sent you a message`,
    type: 'chat',
    link: '/messages',
  });

  res.status(201).json({
    success: true,
    message: 'Message sent successfully',
    data: chat,
  });
});

const getConversation = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!isObjectId(userId)) {
    res.status(400);
    throw new Error('A valid userId is required');
  }

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
  if (!isObjectId(req.params.id)) {
    res.status(400);
    throw new Error('A valid message id is required');
  }
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
  if (!isObjectId(req.params.id)) {
    res.status(400);
    throw new Error('A valid message id is required');
  }
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
  getInbox,
  sendMessage,
  getConversation,
  markMessageRead,
  deleteMessage,
};
