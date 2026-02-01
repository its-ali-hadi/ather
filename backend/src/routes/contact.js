const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { authenticate, requireAdmin } = require('../middleware/auth');
const { body } = require('express-validator');
const { validate } = require('../middleware/validation');

// Validation rules
const createMessageValidation = [
  body('subject')
    .trim()
    .notEmpty()
    .withMessage('العنوان مطلوب')
    .isLength({ max: 255 })
    .withMessage('العنوان طويل جداً'),
  body('message')
    .trim()
    .notEmpty()
    .withMessage('الرسالة مطلوبة')
    .isLength({ min: 10 })
    .withMessage('الرسالة قصيرة جداً'),
];

const replyValidation = [
  body('reply')
    .trim()
    .notEmpty()
    .withMessage('الرد مطلوب')
    .isLength({ min: 10 })
    .withMessage('الرد قصير جداً'),
];

const statusValidation = [
  body('status')
    .isIn(['pending', 'read', 'replied', 'closed'])
    .withMessage('حالة غير صالحة'),
];

// Public/User routes
router.post('/', authenticate, createMessageValidation, validate, contactController.createContactMessage);
router.get('/my', authenticate, contactController.getUserMessages);

// Admin routes
router.get('/', authenticate, requireAdmin, contactController.getAllMessages);
router.get('/:id', authenticate, requireAdmin, contactController.getMessage);
router.put('/:id/status', authenticate, requireAdmin, statusValidation, validate, contactController.updateMessageStatus);
router.post('/:id/reply', authenticate, requireAdmin, replyValidation, validate, contactController.replyToMessage);
router.delete('/:id', authenticate, requireAdmin, contactController.deleteMessage);

module.exports = router;