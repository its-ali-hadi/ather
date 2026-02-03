const { validationResult, body } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'خطأ في البيانات المدخلة',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }

  next();
};

const validatePost = [
  body('title').trim().notEmpty().withMessage('عنوان المنشور مطلوب'),
  body('content').optional().trim(),
  body('type').optional().isIn(['text', 'image', 'link', 'video']).withMessage('نوع المنشور غير صحيح'),
  body('category').optional().trim(),
  validate
];

module.exports = { validate, validatePost };