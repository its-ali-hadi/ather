const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'غير مصرح لك بالوصول، يرجى تسجيل الدخول'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Add user info to request
    req.user = {
      id: decoded.id,
      phone: decoded.phone,
      role: decoded.role
    };

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'رمز الوصول غير صالح'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'انتهت صلاحية رمز الوصول، يرجى تسجيل الدخول مرة أخرى'
      });
    }

    res.status(500).json({
      success: false,
      message: 'حدث خطأ في التحقق من الهوية'
    });
  }
};

// Optional auth - doesn't fail if no token
const optionalAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = {
        id: decoded.id,
        phone: decoded.phone,
        role: decoded.role
      };
    }
    
    next();
  } catch (error) {
    // Continue without user info
    next();
  }
};

// Admin only middleware
const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'غير مصرح لك بالوصول لهذه الصفحة'
    });
  }
  next();
};

module.exports = { auth, optionalAuth, adminOnly };