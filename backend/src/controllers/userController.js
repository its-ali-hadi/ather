const { pool } = require('../config/database');

// Get user profile
exports.getUserProfile = async (req, res, next) => {
  try {
    const userId = req.params.userId;

    const [users] = await pool.query(
      `SELECT 
        u.id, u.phone, u.name, u.email, u.bio, u.profile_image, u.is_verified, u.role, u.created_at,
        (SELECT COUNT(*) FROM posts WHERE user_id = u.id AND is_archived = 0) as posts_count,
        (SELECT COUNT(*) FROM follows WHERE followed_id = u.id) as followers_count,
        (SELECT COUNT(*) FROM follows WHERE follower_id = u.id) as following_count,
        (SELECT COUNT(*) > 0 FROM follows WHERE follower_id = ? AND followed_id = u.id) as is_following
      FROM users u
      WHERE u.id = ?`,
      [req.user.id, userId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'المستخدم غير موجود'
      });
    }

    res.json({
      success: true,
      data: users[0]
    });
  } catch (error) {
    next(error);
  }
};

// Update user profile
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, email, bio, profile_image } = req.body;
    const userId = req.user.id;

    // Update user
    await pool.query(
      'UPDATE users SET name = ?, email = ?, bio = ?, profile_image = ? WHERE id = ?',
      [name, email, bio, profile_image, userId]
    );

    // Get updated user
    const [users] = await pool.query(
      'SELECT id, phone, name, email, bio, profile_image, is_verified, role, created_at FROM users WHERE id = ?',
      [userId]
    );

    res.json({
      success: true,
      message: 'تم تحديث الملف الشخصي بنجاح',
      data: users[0]
    });
  } catch (error) {
    next(error);
  }
};

// Follow user
exports.followUser = async (req, res, next) => {
  try {
    const followerId = req.user.id;
    const followedId = req.params.userId;

    if (followerId === parseInt(followedId)) {
      return res.status(400).json({
        success: false,
        message: 'لا يمكنك متابعة نفسك'
      });
    }

    // Check if already following
    const [existing] = await pool.query(
      'SELECT id FROM follows WHERE follower_id = ? AND followed_id = ?',
      [followerId, followedId]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'أنت تتابع هذا المستخدم بالفعل'
      });
    }

    // Create follow
    await pool.query(
      'INSERT INTO follows (follower_id, followed_id) VALUES (?, ?)',
      [followerId, followedId]
    );

    // Create notification
    await pool.query(
      'INSERT INTO notifications (user_id, type, content, related_id) VALUES (?, ?, ?, ?)',
      [followedId, 'follow', 'بدأ بمتابعتك', followerId]
    );

    res.json({
      success: true,
      message: 'تمت المتابعة بنجاح'
    });
  } catch (error) {
    next(error);
  }
};

// Unfollow user
exports.unfollowUser = async (req, res, next) => {
  try {
    const followerId = req.user.id;
    const followedId = req.params.userId;

    await pool.query(
      'DELETE FROM follows WHERE follower_id = ? AND followed_id = ?',
      [followerId, followedId]
    );

    res.json({
      success: true,
      message: 'تم إلغاء المتابعة بنجاح'
    });
  } catch (error) {
    next(error);
  }
};

// Get followers
exports.getFollowers = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const [followers] = await pool.query(
      `SELECT 
        u.id, u.name, u.profile_image, u.bio, u.is_verified,
        (SELECT COUNT(*) > 0 FROM follows WHERE follower_id = ? AND followed_id = u.id) as is_following
      FROM users u
      INNER JOIN follows f ON u.id = f.follower_id
      WHERE f.followed_id = ?
      ORDER BY f.created_at DESC
      LIMIT ? OFFSET ?`,
      [req.user.id, userId, limit, offset]
    );

    const [countResult] = await pool.query(
      'SELECT COUNT(*) as total FROM follows WHERE followed_id = ?',
      [userId]
    );

    res.json({
      success: true,
      data: followers,
      pagination: {
        page,
        limit,
        total: countResult[0].total,
        pages: Math.ceil(countResult[0].total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get following
exports.getFollowing = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const [following] = await pool.query(
      `SELECT 
        u.id, u.name, u.profile_image, u.bio, u.is_verified,
        (SELECT COUNT(*) > 0 FROM follows WHERE follower_id = ? AND followed_id = u.id) as is_following
      FROM users u
      INNER JOIN follows f ON u.id = f.followed_id
      WHERE f.follower_id = ?
      ORDER BY f.created_at DESC
      LIMIT ? OFFSET ?`,
      [req.user.id, userId, limit, offset]
    );

    const [countResult] = await pool.query(
      'SELECT COUNT(*) as total FROM follows WHERE follower_id = ?',
      [userId]
    );

    res.json({
      success: true,
      data: following,
      pagination: {
        page,
        limit,
        total: countResult[0].total,
        pages: Math.ceil(countResult[0].total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// Search users
exports.searchUsers = async (req, res, next) => {
  try {
    const query = req.query.q || '';
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const searchPattern = `%${query}%`;

    const [users] = await pool.query(
      `SELECT 
        u.id, u.name, u.profile_image, u.bio, u.is_verified,
        (SELECT COUNT(*) FROM follows WHERE followed_id = u.id) as followers_count,
        (SELECT COUNT(*) > 0 FROM follows WHERE follower_id = ? AND followed_id = u.id) as is_following
      FROM users u
      WHERE u.name LIKE ? OR u.phone LIKE ?
      ORDER BY followers_count DESC
      LIMIT ? OFFSET ?`,
      [req.user.id, searchPattern, searchPattern, limit, offset]
    );

    const [countResult] = await pool.query(
      'SELECT COUNT(*) as total FROM users WHERE name LIKE ? OR phone LIKE ?',
      [searchPattern, searchPattern]
    );

    res.json({
      success: true,
      data: users,
      pagination: {
        page,
        limit,
        total: countResult[0].total,
        pages: Math.ceil(countResult[0].total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};