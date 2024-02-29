const express = require('express');
const { authMiddleware } = require('../middleware/authMiddleware');
const { SendMessage, allMessages } = require('../controller/messageController');
const router = express.Router();

router.route('/').post(authMiddleware, SendMessage);
router.route('/:chatId').get(authMiddleware, allMessages);

module.exports = router;
