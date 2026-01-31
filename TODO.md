# 📝 قائمة المهام - Athar Project

## 🔴 أولوية عالية (يجب إنجازها فوراً)

### 1. إعداد AWS S3 ⏰ 30 دقيقة

**الخطوات:**

```bash
1. إنشاء حساب AWS (إذا لم يكن لديك)
   - اذهب إلى https://aws.amazon.com
   - اضغط "Create an AWS Account"
   - أكمل التسجيل

2. إنشاء S3 Bucket
   - اذهب إلى S3 Console
   - اضغط "Create bucket"
   - Bucket name: athar-media
   - Region: us-east-1
   - Uncheck "Block all public access"
   - اضغط "Create bucket"

3. إعداد CORS Policy
   - افتح الـ Bucket
   - اذهب إلى "Permissions" tab
   - اضغط "CORS configuration"
   - الصق هذا الكود:
```

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": ["ETag"]
  }
]
```

```bash
4. إنشاء IAM User
   - اذهب إلى IAM Console
   - اضغط "Users" > "Add user"
   - User name: athar-s3-user
   - Access type: Programmatic access
   - Permissions: AmazonS3FullAccess
   - احفظ Access Key ID و Secret Access Key

5. تحديث .env.local
   EXPO_PUBLIC_AWS_REGION=us-east-1
   EXPO_PUBLIC_AWS_BUCKET_NAME=athar-media
   EXPO_PUBLIC_AWS_ACCESS_KEY_ID=AKIAXXXXXXXXXXXXXXXX
   EXPO_PUBLIC_AWS_SECRET_ACCESS_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**التحقق:**
- جرب رفع صورة من التطبيق
- تأكد من ظهور الصورة في S3 Bucket

---

### 2. إعداد OTP.dev ⏰ 15 دقيقة

**الخطوات:**

```bash
1. إنشاء حساب OTP.dev
   - اذهب إلى https://otp.dev
   - اضغط "Sign Up"
   - أكمل التسجيل

2. إنشاء Application
   - من Dashboard، اضغط "Create Application"
   - App Name: Athar
   - احفظ:
     * App ID
     * Client ID
     * Client Secret

3. تحديث backend/.env
   OTP_DEV_APP_ID=app_xxxxxxxxxxxxxxxx
   OTP_DEV_CLIENT_ID=client_xxxxxxxxxxxxxxxx
   OTP_DEV_CLIENT_SECRET=secret_xxxxxxxxxxxxxxxx
   OTP_DEV_API_URL=https://api.otp.dev/v1

4. إعادة تشغيل الباكاند
   cd backend
   npm run dev
```

**التحقق:**
- جرب التسجيل من التطبيق
- تأكد من وصول SMS

---

### 3. Deploy الباكاند ⏰ 1-2 ساعة

**الخيار 1: Heroku (الأسهل)**

```bash
1. إنشاء حساب Heroku
   - اذهب إلى https://heroku.com
   - اضغط "Sign Up"

2. تثبيت Heroku CLI
   npm install -g heroku

3. Login
   heroku login

4. إنشاء App
   cd backend
   heroku create athar-backend

5. إضافة MySQL Database
   heroku addons:create jawsdb:kitefin

6. إعداد Environment Variables
   heroku config:set JWT_SECRET=your_secret_here
   heroku config:set OTP_DEV_APP_ID=your_app_id
   heroku config:set OTP_DEV_CLIENT_ID=your_client_id
   heroku config:set OTP_DEV_CLIENT_SECRET=your_client_secret

7. Deploy
   git init
   git add .
   git commit -m "Initial commit"
   git push heroku main

8. تشغيل Database Migration
   heroku run npm run init-db

9. احفظ الـ URL
   https://athar-backend.herokuapp.com
```

**الخيار 2: DigitalOcean (أفضل للإنتاج)**

```bash
1. إنشاء Droplet
   - اذهب إلى DigitalOcean
   - اضغط "Create" > "Droplets"
   - اختر Ubuntu 22.04
   - اختر Plan ($6/month)

2. SSH إلى السيرفر
   ssh root@your_server_ip

3. تثبيت Node.js و MySQL
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   sudo apt-get install mysql-server

4. رفع الكود
   git clone your_repo_url
   cd backend
   npm install

5. إعداد .env
   nano .env
   # الصق المعلومات

6. تشغيل بـ PM2
   npm install -g pm2
   pm2 start src/server.js --name athar-backend
   pm2 startup
   pm2 save

7. إعداد Nginx (اختياري)
   sudo apt-get install nginx
   # إعداد reverse proxy
```

