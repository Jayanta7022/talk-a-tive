const asyncHandler = require('express-async-handler');
const Message = require('../model/messageModel');
const User = require('../model/userModel');
const Chat = require('../model/chatModel');

const SendMessage = asyncHandler(async (req, res) => {
  //   console.log(req.body);
  const { chatId, content } = req.body;
  if (!content || !chatId) {
    return res.status(400).json({ message: 'invalid data passed' });
  }
  var newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };

  try {
    var message = await Message.create(newMessage);
    message = await message.populate('sender', 'name picture');
    message = await message.populate('chat');
    message = await User.populate(message, {
      path: 'chat.users',
      select: 'name picture email',
    });

    await Chat.findByIdAndUpdate(chatId, {
      latestMessage: message,
    });
    res.json(message);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

const allMessages = asyncHandler(async (req, res) => {
  try {
    // console.log(req.params.chatId);
    const messages = await Message.find({ chat: req.params.chatId })
      .populate('sender', 'name email picture')
      .populate('chat');
    // console.log(messages);
    res.json(messages);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
module.exports = { SendMessage, allMessages };
