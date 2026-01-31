# Athar Backend API

Backend API لتطبيق أثر - منصة مشاركة الأفكار

## 🚀 التقنيات المستخدمة

- **Node.js** - JavaScript Runtime
- **Express.js** - Web Framework
- **MySQL** - Database
- **JWT** - Authentication
- **bcryptjs** - Password Hashing

## 📋 المتطلبات

- Node.js (v14 أو أحدث)
- MySQL (v5.7 أو أحدث)
- npm أو yarn

## ⚙️ التثبيت والإعداد

### 1. تثبيت المكتبات

```bash
cd backend
npm install
```

### 2. إعداد قاعدة البيانات

أولاً، قم بإنشاء قاعدة بيانات MySQL:

```sql
CREATE DATABASE athar_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. إعداد ملف البيئة

انسخ ملف `.env.example` إلى `.env`:

```bash
cp .env.example .env
```

ثم قم بتعديل القيم في ملف `.env`:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password_here
DB_NAME=athar_db
DB_PORT=3306

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

# CORS Configuration
FRONTEND_URL=http://localhost:8081
```

### 4. تهيئة قاعدة البيانات

قم بتشغيل السكريبت لإنشاء الجداول:

```bash
npm run init-db
```

### 5. تشغيل السيرفر

للتطوير (مع auto-reload):
```bash
npm run dev
```

للإنتاج:
```bash
npm start
```

السيرفر سيعمل على: `http://localhost:3000`

## 📚 API Endpoints

### Authentication

#### تسجيل مستخدم جديد
```http
POST /api/auth/register
Content-Type: application/json

{
  "phone": "07XXXXXXXXX",
  "name": "اسم المستخدم",
  "email": "user@example.com",
  "password": "password123"
}
```

#### تسجيل الدخول
```http
POST /api/auth/login
Content-Type: application/json

{
  "phone": "07XXXXXXXXX",
  "password": "password123"
}
```

#### الحصول على بيانات المستخدم الحالي
```http
GET /api/auth/me
Authorization: Bearer {token}
```

#### تحديث كلمة المرور
```http
PUT /api/auth/password
Authorization: Bearer {token}
Content-Type: application/json

{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword"
}
```

### Users

#### الحصول على ملف مستخدم
```http
GET /api/users/:id
Authorization: Bearer {token} (optional)
```

#### تحديث الملف الشخصي
```http
PUT /api/users/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "الاسم الجديد",
  "email": "newemail@example.com",
  "bio": "نبذة عني"
}
```

#### متابعة مستخدم
```http
POST /api/users/:id/follow
Authorization: Bearer {token}
```

#### إلغاء متابعة مستخدم
```http
DELETE /api/users/:id/follow
Authorization: Bearer {token}
```

#### الحصول على المتابعين
```http
GET /api/users/:id/followers?page=1&limit=20
```

#### الحصول على المتابَعين
```http
GET /api/users/:id/following?page=1&limit=20
```

#### البحث عن مستخدمين
```http
GET /api/users/search?q=keyword&page=1&limit=20
```

### Posts

#### الحصول على جميع المنشورات
```http
GET /api/posts?page=1&limit=20&category=tech&type=text
Authorization: Bearer {token} (optional)
```

#### الحصول على منشور واحد
```http
GET /api/posts/:id
Authorization: Bearer {token} (optional)
```

#### الحصول على منشورات مستخدم
```http
GET /api/posts/user/:userId?page=1&limit=20
Authorization: Bearer {token} (optional)
```

#### إنشاء منشور
```http
POST /api/posts
Authorization: Bearer {token}
Content-Type: application/json

{
  "type": "text",
  "title": "عنوان المنشور",
  "content": "محتوى المنشور",
  "category": "tech"
}
```

#### تحديث منشور
```http
PUT /api/posts/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "العنوان المحدث",
  "content": "المحتوى المحدث",
  "category": "tech"
}
```

#### حذف منشور
```http
DELETE /api/posts/:id
Authorization: Bearer {token}
```

#### أرشفة منشور
```http
POST /api/posts/:id/archive
Authorization: Bearer {token}
```

#### البحث في المنشورات
```http
GET /api/posts/search?q=keyword&page=1&limit=20
Authorization: Bearer {token} (optional)
```

### Comments

