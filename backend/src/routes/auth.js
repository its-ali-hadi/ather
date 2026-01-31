const express = require('express');
const { body } = require('express-validator');
const { validate } = require('../middleware/validation');
const { auth } = require('../middleware/auth');
const authController = require('../controllers/authController');

const router = express.Router();

// Validation rules
const registerValidation = [
  body('phone')
    .matches(/^07[3-9]\d{8}$/)
    .withMessage('رقم الهاتف يجب أن يكون عراقي صحيح'),
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('الاسم يجب أن يكون بين 2 و 100 حرف'),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('البريد الإلكتروني غير صحيح'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('كلمة المرور يجب أن تكون 6 أحرف على الأقل')
];

const loginValidation = [
  body('phone')
    .matches(/^07[3-9]\d{8}$/)
    .withMessage('رقم الهاتف غير صحيح'),
  body('password')
    .notEmpty()
    .withMessage('كلمة المرور مطلوبة')
];

const updatePasswordValidation = [
  body('currentPassword')
    .notEmpty()
    .withMessage('كلمة المرور الحالية مطلوبة'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل')
];

// Routes
router.post('/register', registerValidation, validate, authController.register);
router.post('/login', loginValidation, validate, authController.login);
router.get('/me', auth, authController.getCurrentUser);
router.put('/password', auth, updatePasswordValidation, validate, authController.updatePassword);

module.exports = router;