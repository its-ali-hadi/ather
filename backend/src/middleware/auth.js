const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');

// Authentication middleware
exports.auth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'الرجاء تسجيل الدخول للوصول لهذا المورد'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from database
    const [users] = await pool.query(
      'SELECT id, phone, name, email, role, is_verified FROM users WHERE id = ?',
      [decoded.id]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'المستخدم غير موجود'
      });
    }

    // Check if user is banned
    const [banCheck] = await pool.query(
      'SELECT is_banned FROM users WHERE id = ?',
      [decoded.id]
    );

    if (banCheck[0]?.is_banned) {
      return res.status(403).json({
        success: false,
        message: 'تم حظر حسابك'
      });
    }

    // Attach user to request
    req.user = users[0];
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'رمز المصادقة غير صحيح'
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'انتهت صلاحية رمز المصادقة'
      });
    }
    next(error);
  }
};

// Admin authentication middleware
exports.adminAuth = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'الرجاء تسجيل الدخول'
      });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'ليس لديك صلاحية الوصول لهذا المورد'
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};

// Optional authentication (doesn't fail if no token)
exports.optionalAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const [users] = await pool.query(
        'SELECT id, phone, name, email, role, is_verified FROM users WHERE id = ?',
        [decoded.id]
      );

      if (users.length > 0) {
        req.user = users[0];
      }
    }

    next();
  } catch (error) {
    // Continue without user if token is invalid
    next();
  }
};