#### الحصول على تعليقات منشور
```http
GET /api/comments/post/:postId?page=1&limit=20
```

#### الحصول على ردود تعليق
```http
GET /api/comments/:commentId/replies?page=1&limit=10
```

#### إضافة تعليق
```http
POST /api/comments
Authorization: Bearer {token}
Content-Type: application/json

{
  "post_id": 1,
  "content": "محتوى التعليق",
  "parent_id": null
}
```

#### تحديث تعليق
```http
PUT /api/comments/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "content": "المحتوى المحدث"
}
```

#### حذف تعليق
```http
DELETE /api/comments/:id
Authorization: Bearer {token}
```

### Likes

#### إعجاب/إلغاء إعجاب بمنشور
```http
POST /api/likes/:postId
Authorization: Bearer {token}
```

#### الحصول على قائمة الإعجابات
```http
GET /api/likes/:postId?page=1&limit=20
```

### Favorites

#### إضافة/إزالة من المفضلة
```http
POST /api/favorites/:postId
Authorization: Bearer {token}
```

#### الحصول على المفضلة
```http
GET /api/favorites?page=1&limit=20
Authorization: Bearer {token}
```

### Notifications

#### الحصول على الإشعارات
```http
GET /api/notifications?page=1&limit=20
Authorization: Bearer {token}
```

#### تحديد إشعار كمقروء
```http
PUT /api/notifications/:id/read
Authorization: Bearer {token}
```

#### تحديد جميع الإشعارات كمقروءة
```http
PUT /api/notifications/read-all
Authorization: Bearer {token}
```

#### حذف إشعار
```http
DELETE /api/notifications/:id
Authorization: Bearer {token}
```

## 🗄️ هيكل قاعدة البيانات

### الجداول الرئيسية:

- **users** - بيانات المستخدمين
- **posts** - المنشورات
- **comments** - التعليقات
- **likes** - الإعجابات
- **favorites** - المفضلة
- **follows** - المتابعات
- **notifications** - الإشعارات

## 🔒 الأمان

- تشفير كلمات المرور باستخدام bcrypt
- JWT للمصادقة
- Rate limiting للحماية من الهجمات
- Input validation باستخدام express-validator
- Helmet للحماية من الثغرات الشائعة
- CORS configuration

## 📝 ملاحظات

### أرقام الهواتف العراقية
يجب أن تكون أرقام الهواتف بالصيغة: `07XXXXXXXXX` (11 رقم تبدأ بـ 07)

### Pagination
جميع الـ endpoints التي تعيد قوائم تدعم pagination:
- `page`: رقم الصفحة (افتراضي: 1)
- `limit`: عدد العناصر في الصفحة (افتراضي: 20)

### Response Format
جميع الـ responses تتبع هذا الشكل:

```json
{
  "success": true,
  "message": "رسالة نجاح",
  "data": {},
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
```

في حالة الخطأ:

```json
{
  "success": false,
  "message": "رسالة الخطأ",
  "errors": []
}
```

## 🚀 الاستضافة

### خيارات الاستضافة الموصى بها:

1. **DigitalOcean** - VPS
2. **AWS EC2** - Cloud Server
3. **Heroku** - Platform as a Service
4. **Railway** - Modern Platform

### خطوات الاستضافة:

1. رفع الكود على GitHub
2. إنشاء سيرفر على المنصة المختارة
3. تثبيت Node.js و MySQL
4. استنساخ المشروع
5. تثبيت المكتبات: `npm install`
6. إعداد ملف `.env`
7. تهيئة قاعدة البيانات: `npm run init-db`
8. تشغيل السيرفر: `npm start`

## 🐛 استكشاف الأخطاء

### خطأ في الاتصال بقاعدة البيانات
- تأكد من تشغيل MySQL
- تحقق من بيانات الاتصال في `.env`
- تأكد من وجود قاعدة البيانات

### خطأ في JWT
- تأكد من وجود `JWT_SECRET` في `.env`
- تحقق من صلاحية الـ token

### خطأ في Port
- تأكد من أن المنفذ 3000 غير مستخدم
- أو غير المنفذ في `.env`

## 📞 الدعم

للمساعدة أو الاستفسارات، يرجى فتح issue على GitHub.

## 📄 الترخيص

ISC License