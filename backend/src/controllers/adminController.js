const { pool } = require('../config/database');

// Get dashboard statistics
exports.getDashboardStats = async (req, res, next) => {
  try {
    // Total users
    const [totalUsersResult] = await pool.query('SELECT COUNT(*) as count FROM users');
    const totalUsers = totalUsersResult[0].count;

    // Total posts
    const [totalPostsResult] = await pool.query('SELECT COUNT(*) as count FROM posts WHERE is_archived = 0');
    const totalPosts = totalPostsResult[0].count;

    // Total comments
    const [totalCommentsResult] = await pool.query('SELECT COUNT(*) as count FROM comments');
    const totalComments = totalCommentsResult[0].count;

    // Total likes
    const [totalLikesResult] = await pool.query('SELECT COUNT(*) as count FROM likes');
    const totalLikes = totalLikesResult[0].count;

    // New users today
    const [newUsersTodayResult] = await pool.query(
      'SELECT COUNT(*) as count FROM users WHERE DATE(created_at) = CURDATE()'
    );
    const newUsersToday = newUsersTodayResult[0].count;

    // New posts today
    const [newPostsTodayResult] = await pool.query(
      'SELECT COUNT(*) as count FROM posts WHERE DATE(created_at) = CURDATE()'
    );
    const newPostsToday = newPostsTodayResult[0].count;

    // Active users (users who posted or commented in last 7 days)
    const [activeUsersResult] = await pool.query(`
      SELECT COUNT(DISTINCT user_id) as count FROM (
        SELECT user_id FROM posts WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
        UNION
        SELECT user_id FROM comments WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
      ) as active
    `);
    const activeUsers = activeUsersResult[0].count;

    // Recent activity
    const [recentPosts] = await pool.query(`
      SELECT p.id, p.title, p.type, p.created_at, u.name as user_name
      FROM posts p
      JOIN users u ON p.user_id = u.id
      ORDER BY p.created_at DESC
      LIMIT 5
    `);

    const [recentUsers] = await pool.query(`
      SELECT id, name, created_at
      FROM users
      ORDER BY created_at DESC
      LIMIT 5
    `);

    const recentActivity = [
      ...recentPosts.map(post => ({
        id: post.id,
        type: 'post',
        title: `منشور جديد: ${post.title || 'بدون عنوان'}`,
        subtitle: `بواسطة ${post.user_name}`,
        time: formatTimeAgo(post.created_at),
      })),
      ...recentUsers.map(user => ({
        id: user.id,
        type: 'user',
        title: 'مستخدم جديد',
        subtitle: user.name,
        time: formatTimeAgo(user.created_at),
      })),
    ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 10);

    res.json({
      success: true,
      data: {
        stats: {
          totalUsers,
          totalPosts,
          totalComments,
          totalLikes,
          newUsersToday,
          newPostsToday,
          activeUsers,
        },
        recentActivity,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get all users with pagination
exports.getAllUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';

    let query = `
      SELECT u.id, u.phone, u.name, u.email, u.bio, u.profile_image, 
             u.is_verified, u.role, u.created_at,
             COUNT(DISTINCT p.id) as posts_count,
             COUNT(DISTINCT f.follower_id) as followers_count
      FROM users u
      LEFT JOIN posts p ON u.id = p.user_id
      LEFT JOIN follows f ON u.id = f.following_id
    `;

    const params = [];

    if (search) {
      query += ' WHERE u.name LIKE ? OR u.phone LIKE ? OR u.email LIKE ?';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    query += ' GROUP BY u.id ORDER BY u.created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [users] = await pool.query(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM users';
    const countParams = [];

    if (search) {
      countQuery += ' WHERE name LIKE ? OR phone LIKE ? OR email LIKE ?';
      countParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    const [countResult] = await pool.query(countQuery, countParams);
    const total = countResult[0].total;

    res.json({
      success: true,
      data: users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get user details
exports.getUserDetails = async (req, res, next) => {
  try {
    const userId = req.params.id;

    const [users] = await pool.query(
      `SELECT u.*, 
              COUNT(DISTINCT p.id) as posts_count,
              COUNT(DISTINCT c.id) as comments_count,
              COUNT(DISTINCT l.id) as likes_count,
              COUNT(DISTINCT f1.follower_id) as followers_count,
              COUNT(DISTINCT f2.following_id) as following_count
       FROM users u
       LEFT JOIN posts p ON u.id = p.user_id
       LEFT JOIN comments c ON u.id = c.user_id
       LEFT JOIN likes l ON u.id = l.user_id
       LEFT JOIN follows f1 ON u.id = f1.following_id
       LEFT JOIN follows f2 ON u.id = f2.follower_id
       WHERE u.id = ?
       GROUP BY u.id`,
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'المستخدم غير موجود',
      });
    }

    res.json({
      success: true,
      data: users[0],
    });
  } catch (error) {
    next(error);
  }
};

// Verify user
exports.verifyUser = async (req, res, next) => {
  try {
    const userId = req.params.id;

    await pool.query('UPDATE users SET is_verified = 1 WHERE id = ?', [userId]);

    res.json({
      success: true,
      message: 'تم توثيق المستخدم بنجاح',
    });
  } catch (error) {
    next(error);
  }
};

// Update user role
exports.updateUserRole = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const { role } = req.body;

    if (!['user', 'admin', 'moderator'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'الدور غير صحيح',
      });
    }

    await pool.query('UPDATE users SET role = ? WHERE id = ?', [role, userId]);

    res.json({
      success: true,
      message: 'تم تحديث دور المستخدم بنجاح',
    });
  } catch (error) {
    next(error);
  }
};

// Delete user
exports.deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.id;

    // Don't allow deleting yourself
    if (userId == req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'لا يمكنك حذف حسابك الخاص',
      });
    }

    await pool.query('DELETE FROM users WHERE id = ?', [userId]);

    res.json({
      success: true,
      message: 'تم حذف المستخدم بنجاح',
    });
  } catch (error) {
    next(error);
  }
};