**بعد Deploy:**

```bash
1. تحديث .env.local في التطبيق
   EXPO_PUBLIC_API_URL=https://your-backend-url.com/api

2. تحديث dashboard/.env
   VITE_API_URL=https://your-backend-url.com/api

3. اختبار الـ API
   curl https://your-backend-url.com/api/health
```

---

### 4. إضافة App Icon و Splash Screen ⏰ 30 دقيقة

**الخطوات:**

```bash
1. تصميم App Icon
   - الحجم: 1024x1024 px
   - Format: PNG
   - بدون شفافية
   - احفظه كـ: assets/images/icon.png

2. تصميم Splash Screen
   - الحجم: 1242x2436 px (iPhone 11 Pro Max)
   - Format: PNG
   - يمكن أن يكون شفاف
   - احفظه كـ: assets/images/splash.png

3. تحديث app.json
```

```json
{
  "expo": {
    "name": "أثر",
    "slug": "athar",
    "icon": "./assets/images/icon.png",
    "splash": {
      "image": "./assets/images/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#FAF8F5"
    },
    "ios": {
      "bundleIdentifier": "com.yourcompany.athar",
      "buildNumber": "1.0.0"
    },
    "android": {
      "package": "com.yourcompany.athar",
      "versionCode": 1,
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/adaptive-icon.png",
        "backgroundColor": "#FAF8F5"
      }
    }
  }
}
```

```bash
4. إنشاء Adaptive Icon للأندرويد
   - الحجم: 1024x1024 px
   - احفظه كـ: assets/images/adaptive-icon.png

5. اختبار
   expo start
   # افتح التطبيق وتأكد من ظهور الأيقونة
```

---

## 🟡 أولوية متوسطة (مهمة)

### 5. إكمال Admin Dashboard ⏰ 4-6 ساعات

**المطلوب:**

#### أ. إكمال Views

```bash
# ملفات يجب إنشاؤها:

dashboard/src/views/DashboardHome.vue
dashboard/src/views/UsersView.vue
dashboard/src/views/PostsView.vue
dashboard/src/views/CommentsView.vue
dashboard/src/views/NotificationsView.vue
dashboard/src/views/SettingsView.vue
```

#### ب. إكمال Components

```bash
# ملفات يجب إنشاؤها:

dashboard/src/components/StatsCard.vue
dashboard/src/components/UserTable.vue
dashboard/src/components/PostTable.vue
dashboard/src/components/CommentTable.vue
dashboard/src/components/Chart.vue
dashboard/src/components/Sidebar.vue
dashboard/src/components/Navbar.vue
```

#### ج. إكمال Layouts

```bash
# ملفات يجب إنشاؤها:

dashboard/src/layouts/DashboardLayout.vue
```

---

### 6. إضافة Admin Endpoints ⏰ 2-3 ساعات

**المطلوب:**

```javascript
// backend/src/routes/admin.js

// Stats
GET /api/admin/stats
Response: {
  totalUsers: 150,
  totalPosts: 450,
  totalComments: 1200,
  totalLikes: 3500,
  newUsersToday: 5,
  newPostsToday: 12
}

// Users Management
GET /api/admin/users?page=1&limit=20&search=
GET /api/admin/users/:id
PUT /api/admin/users/:id/ban
PUT /api/admin/users/:id/unban
DELETE /api/admin/users/:id

// Posts Management
GET /api/admin/posts?page=1&limit=20&type=&category=
GET /api/admin/posts/:id
DELETE /api/admin/posts/:id
PUT /api/admin/posts/:id/archive

// Comments Management
GET /api/admin/comments?page=1&limit=20
DELETE /api/admin/comments/:id

// Notifications
POST /api/admin/notifications/send
Body: {
  userIds: [1, 2, 3], // أو "all" لإرسال للجميع
  title: "عنوان الإشعار",
  body: "محتوى الإشعار",
  data: { type: "announcement" }
}

// Reports
GET /api/admin/reports
POST /api/admin/reports/:id/resolve
```

**الخطوات:**

```bash
1. إنشاء ملف admin.js في routes
2. إنشاء adminController.js في controllers
3. إضافة middleware للتحقق من Admin
4. تسجيل الـ routes في server.js
```

---

### 7. Testing ⏰ 2-3 ساعات

