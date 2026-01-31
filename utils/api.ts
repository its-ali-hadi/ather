import AsyncStorage from '@react-native-async-storage/async-storage';

// Base URL - يمكن تغييره حسب بيئة التشغيل
const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3000/api'  // للتطوير المحلي
  : 'https://your-production-api.com/api';  // للإنتاج - غير هذا الرابط

// Storage keys
const TOKEN_KEY = '@athar_token';
const USER_KEY = '@athar_user';

// Types
export interface User {
  id: number;
  phone: string;
  name: string;
  email?: string;
  bio?: string;
  profile_image?: string;
  is_verified: boolean;
  role: string;
  created_at: string;
}

export interface Post {
  id: number;
  user_id: number;
  type: 'text' | 'image' | 'video' | 'link';
  title?: string;
  content: string;
  media_url?: string;
  link_url?: string;
  category?: string;
  is_archived: boolean;
  views_count: number;
  created_at: string;
  updated_at: string;
  user_name: string;
  user_image?: string;
  user_verified: boolean;
  likes_count: number;
  comments_count: number;
  is_liked: boolean;
  is_favorited: boolean;
}

export interface Comment {
  id: number;
  post_id: number;
  user_id: number;
  content: string;
  parent_id?: number;
  created_at: string;
  updated_at: string;
  user_name: string;
  user_image?: string;
  user_verified: boolean;
  replies_count?: number;
}

export interface Notification {
  id: number;
  user_id: number;
  type: 'like' | 'comment' | 'follow' | 'mention';
  content: string;
  related_id?: number;
  is_read: boolean;
  created_at: string;
  sender_name?: string;
  sender_image?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  errors?: Array<{ field: string; message: string }>;
}

