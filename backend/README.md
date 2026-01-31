# Athar Backend API

Backend API لتطبيق أثر - منصة مشاركة الأفكار

## 📋 المحتويات

- [المتطلبات](#المتطلبات)
- [التثبيت](#التثبيت)
- [الإعداد](#الإعداد)
- [تشغيل المشروع](#تشغيل-المشروع)
- [API Endpoints](#api-endpoints)
- [OTP.dev Integration](#otpdev-integration)
- [AWS S3 Integration](#aws-s3-integration)
- [Push Notifications](#push-notifications)

## 🔧 المتطلبات

- Node.js (v14 أو أحدث)
- MySQL (v5.7 أو أحدث)
- npm أو yarn

## 📦 التثبيت

```bash
cd backend
npm install
```

## ⚙️ الإعداد

### 1. إنشاء ملف .env

انسخ ملف `.env.example` إلى `.env`:

```bash
cp .env.example .env
```

### 2. تعديل ملف .env

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=athar_db
DB_PORT=3306

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

# CORS Configuration
FRONTEND_URL=http://localhost:8081

# File Upload Configuration
MAX_FILE_SIZE=104857600
UPLOAD_PATH=./uploads

# OTP.dev Configuration
OTP_DEV_APP_ID=your_otp_dev_app_id_here
OTP_DEV_CLIENT_ID=your_otp_dev_client_id_here
OTP_DEV_CLIENT_SECRET=your_otp_dev_client_secret_here
OTP_DEV_API_URL=https://api.otp.dev/v1

# AWS S3 Configuration (Optional)
AWS_REGION=us-east-1
AWS_BUCKET_NAME=athar-media
AWS_ACCESS_KEY_ID=your_aws_access_key_id_here
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key_here
```

### 3. إنشاء قاعدة البيانات

```bash
npm run init-db
```

## 🚀 تشغيل المشروع

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

السيرفر سيعمل على: `http://localhost:3000`

## 📡 API Endpoints

### Authentication

#### إرسال OTP للتسجيل
```http
POST /api/auth/send-registration-otp
Content-Type: application/json

{
  "phone": "07XXXXXXXXX"
}
```

#### التسجيل مع OTP
```http
POST /api/auth/register
Content-Type: application/json

{
  "phone": "07XXXXXXXXX",
  "name": "اسم المستخدم",
  "email": "user@example.com",
  "password": "password123",
  "orderId": "order_id_from_send_otp",
  "code": "123456"
}
```

#### إرسال OTP لتسجيل الدخول
```http
POST /api/auth/send-login-otp
Content-Type: application/json

{
  "phone": "07XXXXXXXXX"
}
```

#### تسجيل الدخول مع OTP
```http
POST /api/auth/login-otp
Content-Type: application/json

{
  "phone": "07XXXXXXXXX",
  "orderId": "order_id_from_send_otp",
  "code": "123456"
}
```

#### تسجيل الدخول بكلمة المرور (التقليدي)
```http
POST /api/auth/login
Content-Type: application/json

{
  "phone": "07XXXXXXXXX",
  "password": "password123"
}
```

#### حفظ Push Token
```http
POST /api/auth/push-token
Authorization: Bearer {token}
Content-Type: application/json

{
  "pushToken": "ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]"
}
```

### Posts

#### إنشاء منشور
```http
POST /api/posts
Authorization: Bearer {token}
Content-Type: application/json

{
  "type": "image",
  "title": "عنوان المنشور",
  "content": "محتوى المنشور",
  "media_url": "https://bucket.s3.region.amazonaws.com/posts/image.jpg",
  "category": "تقنية"
}
```

#### الحصول على المنشورات
```http
GET /api/posts?page=1&limit=20&category=تقنية&type=image
```

### Users

#### تحديث الملف الشخصي
```http
PUT /api/users/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "اسم جديد",
  "bio": "نبذة عني",
  "profile_image": "https://bucket.s3.region.amazonaws.com/profiles/image.jpg"
}
```

## 🔐 OTP.dev Integration

### إعداد OTP.dev

1. **إنشاء حساب في OTP.dev**
   - اذهب إلى [https://otp.dev](https://otp.dev)
   - أنشئ حساب جديد

2. **إنشاء Application**
   - من Dashboard، اضغط على "Create Application"
   - احفظ:
     - App ID
     - Client ID
     - Client Secret

3. **إضافة المعلومات في .env**
   ```env
   OTP_DEV_APP_ID=your_app_id
   OTP_DEV_CLIENT_ID=your_client_id
   OTP_DEV_CLIENT_SECRET=your_client_secret
   ```

### كيفية عمل OTP

1. **إرسال OTP**
   - المستخدم يدخل رقم هاتفه
   - الباكاند يرسل طلب لـ OTP.dev
   - OTP.dev يرسل SMS للمستخدم
   - الباكاند يرجع `orderId`

2. **التحقق من OTP**
   - المستخدم يدخل الرمز
   - الباكاند يرسل `orderId` و `code` لـ OTP.dev
   - OTP.dev يتحقق من الرمز
   - إذا صحيح، يتم إنشاء الحساب أو تسجيل الدخول

### تنسيق رقم الهاتف

- **الإدخال**: `07XXXXXXXXX` (عراقي)
- **التحويل**: `+9647XXXXXXXXX` (دولي)
- الباكاند يحول الرقم تلقائياً

## ☁️ AWS S3 Integration

### ملاحظة مهمة

الباكاند **لا يرفع** الملفات مباشرة. الفرونت اند يرفع الملفات مباشرة لـ S3 ويرسل الرابط للباكاند.

### لماذا هذه الطريقة؟

- ✅ أسرع (الملف لا يمر عبر الباكاند)
- ✅ أقل حمل على السيرفر
- ✅ أرخص (bandwidth أقل)
- ✅ أكثر أماناً

### Flow

1. **الفرونت اند** يرفع الصورة/الفيديو لـ S3
2. **S3** يرجع رابط الملف
3. **الفرونت اند** يرسل الرابط للباكاند
4. **الباكاند** يحفظ الرابط في قاعدة البيانات

## 🔔 Push Notifications

### حفظ Push Token

عند تسجيل الدخول، الفرونت اند يرسل Push Token:

```javascript
const token = await getPushToken();
await api.savePushToken(token);
```

### إرسال إشعار (من الباكاند)

```javascript
// في المستقبل، يمكن إضافة خدمة لإرسال Push Notifications
// باستخدام Expo Push Notification Service
```

## 📊 Database Schema

### users
- id, phone, name, email, password
- bio, profile_image, push_token
- is_verified, role
- created_at, updated_at

### posts
- id, user_id, type, title, content
- media_url, link_url, category
- is_archived, views_count
- created_at, updated_at

### comments
- id, post_id, user_id, content
- parent_id (للردود)
- created_at, updated_at

### likes
- id, post_id, user_id
- created_at

### favorites
- id, post_id, user_id
- created_at

### follows
- id, follower_id, followed_id
- created_at

### notifications
- id, user_id, type, content
- related_id, is_read
- created_at

## 🛠️ Scripts

```bash
# تشغيل السيرفر (development)
npm run dev

# تشغيل السيرفر (production)
npm start

# إنشاء قاعدة البيانات
npm run init-db
```

## 📝 Notes

### أرقام الهواتف العراقية

- التنسيق: `07[3-9]XXXXXXXX`
- أمثلة صحيحة:
  - `07701234567`
  - `07801234567`
  - `07901234567`

### أنواع المنشورات

- `text`: منشور نصي
- `image`: منشور بصورة
- `video`: منشور بفيديو
- `link`: منشور برابط

### أنواع الإشعارات

- `like`: إعجاب بمنشور
- `comment`: تعليق على منشور
- `follow`: متابعة جديدة
- `mention`: إشارة في تعليق

## 🔒 Security

- ✅ JWT Authentication
- ✅ Password Hashing (bcrypt)
- ✅ Input Validation
- ✅ Rate Limiting
- ✅ CORS Protection
- ✅ Helmet Security Headers
- ✅ SQL Injection Protection

## 📞 Support

للمساعدة أو الاستفسارات، يرجى فتح Issue في GitHub.

## 📄 License

ISC