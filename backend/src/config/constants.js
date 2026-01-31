module.exports = {
  // Post Types
  POST_TYPES: {
    TEXT: 'text',
    IMAGE: 'image',
    VIDEO: 'video',
    LINK: 'link'
  },

  // User Roles
  USER_ROLES: {
    USER: 'user',
    ADMIN: 'admin'
  },

  // Pagination
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,

  // File Upload
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_VIDEO_TYPES: ['video/mp4', 'video/quicktime', 'video/x-msvideo'],

  // Response Messages
  MESSAGES: {
    SUCCESS: 'تمت العملية بنجاح',
    ERROR: 'حدث خطأ، يرجى المحاولة مرة أخرى',
    UNAUTHORIZED: 'غير مصرح لك بالوصول',
    NOT_FOUND: 'العنصر غير موجود',
    VALIDATION_ERROR: 'خطأ في البيانات المدخلة'
  }
};