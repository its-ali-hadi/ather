const bcrypt = require('bcryptjs');
const { pool } = require('../config/database');
require('dotenv').config();

const createTestUser = async () => {
  try {
    const testPhone = process.env.TEST_PHONE_NUMBER || '07761763665';
    const testPassword = 'test123456'; // كلمة مرور افتراضية للحساب التجريبي

    // التحقق من وجود المستخدم
    const [existingUsers] = await pool.query(
      'SELECT id FROM users WHERE phone = ?',
      [testPhone]
    );

    if (existingUsers.length > 0) {
      console.log('✅ المستخدم التجريبي موجود بالفعل');
      console.log('رقم الهاتف:', testPhone);
      console.log('OTP:', process.env.TEST_OTP_CODE || '123456');
      return;
    }

    // تشفير كلمة المرور
    const hashedPassword = await bcrypt.hash(testPassword, 10);

    // إنشاء المستخدم التجريبي
    const [result] = await pool.query(
      `INSERT INTO users (phone, name, email, password, is_verified, role, bio) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        testPhone,
        'مستخدم تجريبي',
        'test@athar.app',
        hashedPassword,
        true,
        'user',
        'حساب تجريبي للتطوير'
      ]
    );

    console.log('✅ تم إنشاء المستخدم التجريبي بنجاح');
    console.log('رقم الهاتف:', testPhone);
    console.log('OTP:', process.env.TEST_OTP_CODE || '123456');
    console.log('كلمة المرور:', testPassword);
    console.log('معرف المستخدم:', result.insertId);

  } catch (error) {
    console.error('❌ خطأ في إنشاء المستخدم التجريبي:', error.message);
  } finally {
    process.exit();
  }
};

createTestUser();