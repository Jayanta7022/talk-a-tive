const express = require('express');
const { authMiddleware } = require('../middleware/authMiddleware');
const {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addGroup,
  removeFromGroup,
} = require('../controller/chatController');

const router = express.Router();

router
  .route('/')
  .post(authMiddleware, accessChat)
  .get(authMiddleware, fetchChats);

router.route('/group').post(authMiddleware, createGroupChat);
router.route('/rename').put(authMiddleware, renameGroup);
router.route('/groupadd').put(authMiddleware, addGroup);
router.route('/groupremove').put(authMiddleware, removeFromGroup);
module.exports = router;
