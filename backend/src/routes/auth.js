const express = require('express');
const { body } = require('express-validator');
const { validate } = require('../middleware/validation');
const { auth } = require('../middleware/auth');
const authController = require('../controllers/authController');

const router = express.Router();

// Validation rules
const phoneValidation = [
  body('phone')
    .matches(/^07[3-9]\d{8}$/)
    .withMessage('رقم الهاتف يجب أن يكون عراقي صحيح'),
];

const registerValidation = [
  body('phone')
    .matches(/^07[3-9]\d{8}$/)
    .withMessage('رقم الهاتف يجب أن يكون عراقي صحيح'),
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('الاسم يجب أن يكون بين 2 و 100 حرف'),
  body('orderId')
    .notEmpty()
    .withMessage('معرف الطلب مطلوب'),
  body('code')
    .notEmpty()
    .withMessage('رمز التحقق مطلوب'),
];

const loginValidation = [
  body('phone')
    .matches(/^07[3-9]\d{8}$/)
    .withMessage('رقم الهاتف غير صحيح'),
  body('password')
    .notEmpty()
    .withMessage('كلمة المرور مطلوبة')
];

const loginOTPValidation = [
  body('phone')
    .matches(/^07[3-9]\d{8}$/)
    .withMessage('رقم الهاتف غير صحيح'),
  body('orderId')
    .notEmpty()
    .withMessage('معرف الطلب مطلوب'),
  body('code')
    .notEmpty()
    .withMessage('رمز التحقق مطلوب'),
];

const updatePasswordValidation = [
  body('currentPassword')
    .notEmpty()
    .withMessage('كلمة المرور الحالية مطلوبة'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل')
];

const pushTokenValidation = [
  body('pushToken')
    .notEmpty()
    .withMessage('رمز الإشعارات مطلوب'),
];

// OTP Routes
router.post('/send-registration-otp', phoneValidation, validate, authController.sendRegistrationOTP);
router.post('/send-login-otp', phoneValidation, validate, authController.sendLoginOTP);

// Auth Routes
router.post('/register', registerValidation, validate, authController.register);
router.post('/login', loginValidation, validate, authController.login);
router.post('/login-otp', loginOTPValidation, validate, authController.loginWithOTP);
router.get('/me', auth, authController.getCurrentUser);
router.put('/password', auth, updatePasswordValidation, validate, authController.updatePassword);

// Push Token
router.post('/push-token', auth, pushTokenValidation, validate, authController.savePushToken);

module.exports = router;
