# 🚀 دليل النشر الشامل - منصة أثر

> دليل خطوة بخطوة لنشر التطبيق على الإنتاج

---

## 📋 جدول المحتويات

1. [نظرة عامة](#نظرة-عامة)
2. [المتطلبات](#المتطلبات)
3. [إعداد قاعدة البيانات](#إعداد-قاعدة-البيانات)
4. [إعداد الخدمات الخارجية](#إعداد-الخدمات-الخارجية)
5. [إعداد VPS](#إعداد-vps)
6. [إعداد التطبيق للنشر](#إعداد-التطبيق-للنشر)
7. [النشر على المتاجر](#النشر-على-المتاجر)
8. [الصيانة والمراقبة](#الصيانة-والمراقبة)

---

## 🎯 نظرة عامة

### الحالة الحالية: 95% جاهز ✅

**ما تم إنجازه:**
- ✅ جميع شاشات Frontend
- ✅ جميع API endpoints
- ✅ نظام المصادقة (OTP)
- ✅ رفع الملفات (S3)
- ✅ نظام الإشعارات
- ✅ لوحة تحكم الإدارة
- ✅ المنشورات الخاصة/العامة
- ✅ قاعدة البيانات الكاملة

**ما تبقى:**
- ⏳ إعداد S3/Cloudinary للإنتاج
- ⏳ إعداد OTP.dev للإنتاج
- ⏳ رفع Backend على VPS
- ⏳ إنشاء أيقونات التطبيق
- ⏳ النشر على المتاجر

### الوقت المتوقع: 5-6 أيام

| المرحلة | الوقت |
|---------|-------|
| إعداد قاعدة البيانات | 30 دقيقة |
| إعداد الخدمات الخارجية | يوم واحد |
| إعداد VPS | يوم واحد |
| إعداد التطبيق | يومين |
| النشر على المتاجر | يوم واحد |

### التكلفة المتوقعة

**شهرياً:**
| الخدمة | التكلفة |
|--------|---------|
| VPS | $5-10 |
| Domain | $1-2 |
| S3/Cloudinary | $0-5 |
| OTP.dev | $0-20 |
| **المجموع** | **$6-37** |

**مرة واحدة:**
| الخدمة | التكلفة |
|--------|---------|
| Google Play Developer | $25 |
| Apple Developer | $99/سنة |

---

## 📦 المتطلبات

### الأدوات المطلوبة:
- ✅ Node.js 18+
- ✅ MySQL 8.0+
- ✅ Git
- ✅ حساب AWS أو Cloudinary
- ✅ حساب OTP.dev
- ✅ VPS (DigitalOcean/Linode/Vultr)
- ✅ Domain name
- ✅ حساب Expo
- ✅ حساب Google Play Developer
- ✅ حساب Apple Developer (للـ iOS)

---

## 🗄️ إعداد قاعدة البيانات

### الخطوة 1: إنشاء قاعدة البيانات محلياً

```bash
# 1. الانتقال لمجلد Backend
cd backend

# 2. تثبيت Dependencies
npm install

# 3. إعداد ملف .env
cp .env.example .env
nano .env
```

**ملف .env للتطوير:**
```env
# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=athar_db
DB_PORT=3306

# JWT
JWT_SECRET=your_jwt_secret_key_here_make_it_long_and_random

# OTP.dev (Development)
OTP_APP_ID=your_dev_app_id
OTP_SECRET_KEY=your_dev_secret_key

# AWS S3 (Development)
AWS_ACCESS_KEY_ID=your_dev_key
AWS_SECRET_ACCESS_KEY=your_dev_secret
AWS_REGION=us-east-1
AWS_BUCKET_NAME=athar-dev

# Server
PORT=3000
NODE_ENV=development
```

```bash
# 4. إنشاء قاعدة البيانات
npm run init-db

# 5. (اختياري) إضافة بيانات تجريبية
npm run seed

# 6. تشغيل السيرفر
npm start
```

### الخطوة 2: التحقق من قاعدة البيانات

```bash
# الاتصال بـ MySQL
mysql -u root -p

# التحقق من الجداول
USE athar_db;
SHOW TABLES;

# يجب أن ترى:
# - users
# - posts
# - comments
# - likes
# - favorites
# - follows
# - notifications
```

---

## 🔧 إعداد الخدمات الخارجية

### 1. AWS S3 (تخزين الملفات)

#### الخيار A: AWS S3

```bash
# 1. إنشاء حساب AWS
# https://aws.amazon.com/

# 2. إنشاء S3 Bucket
# - اسم الـ Bucket: athar-media-production
# - Region: us-east-1 (أو الأقرب لك)
# - Block all public access: OFF
# - Bucket Versioning: Disabled
# - Default encryption: Enabled

# 3. إنشاء IAM User
# - اسم المستخدم: athar-s3-user
# - Access type: Programmatic access
# - Permissions: AmazonS3FullAccess

# 4. حفظ Access Key و Secret Key
```

**Bucket Policy:**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::athar-media-production/*"
    }
  ]
}
```

**CORS Configuration:**
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

#### الخيار B: Cloudinary (أسهل)

```bash
# 1. إنشاء حساب
# https://cloudinary.com/

# 2. الحصول على المعلومات
# Dashboard > Account Details
# - Cloud Name
# - API Key
# - API Secret

# 3. إضافة في .env:
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 2. OTP.dev (التحقق عبر WhatsApp)

```bash
# 1. إنشاء حساب
# https://otp.dev/

# 2. إنشاء تطبيق جديد
# - اسم التطبيق: Athar Production
# - نوع التطبيق: WhatsApp OTP

# 3. الحصول على المعلومات
# - App ID
# - Secret Key

# 4. إضافة في .env:
OTP_APP_ID=your_production_app_id
OTP_SECRET_KEY=your_production_secret_key
```

### 3. Privacy Policy & Terms of Service

```bash
# 1. كتابة سياسة الخصوصية
# - ما هي البيانات التي نجمعها
# - كيف نستخدم البيانات
# - كيف نحمي البيانات
# - حقوق المستخدمين

# 2. كتابة شروط الاستخدام
# - قواعد استخدام المنصة
# - المحتوى المحظور
# - حقوق الملكية الفكرية
# - إنهاء الحساب

# 3. رفعها على GitHub Pages أو موقع
# https://your-username.github.io/athar-privacy-policy
# https://your-username.github.io/athar-terms-of-service
```

---

## 🖥️ إعداد VPS

### الخطوة 1: شراء VPS

**الخيارات الموصى بها:**
- **DigitalOcean** - $6/شهر (1GB RAM, 25GB SSD)
- **Linode** - $5/شهر (1GB RAM, 25GB SSD)
- **Vultr** - $6/شهر (1GB RAM, 25GB SSD)

**المواصفات الموصى بها:**
- RAM: 1-2 GB
- Storage: 25-50 GB SSD
- OS: Ubuntu 22.04 LTS

### الخطوة 2: الاتصال بـ VPS

```bash
# الاتصال عبر SSH
ssh root@your_vps_ip

# تحديث النظام
sudo apt update
sudo apt upgrade -y
```

### الخطوة 3: تثبيت المتطلبات

```bash
# تثبيت Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# تثبيت MySQL
sudo apt install -y mysql-server

# تثبيت Nginx
sudo apt install -y nginx

# تثبيت Git
sudo apt install -y git

# التحقق من التثبيت
node --version
npm --version
mysql --version
nginx -v
git --version
```

### الخطوة 4: إعداد MySQL

```bash
# تأمين MySQL
sudo mysql_secure_installation

# الإجابة على الأسئلة:
# - Set root password? Yes
# - Remove anonymous users? Yes
# - Disallow root login remotely? Yes
# - Remove test database? Yes
# - Reload privilege tables? Yes

# الاتصال بـ MySQL
sudo mysql -u root -p
```

```sql
-- إنشاء قاعدة البيانات
CREATE DATABASE athar_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- إنشاء مستخدم
CREATE USER 'athar_user'@'localhost' IDENTIFIED BY 'كلمة_مرور_قوية_جداً_123456';

-- منح الصلاحيات
GRANT ALL PRIVILEGES ON athar_db.* TO 'athar_user'@'localhost';
FLUSH PRIVILEGES;

-- الخروج
EXIT;
```

### الخطوة 5: رفع الكود

```bash
# إنشاء مجلد للمشروع
sudo mkdir -p /var/www
cd /var/www

# استنساخ المشروع
sudo git clone https://github.com/your-username/athar-backend.git
cd athar-backend

# تثبيت Dependencies
sudo npm install --production

# إعداد ملف .env
sudo nano .env
```

**ملف .env للإنتاج:**
```env
# Database
DB_HOST=localhost
DB_USER=athar_user
DB_PASSWORD=كلمة_مرور_قوية_جداً_123456
DB_NAME=athar_db
DB_PORT=3306

# JWT
JWT_SECRET=كلمة_سر_عشوائية_طويلة_جداً_للإنتاج_123456789

# OTP.dev (Production)
OTP_APP_ID=your_production_app_id
OTP_SECRET_KEY=your_production_secret_key

# AWS S3 (Production)
AWS_ACCESS_KEY_ID=your_production_key
AWS_SECRET_ACCESS_KEY=your_production_secret
AWS_REGION=us-east-1
AWS_BUCKET_NAME=athar-media-production

# Server
PORT=3000
NODE_ENV=production
```

```bash
# إنشاء قاعدة البيانات
npm run init-db

# (اختياري) إضافة بيانات تجريبية
npm run seed
```

### الخطوة 6: إعداد PM2

```bash
# تثبيت PM2 عالمياً
sudo npm install -g pm2

# تشغيل التطبيق
pm2 start src/server.js --name athar-api

# حفظ التكوين
pm2 save

# تشغيل PM2 عند بدء النظام
pm2 startup
# انسخ الأمر الذي يظهر ونفذه

# التحقق من الحالة
pm2 status
pm2 logs athar-api
```

### الخطوة 7: إعداد Nginx

```bash
# إنشاء ملف تكوين
sudo nano /etc/nginx/sites-available/athar
```

**ملف Nginx:**
```nginx
server {
    listen 80;
    server_name api.athar.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# تفعيل الموقع
sudo ln -s /etc/nginx/sites-available/athar /etc/nginx/sites-enabled/

# اختبار التكوين
sudo nginx -t

# إعادة تشغيل Nginx
sudo systemctl restart nginx
```

### الخطوة 8: إعداد SSL (Let's Encrypt)

```bash
# تثبيت Certbot
sudo apt install -y certbot python3-certbot-nginx

# الحصول على شهادة SSL
sudo certbot --nginx -d api.athar.com

# اتبع التعليمات:
# - أدخل بريدك الإلكتروني
# - وافق على شروط الخدمة
# - اختر إعادة توجيه HTTP إلى HTTPS

# التحقق من التجديد التلقائي
sudo certbot renew --dry-run
```

### الخطوة 9: إعداد Firewall

```bash
# السماح بـ SSH
sudo ufw allow 22

# السماح بـ HTTP
sudo ufw allow 80

# السماح بـ HTTPS
sudo ufw allow 443

# تفعيل Firewall
sudo ufw enable

# التحقق من الحالة
sudo ufw status
```

### الخطوة 10: اختبار API

```bash
# اختبار من المتصفح
https://api.athar.com/api/health

# اختبار من Terminal
curl https://api.athar.com/api/health
```

---

## 📱 إعداد التطبيق للنشر

### الخطوة 1: تحديث app.json

```json
{
  "expo": {
    "name": "أثر - Athar",
    "slug": "athar-app",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "userInterfaceStyle": "automatic",
    "splash": {
      "image": "./assets/images/splash-icon.png",
      "resizeMode": "contain",
      "backgroundColor": "#FAF8F5"
    },
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.athar.app",
      "buildNumber": "1"
    },
    "android": {
      "package": "com.athar.app",
      "versionCode": 1,
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/icon.png",
        "backgroundColor": "#FAF8F5"
      },
      "permissions": [
        "CAMERA",
        "READ_EXTERNAL_STORAGE",
        "WRITE_EXTERNAL_STORAGE"
      ]
    },
    "extra": {
      "eas": {
        "projectId": "your-project-id"
      }
    }
  }
}
```

### الخطوة 2: إنشاء الأيقونات

**المتطلبات:**
- أيقونة التطبيق: 1024x1024 بكسل (PNG)
- Splash Screen: 1242x2436 بكسل (PNG)
- خلفية شفافة أو لون موحد

**الأدوات الموصى بها:**
- Figma
- Canva
- Adobe Illustrator

**حفظ الأيقونات:**
```
assets/images/icon.png          (1024x1024)
assets/images/splash-icon.png   (1242x2436)
assets/images/adaptive-icon.png (1024x1024)
```

### الخطوة 3: تحديث .env.local

```env
# Production API URL
EXPO_PUBLIC_API_URL=https://api.athar.com/api
```

### الخطوة 4: إعداد EAS Build

```bash
# تثبيت EAS CLI
npm install -g eas-cli

# تسجيل الدخول
eas login

# إعداد المشروع
eas build:configure
```

**ملف eas.json:**
```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "apk"
      },
      "ios": {
        "buildConfiguration": "Release"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

### الخطوة 5: بناء التطبيق

```bash
# بناء Android APK
eas build --platform android --profile production

# بناء iOS IPA (يحتاج Mac)
eas build --platform ios --profile production

# متابعة البناء
# سيتم إرسال رابط التحميل عبر البريد الإلكتروني
```

---

## 🏪 النشر على المتاجر

### Google Play Store

#### الخطوة 1: إنشاء حساب Developer

```bash
# 1. الذهاب إلى
https://play.google.com/console

# 2. إنشاء حساب ($25 مرة واحدة)

# 3. ملء معلومات الحساب
```

#### الخطوة 2: إنشاء تطبيق جديد

```bash
# 1. Create app
# - App name: أثر - Athar
# - Default language: Arabic
# - App or game: App
# - Free or paid: Free

# 2. ملء معلومات التطبيق
# - Short description (80 حرف)
# - Full description (4000 حرف)
# - App icon (512x512)
# - Feature graphic (1024x500)
# - Screenshots (2-8 صور)
```

#### الخطوة 3: رفع APK

```bash
# 1. Production > Create new release
# 2. Upload APK
# 3. Release name: 1.0.0
# 4. Release notes (بالعربية والإنجليزية)
```

#### الخطوة 4: Content Rating

```bash
# 1. Complete questionnaire
# 2. Submit for rating
```

#### الخطوة 5: Privacy Policy

```bash
# 1. Add privacy policy URL
https://your-username.github.io/athar-privacy-policy
```

#### الخطوة 6: إرسال للمراجعة

```bash
# 1. Review and publish
# 2. Submit for review
# 3. الانتظار (1-7 أيام)
```

### Apple App Store

#### الخطوة 1: إنشاء حساب Developer

```bash
# 1. الذهاب إلى
https://developer.apple.com/

# 2. إنشاء حساب ($99/سنة)

# 3. ملء معلومات الحساب
```

#### الخطوة 2: إنشاء App ID

```bash
# 1. Certificates, Identifiers & Profiles
# 2. Identifiers > App IDs
# 3. Register a new identifier
# - Bundle ID: com.athar.app
# - Description: Athar App
```

#### الخطوة 3: إنشاء تطبيق في App Store Connect

```bash
# 1. الذهاب إلى
https://appstoreconnect.apple.com/

# 2. My Apps > + > New App
# - Platform: iOS
# - Name: أثر - Athar
# - Primary Language: Arabic
# - Bundle ID: com.athar.app
# - SKU: athar-app-001
```

#### الخطوة 4: رفع IPA

```bash
# 1. تحميل Transporter من Mac App Store
# 2. فتح Transporter
# 3. سحب وإفلات IPA
# 4. Deliver
```

#### الخطوة 5: ملء معلومات التطبيق

```bash
# 1. App Information
# - Name: أثر - Athar
# - Subtitle: منصة لمشاركة الأفكار
# - Category: Social Networking
# - Privacy Policy URL

# 2. Pricing and Availability
# - Price: Free
# - Availability: All countries

# 3. App Privacy
# - Complete questionnaire

# 4. Screenshots
# - iPhone 6.7" (2-10 صور)
# - iPhone 6.5" (2-10 صور)
# - iPad Pro 12.9" (2-10 صور)
```

#### الخطوة 6: إرسال للمراجعة

```bash
# 1. Submit for Review
# 2. الانتظار (1-7 أيام)
```

---

## 🔍 الصيانة والمراقبة

### مراقبة السيرفر

```bash
# التحقق من حالة PM2
pm2 status

# عرض Logs
pm2 logs athar-api

# إعادة تشغيل التطبيق
pm2 restart athar-api

# التحقق من استخدام الموارد
pm2 monit
```

### مراقبة قاعدة البيانات

```bash
# الاتصال بـ MySQL
mysql -u athar_user -p athar_db

# التحقق من حجم قاعدة البيانات
SELECT 
  table_schema AS 'Database',
  ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS 'Size (MB)'
FROM information_schema.tables
WHERE table_schema = 'athar_db'
GROUP BY table_schema;

# التحقق من عدد السجلات
SELECT 
  'users' AS table_name, COUNT(*) AS count FROM users
UNION ALL
SELECT 'posts', COUNT(*) FROM posts
UNION ALL
SELECT 'comments', COUNT(*) FROM comments;
```

### النسخ الاحتياطي

```bash
# نسخ احتياطي لقاعدة البيانات
mysqldump -u athar_user -p athar_db > backup_$(date +%Y%m%d).sql

# نسخ احتياطي تلقائي (Cron Job)
crontab -e

# إضافة السطر التالي (نسخ احتياطي يومي الساعة 2 صباحاً)
0 2 * * * mysqldump -u athar_user -p'password' athar_db > /backups/athar_$(date +\%Y\%m\%d).sql
```

### التحديثات

```bash
# تحديث الكود
cd /var/www/athar-backend
git pull origin main

# تثبيت Dependencies الجديدة
npm install --production

# إعادة تشغيل التطبيق
pm2 restart athar-api
```

---

## 🎉 تهانينا!

التطبيق الآن منشور ويعمل على الإنتاج! 🚀

### الخطوات التالية:
1. ✅ مراقبة الأداء
2. ✅ جمع ملاحظات المستخدمين
3. ✅ إصلاح الأخطاء
4. ✅ إضافة ميزات جديدة
5. ✅ تحديث التطبيق بانتظام

---

**آخر تحديث:** 2024  
**الإصدار:** 1.0.0  
**الحالة:** جاهز للنشر 🚀