// Ban user
exports.banUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const { reason } = req.body;

    await pool.query('UPDATE users SET is_banned = 1, ban_reason = ? WHERE id = ?', [
      reason || null,
      userId,
    ]);

    res.json({
      success: true,
      message: 'تم حظر المستخدم بنجاح',
    });
  } catch (error) {
    next(error);
  }
};

// Unban user
exports.unbanUser = async (req, res, next) => {
  try {
    const userId = req.params.id;

    await pool.query('UPDATE users SET is_banned = 0, ban_reason = NULL WHERE id = ?', [userId]);

    res.json({
      success: true,
      message: 'تم إلغاء حظر المستخدم بنجاح',
    });
  } catch (error) {
    next(error);
  }
};

// Get all posts
exports.getAllPosts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const [posts] = await pool.query(
      `SELECT p.*, u.name as user_name, u.profile_image as user_image,
              COUNT(DISTINCT l.id) as likes_count,
              COUNT(DISTINCT c.id) as comments_count
       FROM posts p
       JOIN users u ON p.user_id = u.id
       LEFT JOIN likes l ON p.id = l.post_id
       LEFT JOIN comments c ON p.id = c.post_id
       GROUP BY p.id
       ORDER BY p.created_at DESC
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );

    const [countResult] = await pool.query('SELECT COUNT(*) as total FROM posts');
    const total = countResult[0].total;

    res.json({
      success: true,
      data: posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// Delete post
exports.deletePost = async (req, res, next) => {
  try {
    const postId = req.params.id;

    await pool.query('DELETE FROM posts WHERE id = ?', [postId]);

    res.json({
      success: true,
      message: 'تم حذف المنشور بنجاح',
    });
  } catch (error) {
    next(error);
  }
};

// Feature post
exports.featurePost = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const { featured } = req.body;

    await pool.query('UPDATE posts SET is_featured = ? WHERE id = ?', [featured ? 1 : 0, postId]);

    res.json({
      success: true,
      message: featured ? 'تم تمييز المنشور بنجاح' : 'تم إلغاء تمييز المنشور',
    });
  } catch (error) {
    next(error);
  }
};

// Get all reports (placeholder)
exports.getAllReports = async (req, res, next) => {
  try {
    // This would require a reports table
    res.json({
      success: true,
      data: [],
      message: 'ميزة البلاغات قيد التطوير',
    });
  } catch (error) {
    next(error);
  }
};

// Resolve report (placeholder)
exports.resolveReport = async (req, res, next) => {
  try {
    res.json({
      success: true,
      message: 'ميزة البلاغات قيد التطوير',
    });
  } catch (error) {
    next(error);
  }
};

// Get settings (placeholder)
exports.getSettings = async (req, res, next) => {
  try {
    res.json({
      success: true,
      data: {},
      message: 'ميزة الإعدادات قيد التطوير',
    });
  } catch (error) {
    next(error);
  }
};

// Update settings (placeholder)
exports.updateSettings = async (req, res, next) => {
  try {
    res.json({
      success: true,
      message: 'ميزة الإعدادات قيد التطوير',
    });
  } catch (error) {
    next(error);
  }
};

// Helper function to format time ago
function formatTimeAgo(date) {
  const now = new Date();
  const diff = now - new Date(date);
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'الآن';
  if (minutes < 60) return `منذ ${minutes} دقيقة`;
  if (hours < 24) return `منذ ${hours} ساعة`;
  return `منذ ${days} يوم`;
}