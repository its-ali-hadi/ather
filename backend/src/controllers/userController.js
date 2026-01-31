const { pool } = require('../config/database');

// Get user profile
exports.getUserProfile = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const currentUserId = req.user?.id;

    // Get user info
    const [users] = await pool.query(
      'SELECT id, phone, name, email, bio, profile_image, is_verified, created_at FROM users WHERE id = ?',
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'المستخدم غير موجود'
      });
    }

    const user = users[0];

    // Get posts count
    const [postsCount] = await pool.query(
      'SELECT COUNT(*) as count FROM posts WHERE user_id = ? AND is_archived = FALSE',
      [userId]
    );

    // Get followers count
    const [followersCount] = await pool.query(
      'SELECT COUNT(*) as count FROM follows WHERE following_id = ?',
      [userId]
    );

    // Get following count
    const [followingCount] = await pool.query(
      'SELECT COUNT(*) as count FROM follows WHERE follower_id = ?',
      [userId]
    );

    // Check if current user follows this user
    let isFollowing = false;
    if (currentUserId) {
      const [followCheck] = await pool.query(
        'SELECT id FROM follows WHERE follower_id = ? AND following_id = ?',
        [currentUserId, userId]
      );
      isFollowing = followCheck.length > 0;
    }

    res.json({
      success: true,
      data: {
        ...user,
        stats: {
          posts: postsCount[0].count,
          followers: followersCount[0].count,
          following: followingCount[0].count
        },
        isFollowing
      }
    });
  } catch (error) {
    next(error);
  }
};

// Update user profile
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, email, bio } = req.body;
    const userId = req.user.id;

    // Check if email is already used by another user
    if (email) {
      const [existingUsers] = await pool.query(
        'SELECT id FROM users WHERE email = ? AND id != ?',
        [email, userId]
      );

      if (existingUsers.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'البريد الإلكتروني مستخدم مسبقاً'
        });
      }
    }

    // Update user
    await pool.query(
      'UPDATE users SET name = ?, email = ?, bio = ? WHERE id = ?',
      [name, email, bio, userId]
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
    const followingId = req.params.id;
    const followerId = req.user.id;

    // Can't follow yourself
    if (followerId === parseInt(followingId)) {
      return res.status(400).json({
        success: false,
        message: 'لا يمكنك متابعة نفسك'
      });
    }

    // Check if user exists
    const [users] = await pool.query(
      'SELECT id FROM users WHERE id = ?',
      [followingId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'المستخدم غير موجود'
      });
    }

    // Check if already following
    const [existing] = await pool.query(
      'SELECT id FROM follows WHERE follower_id = ? AND following_id = ?',
      [followerId, followingId]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'أنت تتابع هذا المستخدم بالفعل'
      });
    }

    // Create follow
    await pool.query(
      'INSERT INTO follows (follower_id, following_id) VALUES (?, ?)',
      [followerId, followingId]
    );

    // Create notification
    await pool.query(
      'INSERT INTO notifications (user_id, type, content, related_id) VALUES (?, ?, ?, ?)',
      [followingId, 'follow', 'بدأ بمتابعتك', followerId]
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
    const followingId = req.params.id;
    const followerId = req.user.id;

    const [result] = await pool.query(
      'DELETE FROM follows WHERE follower_id = ? AND following_id = ?',
      [followerId, followingId]
    );

    if (result.affectedRows === 0) {
      return res.status(400).json({
        success: false,
        message: 'أنت لا تتابع هذا المستخدم'
      });
    }

    res.json({
      success: true,
      message: 'تم إلغاء المتابعة بنجاح'
    });
  } catch (error) {
    next(error);
  }
};

// Get user followers
exports.getFollowers = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const [followers] = await pool.query(
      `SELECT u.id, u.name, u.profile_image, u.bio, u.is_verified
       FROM follows f
       JOIN users u ON f.follower_id = u.id
       WHERE f.following_id = ?
       ORDER BY f.created_at DESC
       LIMIT ? OFFSET ?`,
      [userId, limit, offset]
    );

    const [total] = await pool.query(
      'SELECT COUNT(*) as count FROM follows WHERE following_id = ?',
      [userId]
    );

    res.json({
      success: true,
      data: followers,
      pagination: {
        page,
        limit,
        total: total[0].count,
        pages: Math.ceil(total[0].count / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get user following
exports.getFollowing = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const [following] = await pool.query(
      `SELECT u.id, u.name, u.profile_image, u.bio, u.is_verified
       FROM follows f
       JOIN users u ON f.following_id = u.id
       WHERE f.follower_id = ?
       ORDER BY f.created_at DESC
       LIMIT ? OFFSET ?`,
      [userId, limit, offset]
    );

    const [total] = await pool.query(
      'SELECT COUNT(*) as count FROM follows WHERE follower_id = ?',
      [userId]
    );

    res.json({
      success: true,
      data: following,
      pagination: {
        page,
        limit,
        total: total[0].count,
        pages: Math.ceil(total[0].count / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// Search users
exports.searchUsers = async (req, res, next) => {
  try {
    const { q } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    if (!q || q.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'يرجى إدخال كلمة البحث'
      });
    }

    const searchTerm = `%${q}%`;

    const [users] = await pool.query(
      `SELECT id, name, phone, bio, profile_image, is_verified
       FROM users
       WHERE name LIKE ? OR phone LIKE ?
       ORDER BY is_verified DESC, name ASC
       LIMIT ? OFFSET ?`,
      [searchTerm, searchTerm, limit, offset]
    );

    const [total] = await pool.query(
      'SELECT COUNT(*) as count FROM users WHERE name LIKE ? OR phone LIKE ?',
      [searchTerm, searchTerm]
    );

    res.json({
      success: true,
      data: users,
      pagination: {
        page,
        limit,
        total: total[0].count,
        pages: Math.ceil(total[0].count / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};