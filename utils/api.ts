const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

let authToken: string | null = null;

const api = {
  // Set auth token
  setAuthToken(token: string | null) {
    authToken = token;
  },

  // Helper function for API calls
  async request(endpoint: string, options: RequestInit = {}) {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'حدث خطأ في الاتصال');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  // Auth endpoints
  async sendRegistrationOTP(phone: string) {
    return this.request('/auth/send-registration-otp', {
      method: 'POST',
      body: JSON.stringify({ phone }),
    });
  },

  async register(data: {
    phone: string;
    name: string;
    orderId: string;
    code: string;
  }) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async sendLoginOTP(phone: string) {
    return this.request('/auth/send-login-otp', {
      method: 'POST',
      body: JSON.stringify({ phone }),
    });
  },

  async loginWithOTP(data: { phone: string; orderId: string; code: string }) {
    return this.request('/auth/login-otp', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async login(phone: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ phone, password }),
    });
  },

  async getCurrentUser() {
    return this.request('/auth/me');
  },

  async updatePassword(currentPassword: string, newPassword: string) {
    return this.request('/auth/password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  },

  async savePushToken(pushToken: string) {
    return this.request('/auth/push-token', {
      method: 'POST',
      body: JSON.stringify({ pushToken }),
    });
  },

  // User endpoints
  async getUserProfile(userId: string) {
    return this.request(`/users/${userId}`);
  },

  async updateProfile(data: {
    name: string;
    email?: string;
    bio?: string;
    profile_image?: string;
  }) {
    return this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async followUser(userId: string) {
    return this.request(`/users/${userId}/follow`, {
      method: 'POST',
    });
  },

  async unfollowUser(userId: string) {
    return this.request(`/users/${userId}/follow`, {
      method: 'DELETE',
    });
  },

  async getFollowers(userId: string, page = 1, limit = 20) {
    return this.request(`/users/${userId}/followers?page=${page}&limit=${limit}`);
  },

  async getFollowing(userId: string, page = 1, limit = 20) {
    return this.request(`/users/${userId}/following?page=${page}&limit=${limit}`);
  },

  async searchUsers(query: string, page = 1, limit = 20) {
    return this.request(`/users/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);
  },

  // Posts endpoints
  async getPosts(params: {
    page?: number;
    limit?: number;
    category?: string;
    type?: string;
  } = {}) {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.category) queryParams.append('category', params.category);
    if (params.type) queryParams.append('type', params.type);

    return this.request(`/posts?${queryParams.toString()}`);
  },

  async getPost(postId: string) {
    return this.request(`/posts/${postId}`);
  },

  async createPost(data: {
    type: 'text' | 'image' | 'video' | 'link';
    title: string;
    content: string;
    media_url?: string;
    link_url?: string;
    category: string;
    is_private?: boolean;
  }) {
    return this.request('/posts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updatePost(postId: string, data: {
    title?: string;
    content?: string;
    category?: string;
  }) {
    return this.request(`/posts/${postId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deletePost(postId: string) {
    return this.request(`/posts/${postId}`, {
      method: 'DELETE',
    });
  },

  async archivePost(postId: string) {
    return this.request(`/posts/${postId}/archive`, {
      method: 'POST',
    });
  },

  async searchPosts(query: string, page = 1, limit = 20) {
    return this.request(`/posts/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);
  },

  async getUserPosts(userId: string, page = 1, limit = 20) {
    return this.request(`/posts/user/${userId}?page=${page}&limit=${limit}`);
  },

  async getMyPosts(page = 1, limit = 20) {
    return this.request(`/posts/my?page=${page}&limit=${limit}`);
  },

  async getArchivedPosts(page = 1, limit = 20) {
    return this.request(`/posts/archived?page=${page}&limit=${limit}`);
  },

  async getPrivatePosts(page = 1, limit = 20) {
    return this.request(`/posts/my/private?page=${page}&limit=${limit}`);
  },

  async publishPost(postId: string) {
    return this.request(`/posts/${postId}/publish`, {
      method: 'POST',
    });
  },

  // Comments endpoints
  async getComments(postId: string, page = 1, limit = 20) {
    return this.request(`/comments/post/${postId}?page=${page}&limit=${limit}`);
  },

  async createComment(data: {
    post_id: number;
    content: string;
    parent_id?: number;
  }) {
    return this.request('/comments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateComment(commentId: string, content: string) {
    return this.request(`/comments/${commentId}`, {
      method: 'PUT',
      body: JSON.stringify({ content }),
    });
  },

  async deleteComment(commentId: string) {
    return this.request(`/comments/${commentId}`, {
      method: 'DELETE',
    });
  },

  // Likes endpoints
  async toggleLike(postId: string) {
    return this.request(`/likes/${postId}`, {
      method: 'POST',
    });
  },

  // Favorites endpoints
  async toggleFavorite(postId: string) {
    return this.request(`/favorites/${postId}`, {
      method: 'POST',
    });
  },

  async getFavorites(page = 1, limit = 20) {
    return this.request(`/favorites?page=${page}&limit=${limit}`);
  },

  // Notifications endpoints
  async getNotifications(page = 1, limit = 20) {
    return this.request(`/notifications?page=${page}&limit=${limit}`);
  },

  async markNotificationAsRead(notificationId: string) {
    return this.request(`/notifications/${notificationId}/read`, {
      method: 'PUT',
    });
  },

  async markAllNotificationsAsRead() {
    return this.request('/notifications/read-all', {
      method: 'PUT',
    });
  },

  async getUnreadNotificationsCount() {
    return this.request('/notifications/unread-count');
  },
};

export default api;
