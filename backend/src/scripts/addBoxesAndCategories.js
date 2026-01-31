const mysql = require('mysql2/promise');
require('dotenv').config();

const addBoxesAndCategories = async () => {
  let connection;

  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'athar_db',
      port: process.env.DB_PORT || 3306,
    });

    console.log('✅ Connected to database');

    // Create boxes table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS boxes (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        icon VARCHAR(50),
        image_url VARCHAR(500),
        color VARCHAR(20),
        is_active BOOLEAN DEFAULT TRUE,
        order_index INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_is_active (is_active),
        INDEX idx_order_index (order_index)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Boxes table created');

    // Create categories table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        icon VARCHAR(50),
        color VARCHAR(20),
        box_id INT,
        is_active BOOLEAN DEFAULT TRUE,
        order_index INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (box_id) REFERENCES boxes(id) ON DELETE SET NULL,
        INDEX idx_box_id (box_id),
        INDEX idx_is_active (is_active),
        INDEX idx_order_index (order_index)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Categories table created');

    // Insert default boxes
    await connection.query(`
      INSERT INTO boxes (name, description, icon, color, order_index) VALUES
      ('صندوق التقنية والبرمجة', 'أحدث الأفكار والمشاريع في عالم التقنية والبرمجة والذكاء الاصطناعي', 'code-slash', '#3B82F6', 1),
      ('صندوق الفن والإبداع', 'مساحة للفنانين والمبدعين لمشاركة أعمالهم وإلهام الآخرين', 'color-palette', '#8B5CF6', 2),
      ('صندوق الكتابة والأدب', 'قصص وأفكار أدبية من كتّاب موهوبين حول العالم', 'book', '#10B981', 3),
      ('صندوق الرياضة واللياقة', 'نصائح وتجارب رياضية لحياة صحية ونشطة', 'fitness', '#EF4444', 4),
      ('صندوق السفر والمغامرات', 'تجارب سفر مذهلة ووجهات سياحية من حول العالم', 'airplane', '#F59E0B', 5),
      ('صندوق ريادة الأعمال', 'أفكار ونصائح لرواد الأعمال والمشاريع الناشئة', 'briefcase', '#06B6D4', 6)
      ON DUPLICATE KEY UPDATE name=name
    `);
    console.log('✅ Default boxes inserted');

    // Insert default categories
    await connection.query(`
      INSERT INTO categories (name, description, icon, color, box_id, order_index) VALUES
      ('برمجة', 'مواضيع البرمجة والتطوير', 'code', '#3B82F6', 1, 1),
      ('ذكاء اصطناعي', 'الذكاء الاصطناعي والتعلم الآلي', 'bulb', '#8B5CF6', 1, 2),
      ('تصميم', 'التصميم الجرافيكي وتجربة المستخدم', 'brush', '#EC4899', 1, 3),
      ('رسم', 'الرسم والفنون التشكيلية', 'color-palette', '#8B5CF6', 2, 1),
      ('موسيقى', 'الموسيقى والفنون الصوتية', 'musical-notes', '#F59E0B', 2, 2),
      ('تصوير', 'التصوير الفوتوغرافي', 'camera', '#06B6D4', 2, 3),
      ('شعر', 'الشعر والقصائد', 'book', '#10B981', 3, 1),
      ('قصص', 'القصص القصيرة والروايات', 'library', '#3B82F6', 3, 2),
      ('مقالات', 'المقالات والكتابة الحرة', 'document-text', '#F59E0B', 3, 3),
      ('كرة قدم', 'كرة القدم والرياضات الجماعية', 'football', '#EF4444', 4, 1),
      ('لياقة', 'اللياقة البدنية والتمارين', 'fitness', '#10B981', 4, 2),
      ('تغذية', 'التغذية الصحية', 'nutrition', '#F59E0B', 4, 3),
      ('سياحة', 'السياحة والسفر', 'airplane', '#06B6D4', 5, 1),
      ('مغامرات', 'المغامرات والرحلات', 'compass', '#EF4444', 5, 2),
      ('ثقافات', 'الثقافات والتقاليد', 'globe', '#8B5CF6', 5, 3),
      ('ريادة', 'ريادة الأعمال والشركات الناشئة', 'rocket', '#06B6D4', 6, 1),
      ('تسويق', 'التسويق والمبيعات', 'megaphone', '#EC4899', 6, 2),
      ('إدارة', 'الإدارة والقيادة', 'briefcase', '#3B82F6', 6, 3)
      ON DUPLICATE KEY UPDATE name=name
    `);
    console.log('✅ Default categories inserted');

    console.log('');
    console.log('🎉 Boxes and Categories tables created successfully!');
    console.log('');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};

addBoxesAndCategories();