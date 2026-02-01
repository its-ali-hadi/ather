const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');
const { sendOTP, verifyOTP } = require('../config/otp');

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.id, 
      phone: user.phone,
      role: user.role 
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

// Send OTP for registration
exports.sendRegistrationOTP = async (req, res, next) => {
  try {
    const { phone } = req.body;

    // Check if user already exists
    const [existingUsers] = await pool.query(
      'SELECT id FROM users WHERE phone = ?',
      [phone]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'رقم الهاتف مستخدم مسبقاً'
      });
    }

    // تحويل رقم الهاتف العراقي إلى صيغة دولية
    // من 07XXXXXXXXX إلى +9647XXXXXXXXX
    const internationalPhone = phone.startsWith('07') 
      ? `+964${phone.substring(1)}` 
      : phone;

    // Send OTP
    const otpResult = await sendOTP(internationalPhone);

    if (!otpResult.success) {
      return res.status(500).json({
        success: false,
        message: otpResult.error || 'فشل إرسال رمز التحقق'
      });
    }

    res.json({
      success: true,
      message: 'تم إرسال رمز التحقق إلى هاتفك',
      data: {
        orderId: otpResult.orderId
      }
    });
  } catch (error) {
    next(error);
  }
};

// Register new user with OTP verification
exports.register = async (req, res, next) => {
  try {
    const { phone, name, orderId, code } = req.body;

    // Verify OTP
    const verifyResult = await verifyOTP(orderId, code);

    if (!verifyResult.success || !verifyResult.verified) {
      return res.status(400).json({
        success: false,
        message: verifyResult.error || 'رمز التحقق غير صحيح'
      });
    }

    // Check if user exists
    const [existingUsers] = await pool.query(
      'SELECT id FROM users WHERE phone = ?',
      [phone]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'رقم الهاتف مستخدم مسبقاً'
      });
    }

    // Create user with verified phone (no password required)
    const [result] = await pool.query(
      'INSERT INTO users (phone, name, is_verified) VALUES (?, ?, ?)',
      [phone, name, true]
    );

    // Get created user
    const [users] = await pool.query(
      'SELECT id, phone, name, email, bio, profile_image, is_verified, role, created_at FROM users WHERE id = ?',
      [result.insertId]
    );

    const user = users[0];
    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: 'تم إنشاء الحساب بنجاح',
      data: {
        user,
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

// Send OTP for login
exports.sendLoginOTP = async (req, res, next) => {
  try {
    const { phone } = req.body;

    // Find user
    const [users] = await pool.query(
      'SELECT id FROM users WHERE phone = ?',
      [phone]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'رقم الهاتف غير مسجل'
      });
    }

    // تحويل رقم الهاتف العراقي إلى صيغة دولية
    const internationalPhone = phone.startsWith('07') 
      ? `+964${phone.substring(1)}` 
      : phone;

    // Send OTP
    const otpResult = await sendOTP(internationalPhone);

    if (!otpResult.success) {
      return res.status(500).json({
        success: false,
        message: otpResult.error || 'فشل إرسال رمز التحقق'
      });
    }

    res.json({
      success: true,
      message: 'تم إرسال رمز التحقق إلى هاتفك',
      data: {
        orderId: otpResult.orderId
      }
    });
  } catch (error) {
    next(error);
  }
};

// Login user (original with password)
exports.login = async (req, res, next) => {
  try {
    const { phone, password } = req.body;

    // Find user
    const [users] = await pool.query(
      'SELECT * FROM users WHERE phone = ?',
      [phone]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'رقم الهاتف أو كلمة المرور غير صحيحة'
      });
    }

    const user = users[0];

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'رقم الهاتف أو كلمة المرور غير صحيحة'
      });
    }

    // Remove password from response
    delete user.password;

    const token = generateToken(user);

    res.json({
      success: true,
      message: 'تم تسجيل الدخول بنجاح',
      data: {
        user,
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

// Login with OTP
exports.loginWithOTP = async (req, res, next) => {
  try {
    const { phone, orderId, code } = req.body;

    // Verify OTP
    const verifyResult = await verifyOTP(orderId, code);

    if (!verifyResult.success || !verifyResult.verified) {
      return res.status(400).json({
        success: false,
        message: verifyResult.error || 'رمز التحقق غير صحيح'
      });
    }

    // Find user
    const [users] = await pool.query(
      'SELECT id, phone, name, email, bio, profile_image, is_verified, role, created_at FROM users WHERE phone = ?',
      [phone]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'رقم الهاتف غير مسجل'
      });
    }

    const user = users[0];
    const token = generateToken(user);

    res.json({
      success: true,
      message: 'تم تسجيل الدخول بنجاح',
      data: {
        user,
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get current user
exports.getCurrentUser = async (req, res, next) => {
  try {
    const [users] = await pool.query(
      'SELECT id, phone, name, email, bio, profile_image, is_verified, role, created_at FROM users WHERE id = ?',
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'المستخدم غير موجود'
      });
    }

    res.json({
      success: true,
      data: users[0]
    });
  } catch (error) {
    next(error);
  }
};

// Update password
exports.updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Get user with password
    const [users] = await pool.query(
      'SELECT password FROM users WHERE id = ?',
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'المستخدم غير موجود'
      });
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, users[0].password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'كلمة المرور الحالية غير صحيحة'
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await pool.query(
      'UPDATE users SET password = ? WHERE id = ?',
      [hashedPassword, req.user.id]
    );

    res.json({
      success: true,
      message: 'تم تحديث كلمة المرور بنجاح'
    });
  } catch (error) {
    next(error);
  }
};

// Save push token
exports.savePushToken = async (req, res, next) => {
  try {
    const { pushToken } = req.body;
    const userId = req.user.id;

    // Update user's push token
    await pool.query(
      'UPDATE users SET push_token = ? WHERE id = ?',
      [pushToken, userId]
    );

    res.json({
      success: true,
      message: 'تم حفظ رمز الإشعارات بنجاح'
    });
  } catch (error) {
    next(error);
  }
};
