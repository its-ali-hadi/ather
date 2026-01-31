# 📋 قائمة النشر الكاملة - منصة أثر

## 🎯 الحالة الحالية: 85% جاهز

---

## ❌ **الناقص للنشر (يجب إكماله):**

### 1. **إضافة حقل is_private في قاعدة البيانات** ⚠️ **حرج**
```sql
ALTER TABLE posts ADD COLUMN is_private BOOLEAN DEFAULT FALSE AFTER is_archived;
ALTER TABLE posts ADD INDEX idx_is_private (is_private);
```

**الحل:**
- إنشاء migration script في `backend/src/scripts/addPrivateField.js`
- تشغيله على قاعدة البيانات

---

### 2. **تحديث Backend Controller لدعم is_private** ⚠️ **حرج**
- تحديث `postController.js` لحفظ `is_private`
- تحديث queries لفلترة المنشورات الخاصة/العامة
- إضافة endpoint للمنشورات الخاصة فقط

---

### 3. **إكمال شاشات الإنشاء** ⚠️ **مهم**
- ✅ CreateTextPostScreen.tsx (مكتمل)
- ✅ CreateImagePostScreen.tsx (مكتمل)
- ❌ CreateVideoPostScreen.tsx (ناقص is_private)
- ❌ CreateLinkPostScreen.tsx (ناقص is_private)

---

### 4. **تحديث app.json للنشر** ⚠️ **حرج**
```json
{
  "expo": {
    "name": "أثر - Athar",
    "slug": "athar-app",
    "version": "1.0.0",
    "ios": {
      "bundleIdentifier": "com.athar.app",
      "buildNumber": "1"
    },
    "android": {
      "package": "com.athar.app",
      "versionCode": 1
    }
  }
}
```

---

### 5. **إنشاء أيقونات وصور احترافية** ⚠️ **مهم**
- ❌ أيقونة التطبيق (1024x1024)
- ❌ Splash Screen
- ❌ App Store Screenshots
- ❌ Google Play Screenshots

**الحل:**
- استخدام Figma أو Canva لتصميم الأيقونات
- استخدام `expo-splash-screen` لإنشاء splash screen

---

### 6. **إعداد EAS Build** ⚠️ **حرج**
```bash
# تثبيت EAS CLI
npm install -g eas-cli

# تسجيل الدخول
eas login

# إعداد المشروع
eas build:configure

# إنشاء ملف eas.json
```

**ملف eas.json المطلوب:**
```json
{
  "build": {
    "production": {
      "android": {
        "buildType": "apk"
      },
      "ios": {
        "buildConfiguration": "Release"
      }
    }
  }
}
```

---

### 7. **إعداد S3 أو خدمة تخزين الصور** ⚠️ **حرج**
- ❌ إعداد AWS S3 Bucket
- ❌ إضافة credentials في `.env`
- ❌ اختبار رفع الصور والفيديوهات

**البديل:**
- استخدام Cloudinary (أسهل)
- استخدام Firebase Storage

---

### 8. **إعداد OTP.dev للإنتاج** ⚠️ **حرج**
- ❌ إنشاء حساب production في otp.dev
- ❌ الحصول على credentials للإنتاج
- ❌ تحديث `.env` في Backend

---

### 9. **Privacy Policy & Terms of Service** ⚠️ **مطلوب للنشر**
- ✅ الشاشات موجودة
- ❌ المحتوى الفعلي ناقص
- ❌ رابط خارجي للسياسات

**الحل:**
- كتابة سياسة الخصوصية
- كتابة شروط الاستخدام
- رفعها على موقع أو GitHub Pages

---

### 10. **إعداد VPS للـ Backend** ⚠️ **حرج**

#### الخطوات:
```bash
# 1. على VPS
sudo apt update
sudo apt install nodejs npm mysql-server nginx

# 2. إعداد MySQL
sudo mysql_secure_installation

# 3. إنشاء قاعدة البيانات
mysql -u root -p
CREATE DATABASE athar_db;
CREATE USER 'athar_user'@'localhost' IDENTIFIED BY 'strong_password';
GRANT ALL PRIVILEGES ON athar_db.* TO 'athar_user'@'localhost';
FLUSH PRIVILEGES;

# 4. رفع الكود
git clone <repo>
cd backend
npm install --production

# 5. إعداد .env
cp .env.example .env
nano .env

# 6. تشغيل Database
npm run init-db

# 7. تشغيل مع PM2
npm install -g pm2
pm2 start src/server.js --name athar-api
pm2 save
pm2 startup

# 8. إعداد Nginx
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
    }
}
```

