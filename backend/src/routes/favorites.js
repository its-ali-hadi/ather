const express = require('express');
const { auth } = require('../middleware/auth');
const favoriteController = require('../controllers/favoriteController');

const router = express.Router();

// Routes
router.post('/:postId', auth, favoriteController.toggleFavorite);
router.get('/', auth, favoriteController.getUserFavorites);

module.exports = router;