const User = require('../model/userModel');
const generateToken = require('../config/generateToken');

const asyncHandler = require('express-async-handler');
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, picture } = req.body;

  if (!name || !email || !password) {
    res.status(400).json({ message: 'please fill all the feild' });
    return;
  }
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    res.status(409).json({
      message: 'eamil already taken/user already exists',
    });
    return;
  }
  const user = await User.create({
    name,
    email,
    password,
    picture,
  });
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      picture: user.picture,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).json({ message: 'failed to create user' });
  }
});

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({
      message: 'please give all feilds',
    });
  }
  const user = await User.findOne({
    email,
  });
  if (user && (await user.matchPassword(password))) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      picture: user.picture,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({
      message: 'user can not find',
    });
  }
});

//get user from quuery
const allUser = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: 'i' } },
          { email: { $regex: req.query.search, $options: 'i' } },
        ],
      }
    : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });

  res.status(200).send(users);
});
module.exports = { registerUser, authUser, allUser };
