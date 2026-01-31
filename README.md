# 🌟 Athar - منصة مشاركة الأفكار

تطبيق موبايل متكامل لمشاركة الأفكار والمحتوى مع لوحة تحكم إدارية.

## 📋 المحتويات

- [نظرة عامة](#نظرة-عامة)
- [المميزات](#المميزات)
- [التقنيات المستخدمة](#التقنيات-المستخدمة)
- [البنية](#البنية)
- [التثبيت والإعداد](#التثبيت-والإعداد)
- [ما تم إنجازه](#ما-تم-إنجازه)
- [ما يجب عليك فعله](#ما-يجب-عليك-فعله)

---

## 🎯 نظرة عامة

**أثر** هو تطبيق موبايل (React Native + Expo) مع لوحة تحكم إدارية (Vue 3 + Vite) وباكاند (Node.js + Express + MySQL).

---

## ✨ المميزات

### تطبيق الموبايل:
- ✅ تسجيل ودخول بـ OTP (OTP.dev)
- ✅ إنشاء منشورات (نص، صورة، فيديو، رابط)
- ✅ رفع الصور والفيديوهات لـ AWS S3
- ✅ الإعجاب والتعليق على المنشورات
- ✅ المفضلة والأرشيف
- ✅ متابعة المستخدمين
- ✅ الإشعارات (Expo Notifications)
- ✅ البحث المتقدم
- ✅ الملف الشخصي

### لوحة التحكم:
- ✅ إحصائيات شاملة
- ✅ إدارة المستخدمين
- ✅ إدارة المنشورات
- ✅ إدارة التعليقات
- ✅ إرسال إشعارات
- ✅ الإعدادات

---

## 🛠️ التقنيات المستخدمة

### Frontend (Mobile):
- React Native + Expo
- TypeScript
- React Navigation
- Expo Image Picker
- Expo Notifications
- AWS SDK (S3)
- AsyncStorage

### Frontend (Dashboard):
- Vue 3 + Vite
- TypeScript
- Vue Router
- Pinia (State Management)
- Tailwind CSS
- Chart.js
- Axios

### Backend:
- Node.js + Express
- MySQL
- JWT Authentication
- OTP.dev Integration
- Multer (File Upload)
- bcryptjs (Password Hashing)

---

## 📁 البنية

```
athar/
├── user-app/                 # تطبيق الموبايل (React Native)
│   ├── screens/             # الشاشات
│   ├── components/          # المكونات
│   ├── contexts/            # Context API
│   ├── utils/               # Utilities
│   ├── assets/              # الصور والخطوط
│   └── App.tsx              # نقطة الدخول
│
├── dashboard/               # لوحة التحكم (Vue 3)
│   ├── src/
│   │   ├── views/          # الصفحات
│   │   ├── components/     # المكونات
│   │   ├── stores/         # Pinia Stores
│   │   ├── router/         # Vue Router
│   │   └── main.ts         # نقطة الدخول
│   └── package.json
│
└── backend/                 # الباكاند (Node.js)
    ├── src/
    │   ├── routes/         # API Routes
    │   ├── controllers/    # Controllers
    │   ├── middleware/     # Middleware
    │   ├── config/         # Configuration
    │   └── server.js       # نقطة الدخول
    └── package.json
```

---

## 🚀 التثبيت والإعداد

### 1. متطلبات النظام

- Node.js (v16+)
- MySQL (v5.7+)
- npm أو yarn
- Expo CLI

### 2. تثبيت المشروع

#### أ. الباكاند

```bash
cd backend
npm install

# إنشاء ملف .env
cp .env.example .env

# تعديل .env بمعلوماتك

# إنشاء قاعدة البيانات
npm run init-db

# تشغيل السيرفر
npm run dev
```

#### ب. تطبيق الموبايل

```bash
cd user-app
yarn install

# تعديل .env.local بمعلوماتك

# تشغيل التطبيق
yarn start
```

#### ج. لوحة التحكم

```bash
cd dashboard
npm install

# إنشاء ملف .env
echo "VITE_API_URL=http://localhost:3000/api" > .env

# تشغيل Dashboard
npm run dev
```

---

## ✅ ما تم إنجازه

### Frontend (Mobile):

1. **Authentication System** ✅
   - AuthContext لإدارة حالة المستخدم
   - ربط AuthScreen مع API و OTP.dev
   - حفظ Token في AsyncStorage
   - Auto-login عند فتح التطبيق

2. **AWS S3 Integration** ✅
   - S3 Service للرفع
   - Progress Tracking
   - رفع الصور والفيديوهات
   - ربط مع CreateImagePostScreen و CreateVideoPostScreen

3. **Expo Notifications** ✅
   - Notifications Service
   - طلب الصلاحيات
   - الحصول على Push Token
   - حفظ Token في الباكاند

4. **API Integration** ✅
   - utils/api.ts شامل
   - جميع endpoints جاهزة
   - Error Handling
   - Auth Token Management

5. **Screens** ✅
   - AuthScreen (مع OTP)
   - EditProfileScreen (مع S3)
   - NotificationsScreen
   - جميع الشاشات الأخرى

### Backend:

1. **OTP.dev Integration** ✅
   - config/otp.js
   - Send OTP endpoints
   - Verify OTP endpoints
   - تحويل أرقام الهواتف العراقية

2. **Database** ✅
   - جميع الجداول
   - push_token field
   - Indexes للأداء

3. **API Endpoints** ✅
   - Authentication (مع OTP)
   - Users Management
   - Posts CRUD
   - Comments
   - Likes & Favorites
   - Notifications
   - Push Token

4. **Documentation** ✅
   - README.md شامل
   - API_DOCUMENTATION.md مفصل

### Dashboard (Vue 3):

1. **Project Setup** ✅
   - Vue 3 + Vite
   - TypeScript
   - Tailwind CSS
   - Vue Router
   - Pinia

2. **Authentication** ✅
   - Login Page
   - Auth Store
   - Route Guards

3. **Dashboard Structure** ✅
   - Layout
   - Sidebar
   - Stats Cards
   - Charts

---

## 📝 ما يجب عليك فعله

### 🔴 أولوية عالية (مطلوب):

#### 1. إعداد AWS S3

```bash
# الخطوات:
1. إنشاء حساب AWS
2. إنشاء S3 Bucket باسم "athar-media"
3. إعداد CORS Policy:
   {
     "AllowedHeaders": ["*"],
     "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
     "AllowedOrigins": ["*"],
     "ExposeHeaders": []
   }
4. إنشاء IAM User مع صلاحيات S3
5. حفظ Access Key ID و Secret Access Key
6. إضافة المعلومات في .env.local:
   EXPO_PUBLIC_AWS_REGION=us-east-1
   EXPO_PUBLIC_AWS_BUCKET_NAME=athar-media
   EXPO_PUBLIC_AWS_ACCESS_KEY_ID=your_key_here
   EXPO_PUBLIC_AWS_SECRET_ACCESS_KEY=your_secret_here
```

#### 2. إعداد OTP.dev

```bash
# الخطوات:
1. إنشاء حساب في https://otp.dev
2. إنشاء Application جديد
3. حفظ:
   - App ID
   - Client ID
   - Client Secret
4. إضافة المعلومات في backend/.env:
   OTP_DEV_APP_ID=your_app_id
   OTP_DEV_CLIENT_ID=your_client_id
   OTP_DEV_CLIENT_SECRET=your_client_secret
```

#### 3. Deploy الباكاند

```bash
# خيارات:
1. Heroku (سهل ومجاني للبداية)
2. DigitalOcean (أفضل للإنتاج)
3. AWS EC2 (مرن وقوي)

# بعد Deploy:
1. تحديث EXPO_PUBLIC_API_URL في .env.local
2. تحديث VITE_API_URL في dashboard/.env
```

#### 4. إضافة App Icon و Splash Screen

```bash
# الخطوات:
1. تصميم App Icon (1024x1024)
2. تصميم Splash Screen (1242x2436)
3. وضع الملفات في assets/images/
4. تحديث app.json:
   {
     "expo": {
       "icon": "./assets/images/icon.png",
       "splash": {
         "image": "./assets/images/splash.png"
       }
     }
   }
```

### 🟡 أولوية متوسطة (مهمة):

#### 5. إكمال Admin Dashboard

```bash
# المطلوب:
1. إكمال جميع الـ Views (Users, Posts, Comments, etc.)
2. إضافة Charts للإحصائيات
3. إضافة Filters و Search
4. إضافة Pagination
5. إضافة Actions (Delete, Edit, Ban, etc.)
```

#### 6. إضافة Admin Endpoints في الباكاند

```bash
# المطلوب:
1. GET /api/admin/stats
2. GET /api/admin/users
3. DELETE /api/admin/users/:id
4. PUT /api/admin/users/:id/ban
5. GET /api/admin/posts
6. DELETE /api/admin/posts/:id
7. GET /api/admin/comments
8. DELETE /api/admin/comments/:id
9. POST /api/admin/notifications/send
```

#### 7. Testing

```bash
# المطلوب:
1. اختبار جميع الـ endpoints
2. اختبار OTP flow
3. اختبار رفع الصور والفيديوهات
4. اختبار الإشعارات
5. اختبار على أجهزة مختلفة
```

### 🟢 أولوية منخفضة (اختيارية):

#### 8. تحسينات الأداء

```bash
# المطلوب:
1. Image Optimization
2. Lazy Loading
3. Caching
4. Code Splitting
```

#### 9. Analytics

```bash
# المطلوب:
1. Firebase Analytics
2. Sentry (Error Tracking)
3. Performance Monitoring
```

---

## 🎓 دليل الاستخدام

### تشغيل المشروع بالكامل:

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Mobile App
cd user-app
yarn start

# Terminal 3: Dashboard
cd dashboard
npm run dev
```

### الوصول:

- **Mobile App**: Expo Go على الموبايل
- **Dashboard**: http://localhost:5173
- **Backend API**: http://localhost:3000/api

---

## 📞 الدعم

للمساعدة أو الاستفسارات:
- افتح Issue في GitHub
- راسلني على البريد الإلكتروني

---

## 📄 License

ISC

---

## 🙏 شكر خاص

شكراً لاستخدامك **أثر**! نتمنى لك تجربة رائعة 🚀

---

تم إنشاء هذا المشروع بواسطة Kiki AI 🤖