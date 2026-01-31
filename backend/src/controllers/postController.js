const { pool } = require('../config/database');

// Create post
exports.createPost = async (req, res, next) => {
  try {
    const { type, title, content, media_url, link_url, category, is_private } = req.body;
    const userId = req.user.id;

    const [result] = await pool.query(
      'INSERT INTO posts (user_id, type, title, content, media_url, link_url, category, is_private) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [userId, type, title, content, media_url, link_url, category, is_private || false]
    );

    // Get created post with user info
    const [posts] = await pool.query(
      `SELECT p.*, u.name as user_name, u.profile_image as user_image, u.is_verified as user_verified,
              0 as likes_count, 0 as comments_count, FALSE as is_liked, FALSE as is_favorited
       FROM posts p
       JOIN users u ON p.user_id = u.id
       WHERE p.id = ?`,
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: `تم نشر المنشور ${is_private ? 'الخاص' : 'العام'} بنجاح`,
      data: posts[0]
    });
  } catch (error) {
    next(error);
  }
};

// Get all posts (feed) - only public posts
exports.getPosts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    const category = req.query.category;
    const type = req.query.type;
    const userId = req.user?.id;

    let query = `
      SELECT p.*, 
             u.name as user_name, u.profile_image as user_image, u.is_verified as user_verified,
             (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as likes_count,
             (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comments_count
    `;

    if (userId) {
      query += `,
             (SELECT COUNT(*) > 0 FROM likes WHERE post_id = p.id AND user_id = ?) as is_liked,
             (SELECT COUNT(*) > 0 FROM favorites WHERE post_id = p.id AND user_id = ?) as is_favorited
      `;
    } else {
      query += `, FALSE as is_liked, FALSE as is_favorited`;
    }

    query += `
      FROM posts p
      JOIN users u ON p.user_id = u.id
      WHERE p.is_archived = FALSE AND p.is_private = FALSE
    `;

    const params = userId ? [userId, userId] : [];

    if (category) {
      query += ' AND p.category = ?';
      params.push(category);
    }

    if (type) {
      query += ' AND p.type = ?';
      params.push(type);
    }

    query += ' ORDER BY p.created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [posts] = await pool.query(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) as count FROM posts WHERE is_archived = FALSE AND is_private = FALSE';
    const countParams = [];

    if (category) {
      countQuery += ' AND category = ?';
      countParams.push(category);
    }

    if (type) {
      countQuery += ' AND type = ?';
      countParams.push(type);
    }

    const [total] = await pool.query(countQuery, countParams);

    res.json({
      success: true,
      data: posts,
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

// Get single post
exports.getPost = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const userId = req.user?.id;

    let query = `
      SELECT p.*, 
             u.name as user_name, u.profile_image as user_image, u.is_verified as user_verified,
             (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as likes_count,
             (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comments_count
    `;

    if (userId) {
      query += `,
             (SELECT COUNT(*) > 0 FROM likes WHERE post_id = p.id AND user_id = ?) as is_liked,
             (SELECT COUNT(*) > 0 FROM favorites WHERE post_id = p.id AND user_id = ?) as is_favorited
      `;
    } else {
      query += `, FALSE as is_liked, FALSE as is_favorited`;
    }

    query += `
      FROM posts p
      JOIN users u ON p.user_id = u.id
      WHERE p.id = ?
    `;

    const params = userId ? [userId, userId, postId] : [postId];
    const [posts] = await pool.query(query, params);

    if (posts.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'المنشور غير موجود'
      });
    }

    // Increment views
    await pool.query(
      'UPDATE posts SET views_count = views_count + 1 WHERE id = ?',
      [postId]
    );

    res.json({
      success: true,
      data: posts[0]
    });
  } catch (error) {
    next(error);
  }
};

