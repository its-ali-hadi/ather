const express = require('express');
const { body } = require('express-validator');
const { validate } = require('../middleware/validation');
const { auth, optionalAuth } = require('../middleware/auth');
const userController = require('../controllers/userController');

const router = express.Router();

// Validation rules
const updateProfileValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('الاسم يجب أن يكون بين 2 و 100 حرف'),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('البريد الإلكتروني غير صحيح'),
  body('bio')
    .optional()
    .isLength({ max: 500 })
    .withMessage('النبذة يجب أن تكون أقل من 500 حرف')
];

// Routes
router.get('/search', userController.searchUsers);
router.get('/:id', optionalAuth, userController.getUserProfile);
router.put('/profile', auth, updateProfileValidation, validate, userController.updateProfile);
router.post('/:id/follow', auth, userController.followUser);
router.delete('/:id/follow', auth, userController.unfollowUser);
router.get('/:id/followers', userController.getFollowers);
router.get('/:id/following', userController.getFollowing);

module.exports = router;