**قائمة الاختبارات:**

```bash
✅ Authentication
  - تسجيل حساب جديد
  - تسجيل دخول
  - تسجيل خروج
  - OTP flow

✅ Posts
  - إنشاء منشور نصي
  - إنشاء منشور بصورة
  - إنشاء منشور بفيديو
  - إنشاء منشور برابط
  - تعديل منشور
  - حذف منشور
  - أرشفة منشور

✅ Interactions
  - إعجاب بمنشور
  - إلغاء إعجاب
  - إضافة تعليق
  - حذف تعليق
  - إضافة للمفضلة
  - إزالة من المفضلة

✅ Users
  - عرض ملف مستخدم آخر
  - متابعة مستخدم
  - إلغاء متابعة
  - تحديث الملف الشخصي
  - رفع صورة البروفايل

✅ Notifications
  - استلام إشعار
  - تعليم كمقروء
  - الضغط على إشعار

✅ Search
  - البحث عن منشورات
  - البحث عن مستخدمين
  - البحث المتقدم

✅ Admin Dashboard
  - تسجيل دخول Admin
  - عرض الإحصائيات
  - إدارة المستخدمين
  - إدارة المنشورات
  - إرسال إشعارات
```

---

## 🟢 أولوية منخفضة (اختيارية)

### 8. تحسينات الأداء ⏰ 3-4 ساعات

```bash
✅ Image Optimization
  - ضغط الصور قبل الرفع
  - استخدام WebP format
  - Lazy Loading للصور

✅ Caching
  - Cache للمنشورات
  - Cache للمستخدمين
  - Cache للإحصائيات

✅ Code Splitting
  - Lazy load للشاشات
  - Dynamic imports

✅ Database Optimization
  - إضافة Indexes
  - Query Optimization
  - Connection Pooling
```

---

### 9. Analytics & Monitoring ⏰ 2-3 ساعات

```bash
✅ Firebase Analytics
  - تتبع الأحداث
  - تتبع الشاشات
  - تتبع المستخدمين

✅ Sentry (Error Tracking)
  - تتبع الأخطاء
  - تتبع Performance
  - Crash Reports

✅ Performance Monitoring
  - API Response Time
  - App Load Time
  - Screen Render Time
```

---

### 10. Additional Features ⏰ 5-10 ساعات

```bash
✅ Deep Linking
  - فتح منشور من رابط
  - فتح بروفايل من رابط
  - Share functionality

✅ Localization
  - دعم اللغة الإنجليزية
  - i18n setup

✅ Dark Mode
  - تحسين Dark Mode
  - حفظ التفضيل

✅ Offline Mode
  - Cache البيانات
  - Queue للعمليات
  - Sync عند الاتصال
```

---

## 📊 تقدير الوقت الإجمالي

| المهمة | الوقت المقدر |
|--------|--------------|
| AWS S3 Setup | 30 دقيقة |
| OTP.dev Setup | 15 دقيقة |
| Backend Deploy | 1-2 ساعة |
| App Icon & Splash | 30 دقيقة |
| Admin Dashboard | 4-6 ساعات |
| Admin Endpoints | 2-3 ساعات |
| Testing | 2-3 ساعات |
| **المجموع (الأساسي)** | **10-15 ساعة** |
| Performance | 3-4 ساعات |
| Analytics | 2-3 ساعات |
| Additional Features | 5-10 ساعات |
| **المجموع (الكامل)** | **20-32 ساعة** |

---

## ✅ Checklist

### قبل الإطلاق:

- [ ] AWS S3 معد ويعمل
- [ ] OTP.dev معد ويعمل
- [ ] الباكاند deployed ويعمل
- [ ] App Icon و Splash Screen مضافين
- [ ] جميع الـ endpoints تعمل
- [ ] Admin Dashboard يعمل
- [ ] Testing مكتمل
- [ ] Documentation محدث
- [ ] .env files محدثة
- [ ] Database backup معد

### بعد الإطلاق:

- [ ] Monitoring معد
- [ ] Analytics معد
- [ ] Error Tracking معد
- [ ] Performance Optimization
- [ ] User Feedback
- [ ] Bug Fixes

---

## 📞 الدعم

إذا واجهت أي مشكلة:
1. راجع README.md
2. راجع API_DOCUMENTATION.md
3. افتح Issue في GitHub
4. راسلني

---

**ملاحظة:** هذه القائمة قابلة للتحديث. راجعها بانتظام! 📝