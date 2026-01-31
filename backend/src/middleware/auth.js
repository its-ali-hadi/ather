const jwt = require('jsonwebtoken');

// Required authentication
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'الرجاء تسجيل الدخول'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'الرجاء تسجيل الدخول'
    });
  }
};

// Optional authentication (for guests)
const optionalAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
    }
    // If no token, continue without user
    next();
  } catch (error) {
    // If token is invalid, continue without user
    next();
  }
};

// Admin only
const adminOnly = async (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'غير مصرح لك بالوصول'
    });
  }
  next();
};

module.exports = { auth, optionalAuth, adminOnly };
