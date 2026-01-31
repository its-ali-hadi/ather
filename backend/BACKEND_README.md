# 🚀 Athar Backend API

Backend API لتطبيق أثر - منصة لمشاركة الأفكار والمحتوى

---

## 📋 المتطلبات

- Node.js v16 أو أحدث
- MySQL 8.0 أو أحدث
- npm أو yarn

---

## 🔧 التثبيت

### 1. تثبيت المكتبات
```bash
cd backend
npm install
```

### 2. إعداد ملف .env
انسخ ملف `.env.example` إلى `.env` وعدل القيم:

```bash
cp .env.example .env
```

### 3. إنشاء قاعدة البيانات
```bash
# افتح MySQL
mysql -u root -p

# أنشئ قاعدة البيانات
CREATE DATABASE athar_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

### 4. تشغيل سكريبتات إنشاء الجداول
```bash
npm run init-db
npm run add-ban-fields
```

---

## 🚀 التشغيل

### Development Mode (مع auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

السيرفر راح يشتغل على: `http://localhost:3000`

---

## 📚 API Endpoints

### Authentication
- `POST /api/auth/send-registration-otp` - إرسال OTP للتسجيل
- `POST /api/auth/send-login-otp` - إرسال OTP لتسجيل الدخول
- `POST /api/auth/register` - تسجيل مستخدم جديد
- `POST /api/auth/login` - تسجيل الدخول بكلمة المرور
- `POST /api/auth/login-otp` - تسجيل الدخول بـ OTP
- `GET /api/auth/me` - الحصول على بيانات المستخدم الحالي
- `PUT /api/auth/password` - تحديث كلمة المرور
- `POST /api/auth/push-token` - حفظ رمز الإشعارات

### Users
- `GET /api/users/:id` - الحصول على ملف مستخدم
- `PUT /api/users/profile` - تحديث الملف الشخصي
- `POST /api/users/:id/follow` - متابعة مستخدم
- `DELETE /api/users/:id/follow` - إلغاء المتابعة
- `GET /api/users/:id/followers` - قائمة المتابعين
- `GET /api/users/:id/following` - قائمة المتابَعين
- `GET /api/users/search` - البحث عن مستخدمين

### Posts
- `GET /api/posts` - قائمة المنشورات
- `GET /api/posts/:id` - تفاصيل منشور
- `GET /api/posts/user/:id` - منشورات مستخدم
- `POST /api/posts` - إنشاء منشور
- `PUT /api/posts/:id` - تحديث منشور
- `DELETE /api/posts/:id` - حذف منشور
- `POST /api/posts/:id/archive` - أرشفة منشور
- `GET /api/posts/search` - البحث في المنشورات

### Comments
- `GET /api/comments/post/:id` - تعليقات منشور
- `GET /api/comments/:id/replies` - ردود على تعليق
- `POST /api/comments` - إضافة تعليق
- `PUT /api/comments/:id` - تحديث تعليق
- `DELETE /api/comments/:id` - حذف تعليق

### Likes
- `POST /api/likes/:postId` - إعجاب/إلغاء إعجاب
- `GET /api/likes/:postId` - قائمة المعجبين

### Favorites
- `POST /api/favorites/:postId` - إضافة/إزالة من المفضلة
- `GET /api/favorites` - قائمة المفضلة

### Notifications
- `GET /api/notifications` - قائمة الإشعارات
- `PUT /api/notifications/:id/read` - تعليم كمقروء
- `PUT /api/notifications/read-all` - تعليم الكل كمقروء
- `DELETE /api/notifications/:id` - حذف إشعار

