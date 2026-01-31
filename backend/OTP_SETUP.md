# إعداد خدمة OTP.dev مع WhatsApp

## نظرة عامة

يستخدم تطبيق أثر خدمة **OTP.dev** لإرسال رموز التحقق عبر **WhatsApp** بدلاً من SMS.

## الخطوات

### 1. إنشاء حساب على OTP.dev

1. اذهب إلى [https://otp.dev](https://otp.dev)
2. قم بإنشاء حساب جديد
3. قم بتسجيل الدخول إلى لوحة التحكم

### 2. إنشاء تطبيق جديد

1. في لوحة التحكم، اضغط على "Create New App"
2. أدخل اسم التطبيق (مثال: Athar App)
3. اختر القناة: **WhatsApp**
4. احفظ التطبيق

### 3. الحصول على بيانات الاعتماد

بعد إنشاء التطبيق، ستحصل على:

- **App ID**: معرف التطبيق
- **Client ID**: معرف العميل
- **Client Secret**: المفتاح السري

### 4. إضافة البيانات إلى ملف .env

قم بإضافة البيانات التالية إلى ملف `backend/.env`:

```env
# OTP.dev Configuration
OTP_DEV_APP_ID=your_app_id_here
OTP_DEV_CLIENT_ID=your_client_id_here
OTP_DEV_CLIENT_SECRET=your_client_secret_here
OTP_DEV_API_URL=https://api.otp.dev/v1

# Test Account (للتطوير)
TEST_PHONE_NUMBER=07761763665
TEST_OTP_CODE=123456
```

### 5. تنسيق رقم الهاتف

- يجب أن يكون رقم الهاتف بصيغة دولية: `+9647XXXXXXXXX`
- التطبيق يقوم تلقائياً بتحويل الأرقام العراقية من `07XXXXXXXXX` إلى `+9647XXXXXXXXX`

## كيف يعمل؟

### إرسال OTP

```javascript
// في backend/src/config/otp.js
const response = await axios.post(
  'https://api.otp.dev/v1/send',
  {
    app_id: OTP_DEV_APP_ID,
    phone_number: '+9647XXXXXXXXX',
    channel: 'whatsapp', // استخدام WhatsApp
  },
  {
    auth: {
      username: OTP_DEV_CLIENT_ID,
      password: OTP_DEV_CLIENT_SECRET,
    }
  }
);
```

### التحقق من OTP

```javascript
const response = await axios.post(
  'https://api.otp.dev/v1/verify',
  {
    order_id: orderId,
    code: code,
  },
  {
    auth: {
      username: OTP_DEV_CLIENT_ID,
      password: OTP_DEV_CLIENT_SECRET,
    }
  }
);
```

## الحساب التجريبي

للتطوير والاختبار، يمكنك استخدام الحساب التجريبي:

- **رقم الهاتف**: `07761763665`
- **رمز OTP**: `123456`

هذا الحساب لا يرسل رسائل WhatsApp حقيقية ويقبل الرمز `123456` دائماً.

## الأمان

⚠️ **مهم**:

1. لا تشارك بيانات الاعتماد (Client ID و Client Secret) مع أحد
2. لا تضع بيانات الاعتماد في الكود المصدري
3. استخدم ملف `.env` فقط
4. أضف `.env` إلى `.gitignore`
5. احذف أو عطل الحساب التجريبي في بيئة الإنتاج

## استكشاف الأخطاء

### خطأ: "فشل إرسال رمز التحقق"

- تحقق من صحة بيانات الاعتماد
- تأكد من أن رقم الهاتف بصيغة دولية صحيحة
- تحقق من رصيد حسابك على OTP.dev

### خطأ: "رمز التحقق غير صحيح"

- تأكد من إدخال الرمز الصحيح
- تحقق من أن الرمز لم ينتهي صلاحيته (عادة 5-10 دقائق)
- للحساب التجريبي، استخدم الرمز `123456` فقط

## الدعم

للمزيد من المعلومات، راجع:
- [توثيق OTP.dev](https://docs.otp.dev)
- [API Reference](https://docs.otp.dev/api-reference)