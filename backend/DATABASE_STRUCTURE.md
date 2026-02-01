# 🗄️ هيكل قاعدة البيانات - Athar

## 📋 نظرة عامة

جميع الجداول والحقول موجودة في ملف واحد: `src/scripts/initDatabase.js`

**لا توجد ملفات migration منفصلة!**

---

## 📊 الجداول

### 1. **users** - المستخدمون

```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  phone VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE,
  password VARCHAR(255) NOT NULL,
  bio TEXT,
  profile_image VARCHAR(500),
  push_token VARCHAR(500),
  is_verified BOOLEAN DEFAULT FALSE,
  is_banned BOOLEAN DEFAULT FALSE,
  ban_reason TEXT,
  role ENUM('user', 'admin') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)
```

**الحقول المهمة:**
- `is_banned` - لحظر المستخدمين من لوحة التحكم
- `ban_reason` - سبب الحظر
- `role` - admin للوصول للوحة التحكم

---

### 2. **boxes** - صناديق الأفكار ✨

```sql
CREATE TABLE boxes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  image_url VARCHAR(500),
  color VARCHAR(20),
  is_active BOOLEAN DEFAULT TRUE,
  order_index INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)
```

**البيانات الافتراضية:**
1. صندوق التقنية والبرمجة (#3B82F6)
2. صندوق الفن والإبداع (#8B5CF6)
3. صندوق الكتابة والأدب (#10B981)
4. صندوق الرياضة واللياقة (#EF4444)
5. صندوق السفر والمغامرات (#F59E0B)
6. صندوق ريادة الأعمال (#06B6D4)

---

### 3. **categories** - الفئات ✨

```sql
CREATE TABLE categories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  color VARCHAR(20),
  box_id INT,
  is_active BOOLEAN DEFAULT TRUE,
  order_index INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (box_id) REFERENCES boxes(id) ON DELETE SET NULL
)
```

**البيانات الافتراضية:** 18 فئة مرتبطة بالصناديق

**العلاقات:**
- كل فئة يمكن أن تكون مرتبطة بصندوق واحد
- الصندوق يمكن أن يحتوي على عدة فئات
- عند حذف صندوق، الفئات المرتبطة به تصبح `box_id = NULL`

---

### 4. **posts** - المنشورات

```sql
CREATE TABLE posts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  type ENUM('text', 'image', 'video', 'link') NOT NULL,
  title VARCHAR(255),
  content TEXT NOT NULL,
  media_url VARCHAR(500),
  link_url VARCHAR(500),
  category VARCHAR(50),
  is_archived BOOLEAN DEFAULT FALSE,
  is_private BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  views_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
)
```

**الحقول المهمة:**
- `is_private` - المنشورات الخاصة (لا تظهر في الصفحة الرئيسية)
- `is_featured` - المنشورات المميزة
- `category` - اسم الفئة (يجب أن يطابق اسم في جدول categories)

---

### 5. **comments** - التعليقات

```sql
CREATE TABLE comments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  post_id INT NOT NULL,
  user_id INT NOT NULL,
  content TEXT NOT NULL,
  parent_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE
)
```

**الميزات:**
- دعم الردود على التعليقات (`parent_id`)
- حذف تلقائي عند حذف المنشور أو المستخدم

---

### 6. **likes** - الإعجابات

```sql
CREATE TABLE likes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  post_id INT NOT NULL,
  user_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_like (post_id, user_id)
)
```

**الميزات:**
- إعجاب واحد لكل مستخدم على كل منشور
- حذف تلقائي عند حذف المنشور أو المستخدم

---

### 7. **favorites** - المفضلات

```sql
CREATE TABLE favorites (
  id INT PRIMARY KEY AUTO_INCREMENT,
  post_id INT NOT NULL,
  user_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_favorite (post_id, user_id)
)
```

---

### 8. **follows** - المتابعات

```sql
CREATE TABLE follows (
  id INT PRIMARY KEY AUTO_INCREMENT,
  follower_id INT NOT NULL,
  followed_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (follower_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (followed_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_follow (follower_id, followed_id)
)
```

---

### 9. **notifications** - الإشعارات

```sql
CREATE TABLE notifications (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  type ENUM('like', 'comment', 'follow', 'mention', 'admin') NOT NULL,
  title VARCHAR(255),
  body TEXT NOT NULL,
  data JSON,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
)
```

**أنواع الإشعارات:**
- `like` - إعجاب على منشور
- `comment` - تعليق على منشور
- `follow` - متابعة جديدة
- `mention` - إشارة في تعليق
- `admin` - إشعار من لوحة التحكم

---

## 🔄 العلاقات بين الجداول

```
users (1) ──→ (N) posts
users (1) ──→ (N) comments
users (1) ──→ (N) likes
users (1) ──→ (N) favorites
users (1) ──→ (N) notifications

posts (1) ──→ (N) comments
posts (1) ──→ (N) likes
posts (1) ──→ (N) favorites

boxes (1) ──→ (N) categories

comments (1) ──→ (N) comments (replies)
```

---

## 🚀 إنشاء قاعدة البيانات

```bash
# إنشاء جميع الجداول + البيانات الافتراضية
npm run init-db
```

هذا الأمر سيقوم بـ:
1. إنشاء قاعدة البيانات
2. إنشاء جميع الجداول (9 جداول)
3. إضافة 6 صناديق افتراضية
4. إضافة 18 فئة افتراضية

---

## 📝 ملاحظات مهمة

### ✅ **لا توجد Migrations منفصلة**
- كل شيء في `initDatabase.js`
- لا حاجة لتشغيل scripts إضافية
- البيانات الافتراضية تُضاف تلقائياً

### ✅ **التحديثات المستقبلية**
عند إضافة حقول أو جداول جديدة:
1. أضفها في `initDatabase.js`
2. شغل `npm run init-db` (آمن - لن يحذف البيانات الموجودة)
3. حدّث هذا الملف

### ✅ **الفهارس (Indexes)**
جميع الجداول تحتوي على فهارس محسّنة للأداء:
- Foreign Keys
- Unique Keys
- Search Indexes
- Fulltext Indexes (للبحث في المنشورات)

---

**آخر تحديث:** 2024  
**الإصدار:** 1.0.0