const express = require('express');
const { body, param } = require('express-validator');
const { validate } = require('../middleware/validation');
const { auth } = require('../middleware/auth');
const { requireAuth } = require('../middleware/guestCheck');
const likeController = require('../controllers/likeController');

const router = express.Router();

// All like actions require authentication
router.post('/', auth, requireAuth, body('post_id').isInt(), validate, likeController.likePost);
router.delete('/:postId', auth, requireAuth, param('postId').isInt(), validate, likeController.unlikePost);

module.exports = router;
