const db = require('../config/database');

// Get Dashboard Stats
exports.getStats = async (req, res) => {
  try {
    // Total counts
    const [usersCount] = await db.query('SELECT COUNT(*) as count FROM users');
    const [postsCount] = await db.query('SELECT COUNT(*) as count FROM posts WHERE is_archived = 0');
    const [commentsCount] = await db.query('SELECT COUNT(*) as count FROM comments');
    const [likesCount] = await db.query('SELECT COUNT(*) as count FROM likes');

    // Today's counts
    const today = new Date().toISOString().split('T')[0];
    const [newUsersToday] = await db.query(
      'SELECT COUNT(*) as count FROM users WHERE DATE(created_at) = ?',
      [today]
    );
    const [newPostsToday] = await db.query(
      'SELECT COUNT(*) as count FROM posts WHERE DATE(created_at) = ?',
      [today]
    );

    // Posts by type
    const [postsByType] = await db.query(`
      SELECT type, COUNT(*) as count 
      FROM posts 
      WHERE is_archived = 0 
      GROUP BY type
    `);

    // Posts by category
    const [postsByCategory] = await db.query(`
      SELECT category, COUNT(*) as count 
      FROM posts 
      WHERE is_archived = 0 
      GROUP BY category 
      ORDER BY count DESC 
      LIMIT 5
    `);

    // Recent activity (last 7 days)
    const [recentActivity] = await db.query(`
      SELECT DATE(created_at) as date, COUNT(*) as count 
      FROM posts 
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `);

    res.json({
      success: true,
      data: {
        totalUsers: usersCount[0].count,
        totalPosts: postsCount[0].count,
        totalComments: commentsCount[0].count,
        totalLikes: likesCount[0].count,
        newUsersToday: newUsersToday[0].count,
        newPostsToday: newPostsToday[0].count,
        postsByType: postsByType,
        postsByCategory: postsByCategory,
        recentActivity: recentActivity,
      },
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      message: 'فشل جلب الإحصائيات',
    });
  }
};

// Get All Users
exports.getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const search = req.query.search || '';
    const offset = (page - 1) * limit;

    let query = `
      SELECT 
        u.id, u.phone, u.name, u.email, u.bio, u.profile_image,
        u.is_verified, u.is_banned, u.role, u.created_at,
        COUNT(DISTINCT p.id) as posts_count,
        COUNT(DISTINCT f1.follower_id) as followers_count,
        COUNT(DISTINCT f2.following_id) as following_count
      FROM users u
      LEFT JOIN posts p ON u.id = p.user_id
      LEFT JOIN follows f1 ON u.id = f1.following_id
      LEFT JOIN follows f2 ON u.id = f2.follower_id
    `;

    const params = [];

    if (search) {
      query += ' WHERE u.name LIKE ? OR u.phone LIKE ? OR u.email LIKE ?';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    query += ' GROUP BY u.id ORDER BY u.created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [users] = await db.query(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) as count FROM users';
    const countParams = [];

    if (search) {
      countQuery += ' WHERE name LIKE ? OR phone LIKE ? OR email LIKE ?';
      countParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    const [countResult] = await db.query(countQuery, countParams);
    const total = countResult[0].count;

    res.json({
      success: true,
      data: users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'فشل جلب المستخدمين',
    });
  }
};