```bash
# تفعيل الموقع
sudo ln -s /etc/nginx/sites-available/athar /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# إعداد SSL (Let's Encrypt)
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d api.athar.com
```

---

### 11. **إعداد Domain و SSL** ⚠️ **مهم**
- ❌ شراء Domain
- ❌ ربط Domain بـ VPS
- ❌ إعداد SSL Certificate (Let's Encrypt)

---

### 12. **اختبار شامل** ⚠️ **حرج**
- ❌ اختبار جميع الميزات
- ❌ اختبار على أجهزة مختلفة
- ❌ اختبار الأداء
- ❌ اختبار الأمان

---

## ✅ **المكتمل:**

### Frontend
- ✅ جميع الشاشات
- ✅ نظام المصادقة
- ✅ وضع الضيف
- ✅ Safe Area
- ✅ الوضع الداكن
- ✅ الرسوم المتحركة
- ✅ التنقل
- ✅ معالجة الأخطاء

### Backend
- ✅ API كامل
- ✅ المصادقة JWT
- ✅ OTP عبر WhatsApp
- ✅ قاعدة البيانات
- ✅ Seed Data
- ✅ الأمان

---

## 📝 **خطة العمل (بالترتيب):**

### المرحلة 1: إصلاح الأساسيات (يوم واحد)
1. ✅ إضافة حقل `is_private` في قاعدة البيانات
2. ✅ تحديث Backend Controller
3. ✅ إكمال شاشات الإنشاء
4. ✅ اختبار محلي

### المرحلة 2: إعداد الخدمات (يومين)
5. ⏳ إعداد S3/Cloudinary
6. ⏳ إعداد OTP.dev للإنتاج
7. ⏳ كتابة Privacy Policy & Terms

### المرحلة 3: إعداد VPS (يوم واحد)
8. ⏳ إعداد VPS
9. ⏳ إعداد MySQL
10. ⏳ إعداد Nginx + SSL
11. ⏳ رفع Backend

### المرحلة 4: إعداد التطبيق (يومين)
12. ⏳ تحديث app.json
13. ⏳ إنشاء الأيقونات
14. ⏳ إعداد EAS Build
15. ⏳ بناء APK/IPA

### المرحلة 5: النشر (يوم واحد)
16. ⏳ اختبار شامل
17. ⏳ رفع على Google Play
18. ⏳ رفع على App Store

---

## 🎯 **الوقت المتوقع: 5-7 أيام**

---

## 💰 **التكاليف المتوقعة:**

| الخدمة | التكلفة الشهرية |
|--------|-----------------|
| VPS (DigitalOcean/Linode) | $5-10 |
| Domain | $10-15/سنة |
| S3/Cloudinary | $0-5 |
| OTP.dev | $0-20 |
| Apple Developer | $99/سنة |
| Google Play | $25 (مرة واحدة) |
| **المجموع** | **~$15-35/شهر** |

---

## 🚨 **ملاحظات مهمة:**

1. **Apple App Store:**
   - يحتاج Mac للبناء
   - مراجعة تستغرق 1-3 أيام
   - يجب اتباع guidelines بدقة

2. **Google Play:**
   - أسهل من App Store
   - مراجعة تستغرق ساعات
   - يمكن البناء من أي نظام

3. **الأمان:**
   - ⚠️ غيّر JWT_SECRET
   - ⚠️ عطّل AUTO_SEED
   - ⚠️ استخدم HTTPS فقط

---

## 📞 **الدعم:**

إذا واجهت أي مشكلة:
1. راجع التوثيق
2. تحقق من الـ logs
3. اسأل في المجتمع

---

**آخر تحديث:** 2024  
**الحالة:** 85% جاهز  
**الوقت المتبقي:** 5-7 أيام