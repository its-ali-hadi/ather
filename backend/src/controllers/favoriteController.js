const { pool } = require('../config/database');

// Toggle favorite
exports.toggleFavorite = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const userId = req.user.id;

    // Check if post exists
    const [posts] = await pool.query(
      'SELECT id FROM posts WHERE id = ?',
      [postId]
    );

    if (posts.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'المنشور غير موجود'
      });
    }

    // Check if already favorited
    const [existingFavorites] = await pool.query(
      'SELECT id FROM favorites WHERE post_id = ? AND user_id = ?',
      [postId, userId]
    );

    if (existingFavorites.length > 0) {
      // Remove from favorites
      await pool.query(
        'DELETE FROM favorites WHERE post_id = ? AND user_id = ?',
        [postId, userId]
      );

      return res.json({
        success: true,
        message: 'تم إزالة المنشور من المفضلة',
        data: { isFavorited: false }
      });
    } else {
      // Add to favorites
      await pool.query(
        'INSERT INTO favorites (post_id, user_id) VALUES (?, ?)',
        [postId, userId]
      );

      return res.json({
        success: true,
        message: 'تم إضافة المنشور للمفضلة',
        data: { isFavorited: true }
      });
    }
  } catch (error) {
    next(error);
  }
};

// Get user favorites
exports.getUserFavorites = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const [favorites] = await pool.query(
      `SELECT p.*, 
              u.name as user_name, u.profile_image as user_image, u.is_verified as user_verified,
              (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as likes_count,
              (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comments_count,
              (SELECT COUNT(*) > 0 FROM likes WHERE post_id = p.id AND user_id = ?) as is_liked,
              TRUE as is_favorited,
              f.created_at as favorited_at
       FROM favorites f
       JOIN posts p ON f.post_id = p.id
       JOIN users u ON p.user_id = u.id
       WHERE f.user_id = ?
       ORDER BY f.created_at DESC
       LIMIT ? OFFSET ?`,
      [userId, userId, limit, offset]
    );

    const [total] = await pool.query(
      'SELECT COUNT(*) as count FROM favorites WHERE user_id = ?',
      [userId]
    );

    res.json({
      success: true,
      data: favorites,
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