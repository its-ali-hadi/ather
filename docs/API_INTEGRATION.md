# دليل ربط الفرونت اند مع الباكاند

## 📋 المحتويات

1. [الإعداد الأولي](#الإعداد-الأولي)
2. [استخدام API](#استخدام-api)
3. [أمثلة عملية](#أمثلة-عملية)
4. [معالجة الأخطاء](#معالجة-الأخطاء)
5. [نصائح مهمة](#نصائح-مهمة)

---

## الإعداد الأولي

### 1. تغيير رابط الـ API

افتح ملف `utils/api.ts` وغير الرابط:

```typescript
const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3000/api'  // للتطوير المحلي
  : 'https://your-api-url.com/api';  // ضع رابط API الخاص بك هنا
```

### 2. استيراد API في أي ملف

```typescript
import api from '../utils/api';
```

---

## استخدام API

### Authentication (المصادقة)

#### تسجيل مستخدم جديد

```typescript
const response = await api.register({
  phone: '07XXXXXXXXX',
  name: 'اسم المستخدم',
  email: 'user@example.com',  // اختياري
  password: 'password123'
});

if (response.success) {
  // تم التسجيل بنجاح
  const user = response.data?.user;
  const token = response.data?.token;
}
```

#### تسجيل الدخول

```typescript
const response = await api.login({
  phone: '07XXXXXXXXX',
  password: 'password123'
});

if (response.success) {
  // تم تسجيل الدخول بنجاح
  const user = response.data?.user;
}
```

#### تسجيل الخروج

```typescript
await api.logout();
// تم حذف الـ token تلقائياً
```

#### الحصول على المستخدم الحالي

```typescript
const response = await api.getCurrentUser();

if (response.success) {
  const user = response.data;
}
```

#### التحقق من حالة تسجيل الدخول

```typescript
const isLoggedIn = await api.isAuthenticated();

if (isLoggedIn) {
  // المستخدم مسجل دخول
  const user = await api.getStoredUser();
}
```

---

### Posts (المنشورات)

#### الحصول على جميع المنشورات

```typescript
const response = await api.getPosts({
  page: 1,
  limit: 20,
  category: 'tech',  // اختياري
  type: 'text'       // اختياري
});

if (response.success) {
  const posts = response.data;
  const pagination = response.pagination;
}
```

#### الحصول على منشور واحد

```typescript
const response = await api.getPost(postId);

if (response.success) {
  const post = response.data;
}
```

#### إنشاء منشور

```typescript
const response = await api.createPost({
  type: 'text',  // text, image, video, link
  title: 'عنوان المنشور',
  content: 'محتوى المنشور',
  category: 'tech',
  media_url: 'https://...',  // للصور والفيديو
  link_url: 'https://...'    // للروابط
});

if (response.success) {
  const newPost = response.data;
}
```

#### تحديث منشور

```typescript
const response = await api.updatePost(postId, {
  title: 'العنوان الجديد',
  content: 'المحتوى الجديد',
  category: 'tech'
});
```

#### حذف منشور

```typescript
const response = await api.deletePost(postId);

if (response.success) {
  // تم الحذف بنجاح
}
```

#### البحث في المنشورات

```typescript
const response = await api.searchPosts('كلمة البحث', 1, 20);

if (response.success) {
  const results = response.data;
}
```

---

### Likes (الإعجابات)

#### إعجاب/إلغاء إعجاب

```typescript
const response = await api.toggleLike(postId);

if (response.success) {
  const isLiked = response.data?.isLiked;
  console.log(isLiked ? 'تم الإعجاب' : 'تم إلغاء الإعجاب');
}
```

#### الحصول على قائمة الإعجابات

```typescript
const response = await api.getPostLikes(postId, 1, 20);

if (response.success) {
  const users = response.data;  // المستخدمين الذين أعجبوا
}
```

---

### Comments (التعليقات)

#### الحصول على تعليقات منشور

```typescript
const response = await api.getPostComments(postId, 1, 20);

if (response.success) {
  const comments = response.data;
}
```

#### إضافة تعليق

```typescript
const response = await api.createComment({
  post_id: postId,
  content: 'محتوى التعليق',
  parent_id: null  // أو معرف التعليق الأصلي للرد
});

if (response.success) {
  const newComment = response.data;
}
```

#### تحديث تعليق

```typescript
const response = await api.updateComment(commentId, 'المحتوى الجديد');
```

#### حذف تعليق

```typescript
const response = await api.deleteComment(commentId);
```

---

### Favorites (المفضلة)

#### إضافة/إزالة من المفضلة

```typescript
const response = await api.toggleFavorite(postId);

if (response.success) {
  const isFavorited = response.data?.isFavorited;
}
```

#### الحصول على المفضلة

```typescript
const response = await api.getFavorites(1, 20);

if (response.success) {
  const favorites = response.data;
}
```

---

### Users (المستخدمين)

#### الحصول على ملف مستخدم

```typescript
const response = await api.getUserProfile(userId);

if (response.success) {
  const user = response.data;
}
```

#### تحديث الملف الشخصي

```typescript
const response = await api.updateProfile({
  name: 'الاسم الجديد',
  email: 'newemail@example.com',
  bio: 'نبذة عني'
});
```

#### متابعة مستخدم

```typescript
const response = await api.followUser(userId);
```

#### إلغاء متابعة مستخدم

```typescript
const response = await api.unfollowUser(userId);
```

#### البحث عن مستخدمين

```typescript
const response = await api.searchUsers('اسم المستخدم', 1, 20);

if (response.success) {
  const users = response.data;
}
```

---

### Notifications (الإشعارات)

#### الحصول على الإشعارات

```typescript
const response = await api.getNotifications(1, 20);

if (response.success) {
  const notifications = response.data;
}
```

#### تحديد إشعار كمقروء

```typescript
const response = await api.markNotificationAsRead(notificationId);
```

#### تحديد جميع الإشعارات كمقروءة

```typescript
const response = await api.markAllNotificationsAsRead();
```

---

## أمثلة عملية

### مثال كامل: شاشة المنشورات

```typescript
import React, { useState, useEffect } from 'react';
import { View, FlatList, ActivityIndicator, Text } from 'react-native';
import api, { Post } from '../utils/api';

export default function PostsScreen() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const response = await api.getPosts({ page, limit: 20 });
      
      if (response.success && response.data) {
        setPosts(response.data);
      }
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setPage(1);
    loadPosts();
  };

  const handleLike = async (postId: number) => {
    const response = await api.toggleLike(postId);
    
    if (response.success) {
      // تحديث المنشور في القائمة
      setPosts(posts.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              is_liked: response.data?.isLiked || false,
              likes_count: post.likes_count + (response.data?.isLiked ? 1 : -1)
            }
          : post
      ));
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <PostCard 
          post={item} 
          onLike={() => handleLike(item.id)}
        />
      )}
      refreshing={refreshing}
      onRefresh={handleRefresh}
    />
  );
}
```

### مثال: شاشة تسجيل الدخول

```typescript
import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import api from '../utils/api';

export default function LoginScreen({ navigation }) {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!phone || !password) {
      Alert.alert('خطأ', 'يرجى إدخال رقم الهاتف وكلمة المرور');
      return;
    }

    setLoading(true);
    try {
      const response = await api.login({ phone, password });
      
      if (response.success) {
        // الانتقال للشاشة الرئيسية
        navigation.replace('Home');
      } else {
        Alert.alert('خطأ', response.message || 'فشل تسجيل الدخول');
      }
    } catch (error) {
      Alert.alert('خطأ', 'حدث خطأ في الاتصال');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <TextInput
        placeholder="رقم الهاتف"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />
      <TextInput
        placeholder="كلمة المرور"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button 
        title={loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
        onPress={handleLogin}
        disabled={loading}
      />
    </View>
  );
}
```

---

## معالجة الأخطاء

جميع الـ API calls تعيد response بهذا الشكل:

```typescript
{
  success: boolean,
  message?: string,
  data?: any,
  errors?: Array<{ field: string, message: string }>
}
```

### مثال على معالجة الأخطاء:

```typescript
const response = await api.createPost(postData);

if (response.success) {
  // نجحت العملية
  console.log('تم النشر بنجاح!');
} else {
  // فشلت العملية
  if (response.errors) {
    // أخطاء في البيانات المدخلة
    response.errors.forEach(error => {
      console.log(`${error.field}: ${error.message}`);
    });
  } else {
    // خطأ عام
    console.log(response.message);
  }
}
```

---

## نصائح مهمة

### 1. التعامل مع الـ Token

الـ Token يتم حفظه تلقائياً بعد تسجيل الدخول، ولا تحتاج للتعامل معه يدوياً.

### 2. التحقق من تسجيل الدخول

```typescript
// في App.tsx أو الشاشة الرئيسية
useEffect(() => {
  checkAuth();
}, []);

const checkAuth = async () => {
  const isAuth = await api.isAuthenticated();
  
  if (!isAuth) {
    navigation.replace('Login');
  }
};
```

### 3. Pagination

معظم الـ endpoints تدعم pagination:

```typescript
const response = await api.getPosts({ page: 1, limit: 20 });

console.log('الصفحة الحالية:', response.pagination?.page);
console.log('إجمالي العناصر:', response.pagination?.total);
console.log('عدد الصفحات:', response.pagination?.pages);
```

### 4. Loading States

دائماً استخدم loading states:

```typescript
const [loading, setLoading] = useState(false);

const loadData = async () => {
  setLoading(true);
  try {
    const response = await api.getPosts();
    // ...
  } finally {
    setLoading(false);
  }
};
```

### 5. Error Handling

استخدم try-catch للتعامل مع الأخطاء:

```typescript
try {
  const response = await api.createPost(data);
  if (response.success) {
    // نجح
  } else {
    Alert.alert('خطأ', response.message);
  }
} catch (error) {
  Alert.alert('خطأ', 'حدث خطأ في الاتصال');
}
```

### 6. تغيير رابط الـ API

إذا احتجت تغيير رابط الـ API في وقت التشغيل:

```typescript
api.setBaseURL('https://new-api-url.com/api');
```

---

## 🎯 الخلاصة

- استخدم `api.method()` لاستدعاء أي endpoint
- جميع الـ methods تعيد Promise
- تحقق دائماً من `response.success`
- الـ Token يُحفظ ويُرسل تلقائياً
- استخدم TypeScript types للحصول على autocomplete

---

للمزيد من الأمثلة، راجع ملف `utils/api-usage-example.tsx`