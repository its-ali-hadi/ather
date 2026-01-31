const axios = require('axios');
require('dotenv').config();

const OTP_DEV_APP_ID = process.env.OTP_DEV_APP_ID;
const OTP_DEV_CLIENT_ID = process.env.OTP_DEV_CLIENT_ID;
const OTP_DEV_CLIENT_SECRET = process.env.OTP_DEV_CLIENT_SECRET;
const OTP_DEV_API_URL = process.env.OTP_DEV_API_URL || 'https://api.otp.dev/v1';

// Test account configuration
const TEST_PHONE_NUMBER = process.env.TEST_PHONE_NUMBER;
const TEST_OTP_CODE = process.env.TEST_OTP_CODE;

/**
 * إرسال OTP عبر SMS
 * @param {string} phone - رقم الهاتف بصيغة دولية (مثال: +9647XXXXXXXXX)
 * @returns {Promise<{success: boolean, orderId?: string, error?: string}>}
 */
const sendOTP = async (phone) => {
  try {
    // تحويل الرقم الدولي إلى صيغة عراقية للمقارنة
    const localPhone = phone.startsWith('+964') 
      ? '0' + phone.substring(4) 
      : phone;

    // التحقق من الرقم التجريبي
    if (TEST_PHONE_NUMBER && localPhone === TEST_PHONE_NUMBER) {
      console.log('استخدام الرقم التجريبي:', localPhone);
      return {
        success: true,
        orderId: 'test-order-id-' + Date.now(),
      };
    }

    const response = await axios.post(
      `${OTP_DEV_API_URL}/send`,
      {
        app_id: OTP_DEV_APP_ID,
        phone_number: phone,
        channel: 'sms',
      },
      {
        auth: {
          username: OTP_DEV_CLIENT_ID,
          password: OTP_DEV_CLIENT_SECRET,
        },
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.data && response.data.order_id) {
      return {
        success: true,
        orderId: response.data.order_id,
      };
    }

    return {
      success: false,
      error: 'فشل إرسال رمز التحقق',
    };
  } catch (error) {
    console.error('OTP Send Error:', error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data?.message || 'فشل إرسال رمز التحقق',
    };
  }
};

/**
 * التحقق من OTP
 * @param {string} orderId - معرف الطلب من sendOTP
 * @param {string} code - رمز التحقق المدخل من المستخدم
 * @returns {Promise<{success: boolean, verified?: boolean, error?: string}>}
 */
const verifyOTP = async (orderId, code) => {
  try {
    // التحقق من الرقم التجريبي
    if (orderId.startsWith('test-order-id-')) {
      console.log('التحقق من OTP التجريبي');
      if (code === TEST_OTP_CODE) {
        return {
          success: true,
          verified: true,
        };
      } else {
        return {
          success: false,
          verified: false,
          error: 'رمز التحقق غير صحيح',
        };
      }
    }

    const response = await axios.post(
      `${OTP_DEV_API_URL}/verify`,
      {
        order_id: orderId,
        code: code,
      },
      {
        auth: {
          username: OTP_DEV_CLIENT_ID,
          password: OTP_DEV_CLIENT_SECRET,
        },
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.data && response.data.verified) {
      return {
        success: true,
        verified: true,
      };
    }

    return {
      success: false,
      verified: false,
      error: 'رمز التحقق غير صحيح',
    };
  } catch (error) {
    console.error('OTP Verify Error:', error.response?.data || error.message);
    return {
      success: false,
      verified: false,
      error: error.response?.data?.message || 'فشل التحقق من الرمز',
    };
  }
};

module.exports = {
  sendOTP,
  verifyOTP,
};