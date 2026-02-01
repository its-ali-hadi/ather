# Athar API Documentation

توثيق كامل لجميع endpoints في Athar Backend API

## 📋 جدول المحتويات

- [Authentication](#authentication)
- [Users](#users)
- [Posts](#posts)
- [Comments](#comments)
- [Likes](#likes)
- [Favorites](#favorites)
- [Notifications](#notifications)
- [📦 الصناديق والفئات](#📦-الصناديق-والفئات)

---

## 🔐 Authentication

### إرسال OTP للتسجيل

إرسال رمز التحقق عبر SMS لرقم هاتف جديد

**Endpoint:** `POST /api/auth/send-registration-otp`

**Request Body:**
```json
{
  "phone": "07701234567"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "تم إرسال رمز التحقق إلى هاتفك",
  "data": {
    "orderId": "otp_order_123456"
  }
}
```

**Response (Error - Phone Already Exists):**
```json
{
  "success": false,
  "message": "رقم الهاتف مستخدم مسبقاً"
}
```

---

### التسجيل مع OTP

إنشاء حساب جديد بعد التحقق من OTP

**Endpoint:** `POST /api/auth/register`

**Request Body:**
```json
{
  "phone": "07701234567",
  "name": "أحمد محمد",
  "email": "ahmed@example.com",
  "password": "password123",
  "orderId": "otp_order_123456",
  "code": "123456"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "تم إنشاء الحساب بنجاح",
  "data": {
    "user": {
      "id": 1,
      "phone": "07701234567",
      "name": "أحمد محمد",
      "email": "ahmed@example.com",
      "bio": null,
      "profile_image": null,
      "is_verified": true,
      "role": "user",
      "created_at": "2024-01-01T00:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### إرسال OTP لتسجيل الدخول

إرسال رمز التحقق لتسجيل الدخول

**Endpoint:** `POST /api/auth/send-login-otp`

**Request Body:**
```json
{
  "phone": "07701234567"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "تم إرسال رمز التحقق إلى هاتفك",
  "data": {
    "orderId": "otp_order_789012"
  }
}
```

---

### تسجيل الدخول مع OTP

تسجيل الدخول باستخدام OTP

**Endpoint:** `POST /api/auth/login-otp`

**Request Body:**
```json
{
  "phone": "07701234567",
  "orderId": "otp_order_789012",
  "code": "123456"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "تم تسجيل الدخول بنجاح",
  "data": {
    "user": {
      "id": 1,
      "phone": "07701234567",
      "name": "أحمد محمد",
      "email": "ahmed@example.com",
      "bio": "مطور تطبيقات",
      "profile_image": "https://bucket.s3.region.amazonaws.com/profiles/image.jpg",
      "is_verified": true,
      "role": "user",
      "created_at": "2024-01-01T00:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### تسجيل الدخول بكلمة المرور

تسجيل الدخول التقليدي بكلمة المرور

**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "phone": "07701234567",
  "password": "password123"
}
```

**Response:** نفس response تسجيل الدخول مع OTP

---

### الحصول على المستخدم الحالي

**Endpoint:** `GET /api/auth/me`

**Headers:**
```
Authorization: Bearer {token}
```

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "phone": "07701234567",
    "name": "أحمد محمد",
    "email": "ahmed@example.com",
    "bio": "مطور تطبيقات",
    "profile_image": "https://bucket.s3.region.amazonaws.com/profiles/image.jpg",
    "is_verified": true,
    "role": "user",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### تحديث كلمة المرور

**Endpoint:** `PUT /api/auth/password`

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "currentPassword": "password123",
  "newPassword": "newpassword456"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "تم تحديث كلمة المرور بنجاح"
}
```

---

### حفظ Push Token

**Endpoint:** `POST /api/auth/push-token`

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "pushToken": "ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "تم حفظ رمز الإشعارات بنجاح"
}
```

---

## 👤 Users

### الحصول على ملف مستخدم

**Endpoint:** `GET /api/users/:userId`

**Headers:**
```
Authorization: Bearer {token}
```

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "id": 2,
    "phone": "07801234567",
    "name": "سارة أحمد",
    "email": "sara@example.com",
    "bio": "مصممة جرافيك",
    "profile_image": "https://bucket.s3.region.amazonaws.com/profiles/sara.jpg",
    "is_verified": true,
    "role": "user",
    "created_at": "2024-01-01T00:00:00.000Z",
    "posts_count": 15,
    "followers_count": 120,
    "following_count": 85,
    "is_following": false
  }
}
```

---

### تحديث الملف الشخصي

**Endpoint:** `PUT /api/users/profile`

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "name": "أحمد محمد الجديد",
  "email": "ahmed.new@example.com",
  "bio": "مطور تطبيقات موبايل",
  "profile_image": "https://bucket.s3.region.amazonaws.com/profiles/new-image.jpg"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "تم تحديث الملف الشخصي بنجاح",
  "data": {
    "id": 1,
    "phone": "07701234567",
    "name": "أحمد محمد الجديد",
    "email": "ahmed.new@example.com",
    "bio": "مطور تطبيقات موبايل",
    "profile_image": "https://bucket.s3.region.amazonaws.com/profiles/new-image.jpg",
    "is_verified": true,
    "role": "user",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### متابعة مستخدم

**Endpoint:** `POST /api/users/:userId/follow`

**Headers:**
```
Authorization: Bearer {token}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "تمت المتابعة بنجاح"
}
```

---

### إلغاء متابعة مستخدم

**Endpoint:** `DELETE /api/users/:userId/follow`

**Headers:**
```
Authorization: Bearer {token}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "تم إلغاء المتابعة بنجاح"
}
```

---

### الحصول على المتابعين

**Endpoint:** `GET /api/users/:userId/followers?page=1&limit=20`

**Headers:**
```
Authorization: Bearer {token}
```

**Response (Success):**
```json
{
  "success": true,
  "data": [
    {
      "id": 3,
      "name": "علي حسن",
      "profile_image": "https://bucket.s3.region.amazonaws.com/profiles/ali.jpg",
      "bio": "مصور فوتوغرافي",
      "is_verified": false,
      "is_following": true
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 120,
    "pages": 6
  }
}
```

---

### البحث عن مستخدمين

**Endpoint:** `GET /api/users/search?q=أحمد&page=1&limit=20`

**Headers:**
```
Authorization: Bearer {token}
```

**Response (Success):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "أحمد محمد",
      "profile_image": "https://bucket.s3.region.amazonaws.com/profiles/ahmed.jpg",
      "bio": "مطور تطبيقات",
      "is_verified": true,
      "followers_count": 250,
      "is_following": false
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 5,
    "pages": 1
  }
}
```

---

## 📝 Posts

### الحصول على المنشورات

**Endpoint:** `GET /api/posts?page=1&limit=20&category=تقنية&type=image`

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `page` (optional): رقم الصفحة (default: 1)
- `limit` (optional): عدد المنشورات (default: 20)
- `category` (optional): التصنيف
- `type` (optional): نوع المنشور (text, image, video, link)

**Response (Success):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "type": "image",
      "title": "منظر طبيعي رائع",
      "content": "صورة من رحلتي الأخيرة",
      "media_url": "https://bucket.s3.region.amazonaws.com/posts/image1.jpg",
      "link_url": null,
      "category": "سفر",
      "is_archived": false,
      "views_count": 150,
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z",
      "user_name": "أحمد محمد",
      "user_image": "https://bucket.s3.region.amazonaws.com/profiles/ahmed.jpg",
      "user_verified": true,
      "likes_count": 45,
      "comments_count": 12,
      "is_liked": false,
      "is_favorited": true
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```

---

### الحصول على منشور واحد

**Endpoint:** `GET /api/posts/:postId`

**Headers:**
```
Authorization: Bearer {token}
```

**Response:** نفس بنية المنشور في القائمة

---

### إنشاء منشور

**Endpoint:** `POST /api/posts`

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body (Image Post):**
```json
{
  "type": "image",
  "title": "منظر طبيعي رائع",
  "content": "صورة من رحلتي الأخيرة",
  "media_url": "https://bucket.s3.region.amazonaws.com/posts/image1.jpg",
  "category": "سفر"
}
```

**Request Body (Video Post):**
```json
{
  "type": "video",
  "title": "فيديو تعليمي",
  "content": "شرح عن React Native",
  "media_url": "https://bucket.s3.region.amazonaws.com/posts/video1.mp4",
  "category": "تقنية"
}
```

**Request Body (Text Post):**
```json
{
  "type": "text",
  "title": "فكرة جديدة",
  "content": "محتوى المنشور النصي...",
  "category": "أدب"
}
```

**Request Body (Link Post):**
```json
{
  "type": "link",
  "title": "مقال مفيد",
  "content": "وصف المقال",
  "link_url": "https://example.com/article",
  "category": "تقنية"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "تم إنشاء المنشور بنجاح",
  "data": {
    "id": 1,
    "user_id": 1,
    "type": "image",
    "title": "منظر طبيعي رائع",
    "content": "صورة من رحلتي الأخيرة",
    "media_url": "https://bucket.s3.region.amazonaws.com/posts/image1.jpg",
    "category": "سفر",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### تحديث منشور

**Endpoint:** `PUT /api/posts/:postId`

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "title": "عنوان محدث",
  "content": "محتوى محدث",
  "category": "تقنية"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "تم تحديث المنشور بنجاح",
  "data": {
    "id": 1,
    "title": "عنوان محدث",
    "content": "محتوى محدث",
    "category": "تقنية",
    "updated_at": "2024-01-02T00:00:00.000Z"
  }
}
```

---

### حذف منشور

**Endpoint:** `DELETE /api/posts/:postId`

**Headers:**
```
Authorization: Bearer {token}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "تم حذف المنشور بنجاح"
}
```

---

### أرشفة منشور

**Endpoint:** `POST /api/posts/:postId/archive`

**Headers:**
```
Authorization: Bearer {token}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "تم أرشفة المنشور بنجاح"
}
```

---

### البحث في المنشورات

**Endpoint:** `GET /api/posts/search?q=react&page=1&limit=20`

**Headers:**
```
Authorization: Bearer {token}
```

**Response:** نفس بنية قائمة المنشورات

---

## 🔒 المنشورات الخاصة

### الحصول على المنشورات الخاصة

**Endpoint:** `GET /api/posts/private`

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `page` (optional): رقم الصفحة (default: 1)
- `limit` (optional): عدد المنشورات (default: 20)

**Response (Success):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "type": "text",
      "title": "محتوى خاص",
      "content": "محتوى المنشور الخاص",
      "is_private": true,
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 5,
    "pages": 1
  }
}
```

---

## 💬 Comments

### الحصول على تعليقات منشور

**Endpoint:** `GET /api/comments/post/:postId?page=1&limit=20`

**Headers:**
```
Authorization: Bearer {token}
```

**Response (Success):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "post_id": 1,
      "user_id": 2,
      "content": "منشور رائع!",
      "parent_id": null,
      "created_at": "2024-01-01T00:00:00.000Z",
      "user_name": "سارة أحمد",
      "user_image": "https://bucket.s3.region.amazonaws.com/profiles/sara.jpg",
      "user_verified": true,
      "replies_count": 3
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 12,
    "pages": 1
  }
}
```

---

### إضافة تعليق

**Endpoint:** `POST /api/comments`

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "post_id": 1,
  "content": "تعليق رائع!",
  "parent_id": null
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "تم إضافة التعليق بنجاح",
  "data": {
    "id": 1,
    "post_id": 1,
    "user_id": 1,
    "content": "تعليق رائع!",
    "parent_id": null,
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

---

## ❤️ Likes

### إعجاب/إلغاء إعجاب

**Endpoint:** `POST /api/likes/:postId`

**Headers:**
```
Authorization: Bearer {token}
```

**Response (Success - Liked):**
```json
{
  "success": true,
  "message": "تم الإعجاب بالمنشور",
  "data": {
    "isLiked": true
  }
}
```

**Response (Success - Unliked):**
```json
{
  "success": true,
  "message": "تم إلغاء الإعجاب",
  "data": {
    "isLiked": false
  }
}
```

---

## ⭐ Favorites

### إضافة/إزالة من المفضلة

**Endpoint:** `POST /api/favorites/:postId`

**Headers:**
```
Authorization: Bearer {token}
```

**Response (Success - Added):**
```json
{
  "success": true,
  "message": "تم إضافة المنشور للمفضلة",
  "data": {
    "isFavorited": true
  }
}
```

---

### الحصول على المفضلة

**Endpoint:** `GET /api/favorites?page=1&limit=20`

**Headers:**
```
Authorization: Bearer {token}
```

**Response:** نفس بنية قائمة المنشورات

---

## 🔔 Notifications

### الحصول على الإشعارات

**Endpoint:** `GET /api/notifications?page=1&limit=20`

**Headers:**
```
Authorization: Bearer {token}
```

**Response (Success):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "type": "like",
      "content": "أعجب بمنشورك",
      "related_id": 5,
      "is_read": false,
      "created_at": "2024-01-01T00:00:00.000Z",
      "sender_name": "سارة أحمد",
      "sender_image": "https://bucket.s3.region.amazonaws.com/profiles/sara.jpg"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "pages": 3
  }
}
```

---

### تعليم إشعار كمقروء

**Endpoint:** `PUT /api/notifications/:notificationId/read`

**Headers:**
```
Authorization: Bearer {token}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "تم تعليم الإشعار كمقروء"
}
```

---

### تعليم جميع الإشعارات كمقروءة

**Endpoint:** `PUT /api/notifications/read-all`

**Headers:**
```
Authorization: Bearer {token}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "تم تعليم جميع الإشعارات كمقروءة"
}
```

---

## 📦 الصناديق والفئات

### الحصول على جميع الصناديق

```http
GET /api/boxes
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "صندوق التقنية والبرمجة",
      "description": "أحدث الأفكار والمشاريع في عالم التقنية",
      "icon": "code-slash",
      "color": "#3B82F6",
      "posts_count": 45
    }
  ]
}
```

### الحصول على صندوق واحد

```http
GET /api/boxes/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "صندوق التقنية والبرمجة",
    "description": "أحدث الأفكار والمشاريع",
    "categories": [
      {
        "id": 1,
        "name": "برمجة",
        "icon": "code",
        "color": "#3B82F6",
        "posts_count": 20
      }
    ]
  }
}
```

### الحصول على جميع الفئات

```http
GET /api/boxes/categories?boxId=1
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "برمجة",
      "description": "مواضيع البرمجة والتطوير",
      "icon": "code",
      "color": "#3B82F6",
      "box_name": "صندوق التقنية والبرمجة",
      "posts_count": 20
    }
  ]
}
```

### Admin: إنشاء صندوق

```http
POST /api/boxes/admin
```

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "name": "صندوق جديد",
  "description": "وصف الصندوق",
  "icon": "code-slash",
  "color": "#3B82F6",
  "order_index": 1
}
```

### Admin: تحديث صندوق

```http
PUT /api/boxes/admin/:id
```

### Admin: حذف صندوق

```http
DELETE /api/boxes/admin/:id
```

### Admin: إنشاء فئة

```http
POST /api/boxes/admin/categories
```

**Body:**
```json
{
  "name": "فئة جديدة",
  "description": "وصف الفئة",
  "icon": "code",
  "color": "#3B82F6",
  "box_id": 1,
  "order_index": 1
}
```

---

## ⚠️ Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "خطأ في البيانات المدخلة",
  "errors": [
    {
      "field": "phone",
      "message": "رقم الهاتف يجب أن يكون عراقي صحيح"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "غير مصرح لك بالوصول"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "العنصر غير موجود"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "حدث خطأ في الخادم"
}
```

---

## 📌 Notes

- جميع التواريخ بصيغة ISO 8601
- جميع الـ endpoints تتطلب `Authorization` header ماعدا التسجيل والدخول
- الـ pagination يبدأ من صفحة 1
- الحد الأقصى للـ limit هو 100

---

تم إنشاء هذا التوثيق بواسطة فريق Athar 🚀
