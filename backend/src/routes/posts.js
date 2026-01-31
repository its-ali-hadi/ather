const express = require('express');
const { body } = require('express-validator');
const { validate } = require('../middleware/validation');
const { auth, optionalAuth } = require('../middleware/auth');
const postController = require('../controllers/postController');

const router = express.Router();

// Validation rules
const createPostValidation = [
  body('type')
    .isIn(['text', 'image', 'video', 'link'])
    .withMessage('نوع المنشور غير صحيح'),
  body('content')
    .trim()
    .isLength({ min: 1, max: 5000 })
    .withMessage('المحتوى يجب أن يكون بين 1 و 5000 حرف'),
  body('title')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('العنوان يجب أن يكون أقل من 255 حرف'),
  body('category')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('الفئة يجب أن تكون أقل من 50 حرف')
];

const updatePostValidation = [
  body('content')
    .optional()
    .trim()
    .isLength({ min: 1, max: 5000 })
    .withMessage('المحتوى يجب أن يكون بين 1 و 5000 حرف'),
  body('title')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('العنوان يجب أن يكون أقل من 255 حرف'),
  body('category')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('الفئة يجب أن تكون أقل من 50 حرف')
];

// Routes
router.get('/', optionalAuth, postController.getPosts);
router.get('/search', optionalAuth, postController.searchPosts);
router.get('/:id', optionalAuth, postController.getPost);
router.get('/user/:userId', optionalAuth, postController.getUserPosts);
router.post('/', auth, createPostValidation, validate, postController.createPost);
router.put('/:id', auth, updatePostValidation, validate, postController.updatePost);
router.delete('/:id', auth, postController.deletePost);
router.post('/:id/archive', auth, postController.archivePost);

module.exports = router;