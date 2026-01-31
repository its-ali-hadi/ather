const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { protect } = require('../middleware/auth');
const { validatePost } = require('../middleware/validation');

// Public routes
router.get('/', postController.getPosts);
router.get('/search', postController.searchPosts);
router.get('/user/:userId', postController.getUserPosts);
router.get('/:id', postController.getPost);

// Protected routes
router.use(protect);
router.post('/', validatePost, postController.createPost);
router.get('/my/posts', postController.getMyPosts);
router.get('/my/private', postController.getPrivatePosts);
router.get('/my/archived', postController.getArchivedPosts);
router.put('/:id', validatePost, postController.updatePost);
router.delete('/:id', postController.deletePost);
router.post('/:id/archive', postController.archivePost);
router.post('/:id/publish', postController.publishPost);

module.exports = router;
