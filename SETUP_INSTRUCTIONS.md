# 📱 تعليمات إعداد تطبيق أثر (Athar)

## 🎯 نظرة عامة
تطبيق أثر هو منصة لمشاركة الأفكار والمحتوى مع نظام مصادقة متقدم باستخدام OTP.

---

## ✅ الأشياء المكتملة

### Frontend (React Native + Expo)
- ✅ جميع الشاشات الأساسية
- ✅ نظام المصادقة مع OTP
- ✅ إدارة الحالة مع AuthContext
- ✅ رفع الصور والفيديوهات لـ AWS S3
- ✅ نظام الإشعارات
- ✅ لوحة تحكم الأدمن
- ✅ تصميم احترافي مع Dark Mode

### Backend (Node.js + Express + MySQL)
- ✅ جميع الـ API Endpoints
- ✅ نظام المصادقة مع JWT
- ✅ تكامل مع OTP.dev
- ✅ إدارة المستخدمين والمنشورات
- ✅ نظام الإعجابات والتعليقات
- ✅ نظام المفضلة والأرشيف
- ✅ Admin Dashboard APIs

---

## 📋 الأشياء المطلوبة منك

### 1️⃣ إعداد قاعدة البيانات MySQL

#### الخطوة 1: تثبيت MySQL
```bash
# على macOS
brew install mysql
brew services start mysql

# على Ubuntu/Debian
sudo apt-get install mysql-server
sudo systemctl start mysql

# على Windows
# حمل MySQL من الموقع الرسمي وثبته
```

#### الخطوة 2: إنشاء قاعدة البيانات
```bash
# افتح MySQL
mysql -u root -p

# أنشئ قاعدة البيانات
CREATE DATABASE athar_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# أنشئ مستخدم جديد (اختياري)
CREATE USER 'athar_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON athar_db.* TO 'athar_user'@'localhost';
FLUSH PRIVILEGES;

# اخرج
EXIT;
```

#### الخطوة 3: تشغيل سكريبت إنشاء الجداول
```bash
cd backend
node src/scripts/initDatabase.js
node src/scripts/addBanFields.js
```

---

### 2️⃣ إعداد متغيرات البيئة

#### Frontend (.env.local)
```bash
# AWS S3 Configuration
EXPO_PUBLIC_AWS_REGION=us-east-1
EXPO_PUBLIC_AWS_BUCKET_NAME=your-bucket-name
EXPO_PUBLIC_AWS_ACCESS_KEY_ID=your-access-key-id
EXPO_PUBLIC_AWS_SECRET_ACCESS_KEY=your-secret-access-key

# Backend API URL
EXPO_PUBLIC_API_URL=http://localhost:3000/api
```

#### Backend (.env)
```bash
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=athar_db
DB_PORT=3306

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

# CORS Configuration
FRONTEND_URL=http://localhost:8081

# OTP.dev Configuration
OTP_DEV_APP_ID=your_otp_dev_app_id
OTP_DEV_CLIENT_ID=your_otp_dev_client_id
OTP_DEV_CLIENT_SECRET=your_otp_dev_client_secret
OTP_DEV_API_URL=https://api.otp.dev/v1

# AWS S3 Configuration (Optional)
AWS_REGION=us-east-1
AWS_BUCKET_NAME=your-bucket-name
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key
```

---

### 3️⃣ الحصول على AWS S3 Credentials

