const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { auth, optionalAuth } = require('../middleware/auth');
const { validatePost } = require('../middleware/validation');
// const upload = require('../middleware/upload'); // Removed as controller takes media_url directly

// Public routes (Specific paths first)
router.get('/', optionalAuth, postController.getPosts);
router.get('/search', optionalAuth, postController.searchPosts);
router.get('/user/:userId', optionalAuth, postController.getUserPosts);

// Protected routes (Specific paths first)
// Note: We mount these before /:id to prevent /my being captured by /:id
router.get('/my', auth, postController.getMyPosts);
router.get('/my/likes', auth, postController.getLikedPosts);
router.get('/my/private', auth, postController.getPrivatePosts);
router.get('/my/archived', auth, postController.getArchivedPosts);

// Protected Action routes
router.post('/', auth, validatePost, postController.createPost);
router.put('/:id', auth, validatePost, postController.updatePost);
router.delete('/:id', auth, postController.deletePost);
router.post('/:id/archive', auth, postController.archivePost);
router.post('/:id/publish', auth, postController.publishPost);

// Public Generic routes (Must be last)
router.get('/:id', optionalAuth, postController.getPost);

module.exports = router;
