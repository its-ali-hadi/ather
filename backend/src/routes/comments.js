const express = require('express');
const { body } = require('express-validator');
const { validate } = require('../middleware/validation');
const { auth } = require('../middleware/auth');
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

// Routes
router.get('/post/:postId', commentController.getPostComments);
router.get('/:commentId/replies', commentController.getCommentReplies);
router.post('/', auth, createCommentValidation, validate, commentController.createComment);
router.put('/:id', auth, updateCommentValidation, validate, commentController.updateComment);
router.delete('/:id', auth, commentController.deleteComment);

module.exports = router;