// Get user posts
exports.getUserPosts = async (req, res, next) => {
  try {
    const targetUserId = req.params.userId;
    const currentUserId = req.user?.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    let query = `
      SELECT p.*, 
             u.name as user_name, u.profile_image as user_image, u.is_verified as user_verified,
             (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as likes_count,
             (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comments_count
    `;

    if (currentUserId) {
      query += `,
             (SELECT COUNT(*) > 0 FROM likes WHERE post_id = p.id AND user_id = ?) as is_liked,
             (SELECT COUNT(*) > 0 FROM favorites WHERE post_id = p.id AND user_id = ?) as is_favorited
      `;
    } else {
      query += `, FALSE as is_liked, FALSE as is_favorited`;
    }

    query += `
      FROM posts p
      JOIN users u ON p.user_id = u.id
      WHERE p.user_id = ? AND p.is_archived = FALSE
      ORDER BY p.created_at DESC
      LIMIT ? OFFSET ?
    `;

    const params = currentUserId 
      ? [currentUserId, currentUserId, targetUserId, limit, offset]
      : [targetUserId, limit, offset];

    const [posts] = await pool.query(query, params);

    const [total] = await pool.query(
      'SELECT COUNT(*) as count FROM posts WHERE user_id = ? AND is_archived = FALSE',
      [targetUserId]
    );

    res.json({
      success: true,
      data: posts,
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

// Update post
exports.updatePost = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;
    const { title, content, category } = req.body;

    // Check if post exists and belongs to user
    const [posts] = await pool.query(
      'SELECT user_id FROM posts WHERE id = ?',
      [postId]
    );

    if (posts.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'المنشور غير موجود'
      });
    }

    if (posts[0].user_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'غير مصرح لك بتعديل هذا المنشور'
      });
    }

    // Update post
    await pool.query(
      'UPDATE posts SET title = ?, content = ?, category = ? WHERE id = ?',
      [title, content, category, postId]
    );

    // Get updated post
    const [updatedPosts] = await pool.query(
      `SELECT p.*, u.name as user_name, u.profile_image as user_image, u.is_verified as user_verified,
              (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as likes_count,
              (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comments_count,
              (SELECT COUNT(*) > 0 FROM likes WHERE post_id = p.id AND user_id = ?) as is_liked,
              (SELECT COUNT(*) > 0 FROM favorites WHERE post_id = p.id AND user_id = ?) as is_favorited
       FROM posts p
       JOIN users u ON p.user_id = u.id
       WHERE p.id = ?`,
      [userId, userId, postId]
    );

    res.json({
      success: true,
      message: 'تم تحديث المنشور بنجاح',
      data: updatedPosts[0]
    });
  } catch (error) {
    next(error);
  }
};

// Delete post
exports.deletePost = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;

    // Check if post exists and belongs to user
    const [posts] = await pool.query(
      'SELECT user_id FROM posts WHERE id = ?',
      [postId]
    );

    if (posts.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'المنشور غير موجود'
      });
    }

    if (posts[0].user_id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'غير مصرح لك بحذف هذا المنشور'
      });
    }

    // Delete post
    await pool.query('DELETE FROM posts WHERE id = ?', [postId]);

    res.json({
      success: true,
      message: 'تم حذف المنشور بنجاح'
    });
  } catch (error) {
    next(error);
  }
};

// Archive post
exports.archivePost = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;

    // Check if post exists and belongs to user
    const [posts] = await pool.query(
      'SELECT user_id FROM posts WHERE id = ?',
      [postId]
    );

    if (posts.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'المنشور غير موجود'
      });
    }

    if (posts[0].user_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'غير مصرح لك بأرشفة هذا المنشور'
      });
    }

    // Archive post
    await pool.query(
      'UPDATE posts SET is_archived = TRUE WHERE id = ?',
      [postId]
    );

    res.json({
      success: true,
      message: 'تم أرشفة المنشور بنجاح'
    });
  } catch (error) {
    next(error);
  }
};