// API Client Class
class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.loadToken();
  }

  // Load token from storage
  private async loadToken() {
    try {
      this.token = await AsyncStorage.getItem(TOKEN_KEY);
    } catch (error) {
      console.error('Error loading token:', error);
    }
  }

  // Save token to storage
  private async saveToken(token: string) {
    try {
      this.token = token;
      await AsyncStorage.setItem(TOKEN_KEY, token);
    } catch (error) {
      console.error('Error saving token:', error);
    }
  }

  // Remove token from storage
  private async removeToken() {
    try {
      this.token = null;
      await AsyncStorage.removeItem(TOKEN_KEY);
      await AsyncStorage.removeItem(USER_KEY);
    } catch (error) {
      console.error('Error removing token:', error);
    }
  }

  // Make HTTP request
  private async request<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options.headers,
      };

      // Add authorization header if token exists
      if (this.token) {
        headers['Authorization'] = `Bearer ${this.token}`;
      }

      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers,
      });

      const data = await response.json();

      // Handle unauthorized
      if (response.status === 401) {
        await this.removeToken();
      }

      return data;
    } catch (error) {
      console.error('API Request Error:', error);
      return {
        success: false,
        message: 'حدث خطأ في الاتصال بالخادم',
      };
    }
  }

  // GET request
  async get<T = any>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  // POST request
  async post<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PUT request
  async put<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // DELETE request
  async delete<T = any>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // ==================== AUTH ENDPOINTS ====================

  async register(data: {
    phone: string;
    name: string;
    email?: string;
    password: string;
  }): Promise<ApiResponse<{ user: User; token: string }>> {
    const response = await this.post<{ user: User; token: string }>('/auth/register', data);
    if (response.success && response.data?.token) {
      await this.saveToken(response.data.token);
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(response.data.user));
    }
    return response;
  }

  async login(data: {
    phone: string;
    password: string;
  }): Promise<ApiResponse<{ user: User; token: string }>> {
    const response = await this.post<{ user: User; token: string }>('/auth/login', data);
    if (response.success && response.data?.token) {
      await this.saveToken(response.data.token);
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(response.data.user));
    }
    return response;
  }

  async logout(): Promise<void> {
    await this.removeToken();
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    return this.get<User>('/auth/me');
  }

  async updatePassword(data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<ApiResponse> {
    return this.put('/auth/password', data);
  }

  // ==================== USER ENDPOINTS ====================

  async getUserProfile(userId: number): Promise<ApiResponse<User>> {
    return this.get<User>(`/users/${userId}`);
  }

  async updateProfile(data: {
    name: string;
    email?: string;
    bio?: string;
  }): Promise<ApiResponse<User>> {
    return this.put<User>('/users/profile', data);
  }

  async followUser(userId: number): Promise<ApiResponse> {
    return this.post(`/users/${userId}/follow`);
  }

  async unfollowUser(userId: number): Promise<ApiResponse> {
    return this.delete(`/users/${userId}/follow`);
  }

  async getFollowers(userId: number, page = 1, limit = 20): Promise<ApiResponse<User[]>> {
    return this.get<User[]>(`/users/${userId}/followers?page=${page}&limit=${limit}`);
  }

  async getFollowing(userId: number, page = 1, limit = 20): Promise<ApiResponse<User[]>> {
    return this.get<User[]>(`/users/${userId}/following?page=${page}&limit=${limit}`);
  }

  async searchUsers(query: string, page = 1, limit = 20): Promise<ApiResponse<User[]>> {
    return this.get<User[]>(`/users/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);
  }

  // ==================== POST ENDPOINTS ====================

  async getPosts(params?: {
    page?: number;
    limit?: number;
    category?: string;
    type?: string;
  }): Promise<ApiResponse<Post[]>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.category) queryParams.append('category', params.category);
    if (params?.type) queryParams.append('type', params.type);
    
    const query = queryParams.toString();
    return this.get<Post[]>(`/posts${query ? `?${query}` : ''}`);
  }

  async getPost(postId: number): Promise<ApiResponse<Post>> {
    return this.get<Post>(`/posts/${postId}`);
  }

  async getUserPosts(userId: number, page = 1, limit = 20): Promise<ApiResponse<Post[]>> {
    return this.get<Post[]>(`/posts/user/${userId}?page=${page}&limit=${limit}`);
  }

  async createPost(data: {
    type: 'text' | 'image' | 'video' | 'link';
    title?: string;
    content: string;
    media_url?: string;
    link_url?: string;
    category?: string;
  }): Promise<ApiResponse<Post>> {
    return this.post<Post>('/posts', data);
  }

  async updatePost(postId: number, data: {
    title?: string;
    content?: string;
    category?: string;
  }): Promise<ApiResponse<Post>> {
    return this.put<Post>(`/posts/${postId}`, data);
  }

  async deletePost(postId: number): Promise<ApiResponse> {
    return this.delete(`/posts/${postId}`);
  }

  async archivePost(postId: number): Promise<ApiResponse> {
    return this.post(`/posts/${postId}/archive`);
  }

  async searchPosts(query: string, page = 1, limit = 20): Promise<ApiResponse<Post[]>> {
    return this.get<Post[]>(`/posts/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);
  }

  // ==================== COMMENT ENDPOINTS ====================

  async getPostComments(postId: number, page = 1, limit = 20): Promise<ApiResponse<Comment[]>> {
    return this.get<Comment[]>(`/comments/post/${postId}?page=${page}&limit=${limit}`);
  }

  async getCommentReplies(commentId: number, page = 1, limit = 10): Promise<ApiResponse<Comment[]>> {
    return this.get<Comment[]>(`/comments/${commentId}/replies?page=${page}&limit=${limit}`);
  }

  async createComment(data: {
    post_id: number;
    content: string;
    parent_id?: number;
  }): Promise<ApiResponse<Comment>> {
    return this.post<Comment>('/comments', data);
  }

  async updateComment(commentId: number, content: string): Promise<ApiResponse<Comment>> {
    return this.put<Comment>(`/comments/${commentId}`, { content });
  }

  async deleteComment(commentId: number): Promise<ApiResponse> {
    return this.delete(`/comments/${commentId}`);
  }

  // ==================== LIKE ENDPOINTS ====================

  async toggleLike(postId: number): Promise<ApiResponse<{ isLiked: boolean }>> {
    return this.post<{ isLiked: boolean }>(`/likes/${postId}`);
  }

  async getPostLikes(postId: number, page = 1, limit = 20): Promise<ApiResponse<User[]>> {
    return this.get<User[]>(`/likes/${postId}?page=${page}&limit=${limit}`);
  }

  // ==================== FAVORITE ENDPOINTS ====================

  async toggleFavorite(postId: number): Promise<ApiResponse<{ isFavorited: boolean }>> {
    return this.post<{ isFavorited: boolean }>(`/favorites/${postId}`);
  }

  async getFavorites(page = 1, limit = 20): Promise<ApiResponse<Post[]>> {
    return this.get<Post[]>(`/favorites?page=${page}&limit=${limit}`);
  }

  // ==================== NOTIFICATION ENDPOINTS ====================

  async getNotifications(page = 1, limit = 20): Promise<ApiResponse<Notification[]>> {
    return this.get<Notification[]>(`/notifications?page=${page}&limit=${limit}`);
  }

  async markNotificationAsRead(notificationId: number): Promise<ApiResponse> {
    return this.put(`/notifications/${notificationId}/read`);
  }

  async markAllNotificationsAsRead(): Promise<ApiResponse> {
    return this.put('/notifications/read-all');
  }

  async deleteNotification(notificationId: number): Promise<ApiResponse> {
    return this.delete(`/notifications/${notificationId}`);
  }

  // ==================== HELPER METHODS ====================

  async isAuthenticated(): Promise<boolean> {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    return !!token;
  }

  async getStoredUser(): Promise<User | null> {
    try {
      const userStr = await AsyncStorage.getItem(USER_KEY);
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error getting stored user:', error);
      return null;
    }
  }

  setBaseURL(url: string) {
    this.baseURL = url;
  }

  getBaseURL(): string {
    return this.baseURL;
  }
}

// Create and export API instance
const api = new ApiClient(API_BASE_URL);

export default api;