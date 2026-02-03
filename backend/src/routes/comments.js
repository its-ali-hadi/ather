const express = require('express');
const { body, param } = require('express-validator');
const { validate } = require('../middleware/validation');
const { auth, optionalAuth } = require('../middleware/auth');
const { requireAuth } = require('../middleware/guestCheck');
const commentController = require('../controllers/commentController');

const router = express.Router();

// Validation rules
const createCommentValidation = [
  body('post_id')
    .isInt()
    .withMessage('معرف المنشور غير صحيح'),
  body('content')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('التعليق يجب أن يكون بين 1 و 1000 حرف'),
  body('parent_id')
    .optional()
    .isInt()
    .withMessage('معرف التعليق الأصلي غير صحيح')
];

const updateCommentValidation = [
  body('content')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('التعليق يجب أن يكون بين 1 و 1000 حرف')
];

// Guests can view comments
router.get('/post/:postId', optionalAuth, param('postId').isInt(), validate, commentController.getPostComments);
router.get('/my', auth, requireAuth, commentController.getUserComments);

// Require authentication for creating/updating/deleting
router.post('/', auth, requireAuth, createCommentValidation, validate, commentController.createComment);
router.put('/:id', auth, requireAuth, param('id').isInt(), updateCommentValidation, validate, commentController.updateComment);
router.delete('/:id', auth, requireAuth, param('id').isInt(), validate, commentController.deleteComment);

module.exports = router;