// Search posts
exports.searchPosts = async (req, res, next) => {
  try {
    const { q } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    const userId = req.user?.id;

    if (!q || q.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'يرجى إدخال كلمة البحث'
      });
    }

    const searchTerm = `%${q}%`;

    let query = `
      SELECT p.*, 
             u.name as user_name, u.profile_image as user_image, u.is_verified as user_verified,
             (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as likes_count,
             (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comments_count
    `;

    if (userId) {
      query += `,
             (SELECT COUNT(*) > 0 FROM likes WHERE post_id = p.id AND user_id = ?) as is_liked,
             (SELECT COUNT(*) > 0 FROM favorites WHERE post_id = p.id AND user_id = ?) as is_favorited
      `;
    } else {
      query += `, FALSE as is_liked, FALSE as is_favorited`;
    }

    query += `
      FROM posts p
      JOIN users u ON p.user_id = u.id
      WHERE p.is_archived = FALSE AND (p.title LIKE ? OR p.content LIKE ?)
      ORDER BY p.created_at DESC
      LIMIT ? OFFSET ?
    `;

    const params = userId 
      ? [userId, userId, searchTerm, searchTerm, limit, offset]
      : [searchTerm, searchTerm, limit, offset];

    const [posts] = await pool.query(query, params);

    const [total] = await pool.query(
      'SELECT COUNT(*) as count FROM posts WHERE is_archived = FALSE AND (title LIKE ? OR content LIKE ?)',
      [searchTerm, searchTerm]
    );

    res.json({
      success: true,
      data: posts,
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

// Get private posts (only for authenticated user)
exports.getPrivatePosts = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const query = `
      SELECT p.*, 
             u.name as user_name, u.profile_image as user_image, u.is_verified as user_verified,
             (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as likes_count,
             (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comments_count,
             (SELECT COUNT(*) > 0 FROM likes WHERE post_id = p.id AND user_id = ?) as is_liked,
             (SELECT COUNT(*) > 0 FROM favorites WHERE post_id = p.id AND user_id = ?) as is_favorited
      FROM posts p
      JOIN users u ON p.user_id = u.id
      WHERE p.user_id = ? AND p.is_private = TRUE AND p.is_archived = FALSE
      ORDER BY p.created_at DESC
      LIMIT ? OFFSET ?
    `;

    const [posts] = await pool.query(query, [userId, userId, userId, limit, offset]);

    const [total] = await pool.query(
      'SELECT COUNT(*) as count FROM posts WHERE user_id = ? AND is_private = TRUE AND is_archived = FALSE',
      [userId]
    );

    res.json({
      success: true,
      data: posts,
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

// Publish private post (convert to public)
exports.publishPost = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;

    // Check if post exists and belongs to user
    const [posts] = await pool.query(
      'SELECT user_id, is_private FROM posts WHERE id = ?',
      [postId]
    );

    if (posts.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'المنشور غير موجود'
      });
    }

    if (posts[0].user_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'غير مصرح لك بنشر هذا المنشور'
      });
    }

    if (!posts[0].is_private) {
      return res.status(400).json({
        success: false,
        message: 'المنشور منشور بالفعل'
      });
    }

    // Convert to public
    await pool.query(
      'UPDATE posts SET is_private = FALSE WHERE id = ?',
      [postId]
    );

    // Get updated post
    const [updatedPosts] = await pool.query(
      `SELECT p.*, u.name as user_name, u.profile_image as user_image, u.is_verified as user_verified,
              (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as likes_count,
              (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comments_count,
              (SELECT COUNT(*) > 0 FROM likes WHERE post_id = p.id AND user_id = ?) as is_liked,
              (SELECT COUNT(*) > 0 FROM favorites WHERE post_id = p.id AND user_id = ?) as is_favorited
       FROM posts p
       JOIN users u ON p.user_id = u.id
       WHERE p.id = ?`,
      [userId, userId, postId]
    );

    res.json({
      success: true,
      message: 'تم نشر المنشور بنجاح! أصبح الآن عاماً ويمكن للجميع رؤيته',
      data: updatedPosts[0]
    });
  } catch (error) {
    next(error);
  }
};