#### الخطوة 1: إنشاء حساب AWS
1. اذهب إلى [aws.amazon.com](https://aws.amazon.com)
2. أنشئ حساب جديد أو سجل دخول

#### الخطوة 2: إنشاء S3 Bucket
1. اذهب إلى S3 Console
2. اضغط "Create bucket"
3. اختر اسم فريد للـ bucket (مثل: `athar-media-2024`)
4. اختر Region: `us-east-1`
5. ألغِ تفعيل "Block all public access"
6. اضغط "Create bucket"

#### الخطوة 3: إنشاء IAM User
1. اذهب إلى IAM Console
2. اضغط "Users" → "Add users"
3. اسم المستخدم: `athar-app`
4. اختر "Access key - Programmatic access"
5. Permissions: اختر "Attach existing policies directly"
6. ابحث عن `AmazonS3FullAccess` وفعله
7. اضغط "Create user"
8. **احفظ Access Key ID و Secret Access Key**

#### الخطوة 4: إعداد CORS للـ Bucket
```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": []
  }
]
```

---

### 4️⃣ الحصول على OTP.dev Credentials

#### الخطوة 1: إنشاء حساب
1. اذهب إلى [otp.dev](https://otp.dev)
2. أنشئ حساب جديد

#### الخطوة 2: إنشاء Application
1. من Dashboard، اضغط "Create Application"
2. اسم التطبيق: `Athar App`
3. احفظ:
   - App ID
   - Client ID
   - Client Secret

#### الخطوة 3: إعداد الرسائل
1. اذهب إلى Settings → SMS Templates
2. أضف template للرسائل بالعربي:
```
رمز التحقق الخاص بك في تطبيق أثر هو: {code}
```

---

### 5️⃣ تشغيل المشروع

#### Backend
```bash
cd backend

# تثبيت المكتبات
npm install

# تشغيل السيرفر
npm start

# أو للتطوير مع auto-reload
npm run dev
```

#### Frontend
```bash
# من المجلد الرئيسي
yarn start

# أو
npm start
```

---

## 🔐 إنشاء حساب أدمن

بعد تشغيل المشروع، سجل حساب عادي ثم غير الـ role في قاعدة البيانات:

```sql
UPDATE users SET role = 'admin' WHERE phone = '07XXXXXXXXX';
```

---

## 📱 اختبار التطبيق

### على الموبايل
1. ثبت تطبيق Expo Go
2. امسح الـ QR Code من Terminal
3. التطبيق راح يفتح

### على المتصفح
1. اضغط `w` في Terminal
2. التطبيق راح يفتح في المتصفح

---

## 🐛 حل المشاكل الشائعة

### مشكلة: Cannot connect to database
**الحل:**
```bash
# تأكد من تشغيل MySQL
brew services start mysql  # macOS
sudo systemctl start mysql  # Linux

# تأكد من صحة معلومات الاتصال في .env
```

### مشكلة: OTP not sending
**الحل:**
- تأكد من صحة OTP.dev credentials
- تأكد من وجود رصيد في حسابك
- تأكد من صيغة رقم الهاتف: `+9647XXXXXXXXX`

### مشكلة: Images not uploading
**الحل:**
- تأكد من صحة AWS credentials
- تأكد من CORS settings في S3 bucket
- تأكد من permissions للـ IAM user

### مشكلة: Metro bundler errors
**الحل:**
```bash
# امسح الـ cache
yarn start --clear

# أو
npx expo start -c
```

---

## 📚 الميزات المتاحة

### للمستخدمين العاديين
- ✅ التسجيل وتسجيل الدخول مع OTP
- ✅ إنشاء منشورات (نص، صورة، فيديو، رابط)
- ✅ التعليق والإعجاب
- ✅ المفضلة والأرشيف
- ✅ البحث المتقدم
- ✅ الإشعارات
- ✅ تعديل الملف الشخصي

### للأدمن
- ✅ لوحة تحكم شاملة
- ✅ إحصائيات المستخدمين والمنشورات
- ✅ إدارة المستخدمين (حظر، توثيق، تغيير الدور)
- ✅ إدارة المنشورات (حذف، تمييز)
- ✅ مراقبة النشاط

---

## 🚀 الخطوات التالية (اختيارية)

### 1. Deploy Backend
- استخدم Heroku أو DigitalOcean أو AWS
- غير `EXPO_PUBLIC_API_URL` للـ production URL

### 2. Deploy Frontend
- استخدم `eas build` لبناء التطبيق
- انشر على App Store و Google Play

### 3. CI/CD
- استخدم GitHub Actions
- اعمل auto-deploy للـ backend
- اعمل auto-build للتطبيق

---

## 📞 الدعم

إذا واجهت أي مشكلة:
1. تأكد من اتباع جميع الخطوات بالترتيب
2. تأكد من صحة جميع الـ credentials
3. راجع الـ logs في Terminal
4. تأكد من تشغيل MySQL والـ Backend

---

## ✨ ملاحظات مهمة

1. **الأمان**: غير جميع الـ secrets في production
2. **الأداء**: استخدم CDN للصور في production
3. **التكلفة**: راقب استخدام AWS S3 و OTP.dev
4. **النسخ الاحتياطي**: اعمل backup دوري لقاعدة البيانات

---

**تم بحمد الله! 🎉**

التطبيق جاهز للاستخدام بعد إكمال الخطوات أعلاه.