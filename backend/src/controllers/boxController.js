const { pool } = require('../config/database');

// Get all boxes
exports.getBoxes = async (req, res, next) => {
  try {
    const [boxes] = await pool.query(`
      SELECT b.*, COUNT(DISTINCT p.id) as posts_count
      FROM boxes b
      LEFT JOIN categories c ON b.id = c.box_id
      LEFT JOIN posts p ON c.name = p.category
      WHERE b.is_active = TRUE
      GROUP BY b.id
      ORDER BY b.order_index ASC
    `);

    res.json({
      success: true,
      data: boxes,
    });
  } catch (error) {
    next(error);
  }
};

// Get single box
exports.getBox = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [boxes] = await pool.query(`
      SELECT b.*, COUNT(DISTINCT p.id) as posts_count
      FROM boxes b
      LEFT JOIN categories c ON b.id = c.box_id
      LEFT JOIN posts p ON c.name = p.category
      WHERE b.id = ?
      GROUP BY b.id
    `, [id]);

    if (boxes.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'الصندوق غير موجود',
      });
    }

    // Get categories for this box
    const [categories] = await pool.query(`
      SELECT c.*, COUNT(DISTINCT p.id) as posts_count
      FROM categories c
      LEFT JOIN posts p ON c.name = p.category
      WHERE c.box_id = ? AND c.is_active = TRUE
      GROUP BY c.id
      ORDER BY c.order_index ASC
    `, [id]);

    res.json({
      success: true,
      data: {
        ...boxes[0],
        categories,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get all categories
exports.getCategories = async (req, res, next) => {
  try {
    const { boxId } = req.query;

    let query = `
      SELECT c.*, b.name as box_name, COUNT(DISTINCT p.id) as posts_count
      FROM categories c
      LEFT JOIN boxes b ON c.box_id = b.id
      LEFT JOIN posts p ON c.name = p.category
      WHERE c.is_active = TRUE
    `;

    const params = [];

    if (boxId) {
      query += ' AND c.box_id = ?';
      params.push(boxId);
    }

    query += ' GROUP BY c.id ORDER BY c.order_index ASC';

    const [categories] = await pool.query(query, params);

    res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Get all boxes (including inactive)
exports.getAllBoxes = async (req, res, next) => {
  try {
    const [boxes] = await pool.query(`
      SELECT b.*, COUNT(DISTINCT c.id) as categories_count
      FROM boxes b
      LEFT JOIN categories c ON b.id = c.box_id
      GROUP BY b.id
      ORDER BY b.order_index ASC
    `);

    res.json({
      success: true,
      data: boxes,
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Create box
exports.createBox = async (req, res, next) => {
  try {
    const { name, description, icon, image_url, color, order_index } = req.body;

    const [result] = await pool.query(
      'INSERT INTO boxes (name, description, icon, image_url, color, order_index) VALUES (?, ?, ?, ?, ?, ?)',
      [name, description, icon, image_url, color, order_index || 0]
    );

    const [boxes] = await pool.query('SELECT * FROM boxes WHERE id = ?', [result.insertId]);

    res.status(201).json({
      success: true,
      message: 'تم إنشاء الصندوق بنجاح',
      data: boxes[0],
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Update box
exports.updateBox = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, icon, image_url, color, is_active, order_index } = req.body;

    await pool.query(
      'UPDATE boxes SET name = ?, description = ?, icon = ?, image_url = ?, color = ?, is_active = ?, order_index = ? WHERE id = ?',
      [name, description, icon, image_url, color, is_active, order_index, id]
    );

    const [boxes] = await pool.query('SELECT * FROM boxes WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'تم تحديث الصندوق بنجاح',
      data: boxes[0],
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Delete box
exports.deleteBox = async (req, res, next) => {
  try {
    const { id } = req.params;

    await pool.query('DELETE FROM boxes WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'تم حذف الصندوق بنجاح',
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Get all categories (including inactive)
exports.getAllCategories = async (req, res, next) => {
  try {
    const [categories] = await pool.query(`
      SELECT c.*, b.name as box_name, COUNT(DISTINCT p.id) as posts_count
      FROM categories c
      LEFT JOIN boxes b ON c.box_id = b.id
      LEFT JOIN posts p ON c.name = p.category
      GROUP BY c.id
      ORDER BY c.order_index ASC
    `);

    res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Create category
exports.createCategory = async (req, res, next) => {
  try {
    const { name, description, icon, color, box_id, order_index } = req.body;

    const [result] = await pool.query(
      'INSERT INTO categories (name, description, icon, color, box_id, order_index) VALUES (?, ?, ?, ?, ?, ?)',
      [name, description, icon, color, box_id, order_index || 0]
    );

    const [categories] = await pool.query('SELECT * FROM categories WHERE id = ?', [result.insertId]);

    res.status(201).json({
      success: true,
      message: 'تم إنشاء الفئة بنجاح',
      data: categories[0],
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Update category
exports.updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, icon, color, box_id, is_active, order_index } = req.body;

    await pool.query(
      'UPDATE categories SET name = ?, description = ?, icon = ?, color = ?, box_id = ?, is_active = ?, order_index = ? WHERE id = ?',
      [name, description, icon, color, box_id, is_active, order_index, id]
    );

    const [categories] = await pool.query('SELECT * FROM categories WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'تم تحديث الفئة بنجاح',
      data: categories[0],
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Delete category
exports.deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    await pool.query('DELETE FROM categories WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'تم حذف الفئة بنجاح',
    });
  } catch (error) {
    next(error);
  }
};