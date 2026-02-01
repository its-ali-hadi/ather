/**
 * أمثلة على استخدام API في الفرونت اند
 * 
 * هذا الملف يحتوي على أمثلة توضيحية فقط
 * يمكنك نسخ الأمثلة واستخدامها في screens الخاصة بك
 */

import { useState, useEffect } from 'react';
import api, { Post, User, Comment } from './api';

// ==================== مثال 1: تسجيل الدخول ====================
export function LoginExample() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await api.login({ phone, password });
      
      if (response.success) {
        console.log('تم تسجيل الدخول بنجاح!');
        console.log('المستخدم:', response.data?.user);
        // يمكنك الآن الانتقال للشاشة الرئيسية
      } else {
        console.error('خطأ:', response.message);
      }
    } catch (error) {
      console.error('خطأ في تسجيل الدخول:', error);
    } finally {
      setLoading(false);
    }
  };

  return null; // مثال فقط
}

// ==================== مثال 2: تسجيل مستخدم جديد ====================
export function RegisterExample() {
  const handleRegister = async () => {
    const response = await api.register({
      phone: '07XXXXXXXXX',
      name: 'اسم المستخدم',
      email: 'user@example.com',
      password: 'password123'
    });

    if (response.success) {
      console.log('تم إنشاء الحساب بنجاح!');
      // Token تم حفظه تلقائياً
    }
  };

  return null;
}

// ==================== مثال 3: عرض المنشورات ====================
export function PostsListExample() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    loadPosts();
  }, [page]);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const response = await api.getPosts({ page, limit: 20 });
      
      if (response.success && response.data) {
        setPosts(response.data);
        console.log('عدد المنشورات:', response.pagination?.total);
      }
    } catch (error) {
      console.error('خطأ في تحميل المنشورات:', error);
    } finally {
      setLoading(false);
    }
  };

  return null;
}

// ==================== مثال 4: إنشاء منشور ====================
export function CreatePostExample() {
  const handleCreatePost = async () => {
    const response = await api.createPost({
      type: 'text',
      title: 'عنوان المنشور',
      content: 'محتوى المنشور هنا...',
      category: 'tech'
    });

    if (response.success) {
      console.log('تم نشر المنشور بنجاح!');
      console.log('المنشور:', response.data);
    }
  };

  return null;
}

// ==================== مثال 5: الإعجاب بمنشور ====================
export function LikePostExample() {
  const handleLike = async (postId: number) => {
    const response = await api.toggleLike(postId);
    
    if (response.success) {
      const isLiked = response.data?.isLiked;
      console.log(isLiked ? 'تم الإعجاب' : 'تم إلغاء الإعجاب');
    }
  };

  return null;
}

// ==================== مثال 6: إضافة تعليق ====================
export function AddCommentExample() {
  const handleAddComment = async (postId: number, content: string) => {
    const response = await api.createComment({
      post_id: postId,
      content: content
    });

    if (response.success) {
      console.log('تم إضافة التعليق بنجاح!');
      console.log('التعليق:', response.data);
    }
  };

  return null;
}

// ==================== مثال 7: عرض ملف مستخدم ====================
export function UserProfileExample() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserProfile(1); // معرف المستخدم
  }, []);

  const loadUserProfile = async (userId: number) => {
    setLoading(true);
    try {
      const response = await api.getUserProfile(userId);
      
      if (response.success && response.data) {
        setUser(response.data);
      }
    } catch (error) {
      console.error('خطأ في تحميل الملف الشخصي:', error);
    } finally {
      setLoading(false);
    }
  };

  return null;
}

// ==================== مثال 8: متابعة مستخدم ====================
export function FollowUserExample() {
  const handleFollow = async (userId: number) => {
    const response = await api.followUser(userId);
    
    if (response.success) {
      console.log('تمت المتابعة بنجاح!');
    }
  };

  const handleUnfollow = async (userId: number) => {
    const response = await api.unfollowUser(userId);
    
    if (response.success) {
      console.log('تم إلغاء المتابعة بنجاح!');
    }
  };

  return null;
}

// ==================== مثال 9: البحث ====================
export function SearchExample() {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<Post[]>([]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    const response = await api.searchPosts(searchQuery);
    
    if (response.success && response.data) {
      setResults(response.data);
      console.log('عدد النتائج:', response.data.length);
    }
  };

  return null;
}

// ==================== مثال 10: الإشعارات ====================
export function NotificationsExample() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    const response = await api.getNotifications();
    
    if (response.success && response.data) {
      setNotifications(response.data);
      // حساب عدد الإشعارات غير المقروءة
      const unread = response.data.filter((n: any) => !n.is_read).length;
      setUnreadCount(unread);
    }
  };

  const markAsRead = async (notificationId: number) => {
    const response = await api.markNotificationAsRead(notificationId);
    
    if (response.success) {
      // تحديث القائمة
      loadNotifications();
    }
  };

  return null;
}

// ==================== مثال 11: المفضلة ====================
export function FavoritesExample() {
  const [favorites, setFavorites] = useState<Post[]>([]);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    const response = await api.getFavorites();
    
    if (response.success && response.data) {
      setFavorites(response.data);
    }
  };

  const toggleFavorite = async (postId: number) => {
    const response = await api.toggleFavorite(postId);
    
    if (response.success) {
      const isFavorited = response.data?.isFavorited;
      console.log(isFavorited ? 'تمت الإضافة للمفضلة' : 'تمت الإزالة من المفضلة');
      // تحديث القائمة
      loadFavorites();
    }
  };

  return null;
}

// ==================== مثال 12: تحديث الملف الشخصي ====================
export function UpdateProfileExample() {
  const handleUpdateProfile = async () => {
    const response = await api.updateProfile({
      name: 'الاسم الجديد',
      email: 'newemail@example.com',
      bio: 'نبذة عني الجديدة'
    });

    if (response.success) {
      console.log('تم تحديث الملف الشخصي بنجاح!');
      console.log('البيانات المحدثة:', response.data);
    }
  };

  return null;
}

// ==================== مثال 13: تسجيل الخروج ====================
export function LogoutExample() {
  const handleLogout = async () => {
    await api.logout();
    console.log('تم تسجيل الخروج بنجاح!');
    // يمكنك الآن الانتقال لشاشة تسجيل الدخول
  };

  return null;
}

// ==================== مثال 14: التحقق من حالة تسجيل الدخول ====================
export function CheckAuthExample() {
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const isAuth = await api.isAuthenticated();
    
    if (isAuth) {
      console.log('المستخدم مسجل دخول');
      
      // الحصول على بيانات المستخدم المحفوظة
      const user = await api.getStoredUser();
      console.log('المستخدم:', user);
    } else {
      console.log('المستخدم غير مسجل دخول');
    }
  };

  return null;
}

// ==================== مثال 15: تغيير رابط الـ API ====================
export function ChangeAPIURLExample() {
  // في حالة الإنتاج، يمكنك تغيير رابط الـ API
  const setupProductionAPI = () => {
    api.setBaseURL('https://your-production-api.com/api');
    console.log('تم تغيير رابط الـ API إلى:', api.getBaseURL());
  };

  return null;
}