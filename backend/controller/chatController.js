const asyncHandler = require('express-async-handler');
const Chat = require('../model/chatModel');
const User = require('../model/userModel');
const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    res.status(400).json({
      message: 'to which user chat is creating is not defined',
    });
  }
  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate('users', '-password')
    .populate('latestMessage');

  isChat = await User.populate(isChat, {
    path: 'latestMessage.sender',
    select: 'name,pictire,email',
  });
  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: 'sender',
      isGroupChat: false,
      users: [req.user._id, userId],
    };
    try {
      const createdChat = await Chat.create(chatData);
      const fullChat = await Chat.findOne({
        _id: createdChat._id,
      }).populate('users', '-password');
      res.status(200).send(fullChat);
    } catch (error) {
      res.status(400).json({
        error: error.message,
      });
    }
  }
});

const fetchChats = asyncHandler(async (req, res) => {
  try {
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate('users', '-password')
      .populate('groupAdmin', '-password')
      .populate('latestMessage')
      .sort({ updatedAt: -1 })
      .then(async (result) => {
        result = await User.populate(result, {
          path: 'latestMessage.sender',
          select: 'name, picture, email',
        });
        res.status(200).send(result);
      });
  } catch (error) {}
});

const createGroupChat = asyncHandler(async (req, res) => {
  if (!req.body.users || !req.body.name) {
    res.status(400).json({ message: 'please fill all feilds' });
  }
  var users = JSON.parse(req.body.users);

  if (users.length < 1) {
    res
      .status(400)
      .json({ message: 'minimum 2 people required to form a group' });
  }
  users.push(req.user);
  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate('users', '-password')
      .populate('groupAdmin', '-password');

    res.status(200).json(fullGroupChat);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

const renameGroup = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;
  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName,
    },
    { new: true }
  )
    .populate('users', '-password')
    .populate('groupAdmin', '-password');
  if (!updatedChat) {
    res.status(400).json({ message: 'update unsuccessfull' });
  }
  res.status(200).json(updatedChat);
});
const addGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;
  const added = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    { new: true }
  )
    .populate('users', '-password')
    .populate('groupAdmin', '-password');

  if (!added) {
    res.status(400).json({ message: 'user adding unsuccessfully' });
  }
  res.status(200).json(added);
});

const removeFromGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;
  const removed = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    { new: true }
  )
    .populate('users', '-password')
    .populate('groupAdmin', '-password');

  if (!removed) {
    res.status(400).json({ message: 'user removing unsuccessfull' });
  }
  res.status(200).json(removed);
});

module.exports = {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addGroup,
  removeFromGroup,
};
