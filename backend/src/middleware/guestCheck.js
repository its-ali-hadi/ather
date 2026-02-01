// Middleware to check if action requires authentication
const requireAuth = (req, res, next) => {
  // This middleware should be used after the auth middleware
  // It checks if the user is trying to perform an action that requires authentication
  
  if (!req.user || !req.user.id) {
    return res.status(401).json({
      success: false,
      message: 'يجب تسجيل الدخول للقيام بهذا الإجراء',
      requiresAuth: true
    });
  }
  
  next();
};

// Middleware to allow guests to view but not interact
const allowGuestView = (req, res, next) => {
  // This allows the request to proceed even without authentication
  // Used for GET requests that guests can access
  next();
};

module.exports = {
  requireAuth,
  allowGuestView
};