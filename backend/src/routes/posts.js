const express = require('express');
const { body, param, query } = require('express-validator');
const { validate } = require('../middleware/validation');
const { auth, optionalAuth } = require('../middleware/auth');
const { requireAuth } = require('../middleware/guestCheck');
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

// Public routes (guests can view)
router.get('/', optionalAuth, postController.getAllPosts);
router.get('/search', optionalAuth, postController.searchPosts);
router.get('/:id', optionalAuth, postController.getPostById);

// Protected routes (require authentication)
router.post('/', auth, requireAuth, createPostValidation, validate, postController.createPost);
router.put('/:id', auth, requireAuth, param('id').isInt(), updatePostValidation, validate, postController.updatePost);
router.delete('/:id', auth, requireAuth, param('id').isInt(), validate, postController.deletePost);

module.exports = router;
