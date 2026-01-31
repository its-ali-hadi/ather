const express = require('express');
const { auth } = require('../middleware/auth');
const likeController = require('../controllers/likeController');

const router = express.Router();

// Routes
router.post('/:postId', auth, likeController.toggleLike);
router.get('/:postId', likeController.getPostLikes);

module.exports = router;