const express = require('express');
const { body, param } = require('express-validator');
const { validate } = require('../middleware/validation');
const { auth } = require('../middleware/auth');
const { requireAuth } = require('../middleware/guestCheck');
const favoriteController = require('../controllers/favoriteController');

const router = express.Router();

// All favorite actions require authentication
router.get('/', auth, requireAuth, favoriteController.getUserFavorites);
router.post('/', auth, requireAuth, body('post_id').isInt(), validate, favoriteController.addFavorite);
router.delete('/:postId', auth, requireAuth, param('postId').isInt(), validate, favoriteController.removeFavorite);

module.exports = router;