// Get User Details
exports.getUserDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const [users] = await db.query(
      `SELECT 
        u.id, u.phone, u.name, u.email, u.bio, u.profile_image,
        u.is_verified, u.is_banned, u.role, u.created_at,
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
      [id]
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
    console.error('Error fetching user details:', error);
    res.status(500).json({
      success: false,
      message: 'فشل جلب تفاصيل المستخدم',
    });
  }
};

// Ban User
exports.banUser = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query('UPDATE users SET is_banned = 1 WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'تم حظر المستخدم بنجاح',
    });
  } catch (error) {
    console.error('Error banning user:', error);
    res.status(500).json({
      success: false,
      message: 'فشل حظر المستخدم',
    });
  }
};

// Unban User
exports.unbanUser = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query('UPDATE users SET is_banned = 0 WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'تم إلغاء حظر المستخدم بنجاح',
    });
  } catch (error) {
    console.error('Error unbanning user:', error);
    res.status(500).json({
      success: false,
      message: 'فشل إلغاء حظر المستخدم',
    });
  }
};

// Delete User
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Delete user's data
    await db.query('DELETE FROM comments WHERE user_id = ?', [id]);
    await db.query('DELETE FROM likes WHERE user_id = ?', [id]);
    await db.query('DELETE FROM favorites WHERE user_id = ?', [id]);
    await db.query('DELETE FROM follows WHERE follower_id = ? OR following_id = ?', [id, id]);
    await db.query('DELETE FROM notifications WHERE user_id = ?', [id]);
    await db.query('DELETE FROM posts WHERE user_id = ?', [id]);
    await db.query('DELETE FROM users WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'تم حذف المستخدم بنجاح',
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      success: false,
      message: 'فشل حذف المستخدم',
    });
  }
};

// Get All Posts
exports.getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const type = req.query.type || '';
    const category = req.query.category || '';
    const search = req.query.search || '';
    const offset = (page - 1) * limit;

    let query = `
      SELECT 
        p.*, 
        u.name as author_name, 
        u.profile_image as author_image,
        COUNT(DISTINCT l.id) as likes_count,
        COUNT(DISTINCT c.id) as comments_count
      FROM posts p
      LEFT JOIN users u ON p.user_id = u.id
      LEFT JOIN likes l ON p.id = l.post_id
      LEFT JOIN comments c ON p.id = c.post_id
      WHERE 1=1
    `;

    const params = [];

    if (type) {
      query += ' AND p.type = ?';
      params.push(type);
    }

    if (category) {
      query += ' AND p.category = ?';
      params.push(category);
    }

    if (search) {
      query += ' AND (p.title LIKE ? OR p.content LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ' GROUP BY p.id ORDER BY p.created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [posts] = await db.query(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) as count FROM posts WHERE 1=1';
    const countParams = [];

    if (type) {
      countQuery += ' AND type = ?';
      countParams.push(type);
    }

    if (category) {
      countQuery += ' AND category = ?';
      countParams.push(category);
    }

    if (search) {
      countQuery += ' AND (title LIKE ? OR content LIKE ?)';
      countParams.push(`%${search}%`, `%${search}%`);
    }

    const [countResult] = await db.query(countQuery, countParams);
    const total = countResult[0].count;

    res.json({
      success: true,
      data: posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({
      success: false,
      message: 'فشل جلب المنشورات',
    });
  }
};

// Delete Post
exports.deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    // Delete post's data
    await db.query('DELETE FROM comments WHERE post_id = ?', [id]);
    await db.query('DELETE FROM likes WHERE post_id = ?', [id]);
    await db.query('DELETE FROM favorites WHERE post_id = ?', [id]);
    await db.query('DELETE FROM posts WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'تم حذف المنشور بنجاح',
    });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({
      success: false,
      message: 'فشل حذف المنشور',
    });
  }
};

// Get All Comments
exports.getComments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const search = req.query.search || '';
    const offset = (page - 1) * limit;

    let query = `
      SELECT 
        c.*, 
        u.name as author_name, 
        u.profile_image as author_image,
        p.title as post_title
      FROM comments c
      LEFT JOIN users u ON c.user_id = u.id
      LEFT JOIN posts p ON c.post_id = p.id
      WHERE 1=1
    `;

    const params = [];

    if (search) {
      query += ' AND c.content LIKE ?';
      params.push(`%${search}%`);
    }

    query += ' ORDER BY c.created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [comments] = await db.query(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) as count FROM comments WHERE 1=1';
    const countParams = [];

    if (search) {
      countQuery += ' AND content LIKE ?';
      countParams.push(`%${search}%`);
    }

    const [countResult] = await db.query(countQuery, countParams);
    const total = countResult[0].count;

    res.json({
      success: true,
      data: comments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({
      success: false,
      message: 'فشل جلب التعليقات',
    });
  }
};

// Delete Comment
exports.deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query('DELETE FROM comments WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'تم حذف التعليق بنجاح',
    });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({
      success: false,
      message: 'فشل حذف التعليق',
    });
  }
};

// Send Notification
exports.sendNotification = async (req, res) => {
  try {
    const { userIds, title, body, data } = req.body;

    if (!title || !body) {
      return res.status(400).json({
        success: false,
        message: 'العنوان والمحتوى مطلوبان',
      });
    }

    let targetUsers = [];

    if (userIds === 'all') {
      // Send to all users
      const [users] = await db.query('SELECT id FROM users WHERE push_token IS NOT NULL');
      targetUsers = users.map((u) => u.id);
    } else if (Array.isArray(userIds)) {
      targetUsers = userIds;
    } else {
      return res.status(400).json({
        success: false,
        message: 'معرفات المستخدمين غير صحيحة',
      });
    }

    // Create notifications in database
    const notifications = targetUsers.map((userId) => [
      userId,
      'admin',
      title,
      body,
      JSON.stringify(data || {}),
    ]);

    if (notifications.length > 0) {
      await db.query(
        'INSERT INTO notifications (user_id, type, title, body, data) VALUES ?',
        [notifications]
      );
    }

    // TODO: Send push notifications using Expo Push Notifications
    // This requires implementing the push notification service

    res.json({
      success: true,
      message: `تم إرسال الإشعار إلى ${targetUsers.length} مستخدم`,
    });
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).json({
      success: false,
      message: 'فشل إرسال الإشعار',
    });
  }
};

// Get Recent Users
exports.getRecentUsers = async (req, res) => {
  try {
    const [users] = await db.query(
      `SELECT id, name, profile_image, created_at 
       FROM users 
       ORDER BY created_at DESC 
       LIMIT 10`
    );

    res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error('Error fetching recent users:', error);
    res.status(500).json({
      success: false,
      message: 'فشل جلب المستخدمين الجدد',
    });
  }
};

// Get Recent Posts
exports.getRecentPosts = async (req, res) => {
  try {
    const [posts] = await db.query(
      `SELECT p.id, p.title, p.type, p.created_at, u.name as author_name
       FROM posts p
       LEFT JOIN users u ON p.user_id = u.id
       ORDER BY p.created_at DESC 
       LIMIT 10`
    );

    res.json({
      success: true,
      data: posts,
    });
  } catch (error) {
    console.error('Error fetching recent posts:', error);
    res.status(500).json({
      success: false,
      message: 'فشل جلب المنشورات الجديدة',
    });
  }
};