### Admin (يتطلب صلاحيات أدمن)
- `GET /api/admin/dashboard` - إحصائيات لوحة التحكم
- `GET /api/admin/users` - قائمة جميع المستخدمين
- `GET /api/admin/users/:id` - تفاصيل مستخدم
- `PUT /api/admin/users/:id/verify` - توثيق مستخدم
- `PUT /api/admin/users/:id/role` - تغيير دور مستخدم
- `DELETE /api/admin/users/:id` - حذف مستخدم
- `PUT /api/admin/users/:id/ban` - حظر مستخدم
- `PUT /api/admin/users/:id/unban` - إلغاء حظر مستخدم
- `GET /api/admin/posts` - قائمة جميع المنشورات
- `DELETE /api/admin/posts/:id` - حذف منشور
- `PUT /api/admin/posts/:id/feature` - تمييز منشور

---

## 🔐 المصادقة

جميع الـ endpoints المحمية تتطلب JWT token في الـ header:

```
Authorization: Bearer <token>
```

---

## 📊 قاعدة البيانات

### الجداول الرئيسية:

1. **users** - بيانات المستخدمين
2. **posts** - المنشورات
3. **comments** - التعليقات
4. **likes** - الإعجابات
5. **favorites** - المفضلة
6. **follows** - المتابعات
7. **notifications** - الإشعارات

---

## 🔧 متغيرات البيئة

```env
# Server
PORT=3000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=athar_db
DB_PORT=3306

# JWT
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d

# CORS
FRONTEND_URL=http://localhost:8081

# OTP.dev
OTP_DEV_APP_ID=your_app_id
OTP_DEV_CLIENT_ID=your_client_id
OTP_DEV_CLIENT_SECRET=your_client_secret
OTP_DEV_API_URL=https://api.otp.dev/v1

# AWS S3 (Optional)
AWS_REGION=us-east-1
AWS_BUCKET_NAME=your_bucket
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
```

---

## 🧪 اختبار الـ API

### باستخدام curl:

```bash
# Health check
curl http://localhost:3000/health

# إرسال OTP للتسجيل
curl -X POST http://localhost:3000/api/auth/send-registration-otp \
  -H "Content-Type: application/json" \
  -d '{"phone":"07XXXXXXXXX"}'

# تسجيل مستخدم جديد
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "phone":"07XXXXXXXXX",
    "name":"اسم المستخدم",
    "password":"password123",
    "orderId":"order_id_from_otp",
    "code":"123456"
  }'
```

### باستخدام Postman:
1. استورد الـ collection من `API_DOCUMENTATION.md`
2. اضبط الـ environment variables
3. ابدأ الاختبار

---

## 🐛 حل المشاكل

### مشكلة: Cannot connect to database
```bash
# تأكد من تشغيل MySQL
sudo systemctl start mysql  # Linux
brew services start mysql    # macOS

# تأكد من صحة معلومات الاتصال في .env
```

### مشكلة: Port already in use
```bash
# غير الـ PORT في .env
# أو أوقف العملية المستخدمة للـ port
lsof -ti:3000 | xargs kill -9
```

### مشكلة: OTP not sending
- تأكد من صحة OTP.dev credentials
- تأكد من وجود رصيد في حسابك
- تأكد من صيغة رقم الهاتف الدولية

---

## 📝 ملاحظات

1. **الأمان**: غير `JWT_SECRET` في production
2. **CORS**: اضبط `FRONTEND_URL` للـ production domain
3. **Rate Limiting**: أضف rate limiting في production
4. **Logging**: استخدم logging service في production
5. **Monitoring**: راقب الأداء والأخطاء

---

## 🚀 Deploy

### Heroku
```bash
heroku create athar-api
heroku addons:create cleardb:ignite
heroku config:set JWT_SECRET=your_secret
git push heroku main
```

### DigitalOcean
1. أنشئ Droplet
2. ثبت Node.js و MySQL
3. انسخ الكود
4. اضبط nginx كـ reverse proxy
5. استخدم PM2 لإدارة العملية

---

## 📞 الدعم

للمشاكل والاستفسارات، راجع:
- `API_DOCUMENTATION.md` للتوثيق الكامل
- `../SETUP_INSTRUCTIONS.md` لتعليمات الإعداد

---

**تم بحمد الله! 🎉**