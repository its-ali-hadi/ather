const { pool } = require('../config/database');

// Get current user's liked posts
exports.getUserLikes = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const [likes] = await pool.query(
      `SELECT p.*, 
              u.name as user_name, u.profile_image as user_image, u.is_verified as user_verified,
              (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as likes_count,
              (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comments_count,
              TRUE as is_liked,
              (SELECT COUNT(*) > 0 FROM favorites WHERE post_id = p.id AND user_id = ?) as is_favorited,
              l.created_at as liked_at
       FROM likes l
       JOIN posts p ON l.post_id = p.id
       JOIN users u ON p.user_id = u.id
       WHERE l.user_id = ?
       ORDER BY l.created_at DESC
       LIMIT ? OFFSET ?`,
      [userId, userId, limit, offset]
    );

    const [total] = await pool.query(
      'SELECT COUNT(*) as count FROM likes WHERE user_id = ?',
      [userId]
    );

    res.json({
      success: true,
      data: likes,
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

// Toggle like (Like/Unlike)
exports.toggleLike = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const userId = req.user.id;

    // Check if post exists
    const [posts] = await pool.query(
      'SELECT id, user_id FROM posts WHERE id = ?',
      [postId]
    );

    if (posts.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'المنشور غير موجود'
      });
    }

    // Check if already liked
    const [existingLikes] = await pool.query(
      'SELECT id FROM likes WHERE post_id = ? AND user_id = ?',
      [postId, userId]
    );

    if (existingLikes.length > 0) {
      // Unlike
      await pool.query(
        'DELETE FROM likes WHERE post_id = ? AND user_id = ?',
        [postId, userId]
      );

      return res.json({
        success: true,
        message: 'تم إلغاء الإعجاب',
        data: { isLiked: false }
      });
    } else {
      // Like
      await pool.query(
        'INSERT INTO likes (post_id, user_id) VALUES (?, ?)',
        [postId, userId]
      );

      // Create notification for post owner (if not liking own post)
      if (posts[0].user_id !== userId) {
        await pool.query(
          'INSERT INTO notifications (user_id, sender_id, type, content, body, related_id) VALUES (?, ?, ?, ?, ?, ?)',
          [posts[0].user_id, userId, 'like', 'أعجب بمنشورك', 'أعجب بمنشورك', postId]
        );
      }

      return res.json({
        success: true,
        message: 'تم الإعجاب بالمنشور',
        data: { isLiked: true }
      });
    }
  } catch (error) {
    next(error);
  }
};

// Like a post
exports.likePost = async (req, res, next) => {
  try {
    const { post_id } = req.body;
    const userId = req.user.id;

    // Check if post exists
    const [posts] = await pool.query(
      'SELECT id, user_id FROM posts WHERE id = ?',
      [post_id]
    );

    if (posts.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'المنشور غير موجود'
      });
    }

    // Check if already liked
    const [existingLikes] = await pool.query(
      'SELECT id FROM likes WHERE post_id = ? AND user_id = ?',
      [post_id, userId]
    );

    if (existingLikes.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'لقد أعجبت بهذا المنشور بالفعل'
      });
    }

    // Like
    await pool.query(
      'INSERT INTO likes (post_id, user_id) VALUES (?, ?)',
      [post_id, userId]
    );

    // Create notification for post owner (if not liking own post)
    if (posts[0].user_id !== userId) {
      await pool.query(
        'INSERT INTO notifications (user_id, sender_id, type, content, body, related_id) VALUES (?, ?, ?, ?, ?, ?)',
        [posts[0].user_id, userId, 'like', 'أعجب بمنشورك', 'أعجب بمنشورك', post_id]
      );
    }

    return res.json({
      success: true,
      message: 'تم الإعجاب بالمنشور',
      data: { isLiked: true }
    });
  } catch (error) {
    next(error);
  }
};

// Unlike a post
exports.unlikePost = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const userId = req.user.id;

    // Unlike
    const [result] = await pool.query(
      'DELETE FROM likes WHERE post_id = ? AND user_id = ?',
      [postId, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'الإعجاب غير موجود'
      });
    }

    return res.json({
      success: true,
      message: 'تم إلغاء الإعجاب',
      data: { isLiked: false }
    });
  } catch (error) {
    next(error);
  }
};

// Get post likes
exports.getPostLikes = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const [likes] = await pool.query(
      `SELECT u.id, u.name, u.profile_image, u.is_verified, l.created_at
       FROM likes l
       JOIN users u ON l.user_id = u.id
       WHERE l.post_id = ?
       ORDER BY l.created_at DESC
       LIMIT ? OFFSET ?`,
      [postId, limit, offset]
    );

    const [total] = await pool.query(
      'SELECT COUNT(*) as count FROM likes WHERE post_id = ?',
      [postId]
    );

    res.json({
      success: true,
      data: likes,
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