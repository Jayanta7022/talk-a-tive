const express = require('express');
const {
  registerUser,
  authUser,
  allUser,
} = require('../controller/userController');
const { authMiddleware } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/').post(registerUser).get(authMiddleware, allUser);
router.route('/login').post(authUser);

module.exports = router;
