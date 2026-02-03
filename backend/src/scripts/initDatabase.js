const mysql = require('mysql2/promise');
require('dotenv').config();

const initDatabase = async () => {
  let connection;

  try {
    // Connect to MySQL server (without database)
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      port: process.env.DB_PORT || 3306,
    });

    console.log('✅ Connected to MySQL server');

    // Create database if not exists
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'athar_db'}`);
    console.log(`✅ Database '${process.env.DB_NAME || 'athar_db'}' created or already exists`);

    // Use the database
    await connection.query(`USE ${process.env.DB_NAME || 'athar_db'}`);

    // Create users table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        phone VARCHAR(20) UNIQUE NOT NULL,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE,
        password VARCHAR(255) NOT NULL,
        bio TEXT,
        profile_image VARCHAR(500),
        push_token VARCHAR(500),
        is_verified BOOLEAN DEFAULT FALSE,
        is_banned BOOLEAN DEFAULT FALSE,
        ban_reason TEXT,
        role ENUM('user', 'admin') DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_phone (phone),
        INDEX idx_email (email),
        INDEX idx_name (name)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Users table created');

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

    // Create posts table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS posts (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        type ENUM('text', 'image', 'video', 'link') NOT NULL,
        title VARCHAR(255),
        content TEXT NOT NULL,
        media_url VARCHAR(500),
        link_url VARCHAR(500),
        category VARCHAR(50),
        is_archived BOOLEAN DEFAULT FALSE,
        is_private BOOLEAN DEFAULT FALSE,
        is_featured BOOLEAN DEFAULT FALSE,
        views_count INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_user_id (user_id),
        INDEX idx_type (type),
        INDEX idx_category (category),
        INDEX idx_is_private (is_private),
        INDEX idx_is_featured (is_featured),
        INDEX idx_created_at (created_at),
        FULLTEXT INDEX idx_content (title, content)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Posts table created');

    // Create comments table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS comments (
        id INT PRIMARY KEY AUTO_INCREMENT,
        post_id INT NOT NULL,
        user_id INT NOT NULL,
        content TEXT NOT NULL,
        parent_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE,
        INDEX idx_post_id (post_id),
        INDEX idx_user_id (user_id),
        INDEX idx_parent_id (parent_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Comments table created');

    // Create likes table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS likes (
        id INT PRIMARY KEY AUTO_INCREMENT,
        post_id INT NOT NULL,
        user_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE KEY unique_like (post_id, user_id),
        INDEX idx_post_id (post_id),
        INDEX idx_user_id (user_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Likes table created');

    // Create favorites table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS favorites (
        id INT PRIMARY KEY AUTO_INCREMENT,
        post_id INT NOT NULL,
        user_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE KEY unique_favorite (post_id, user_id),
        INDEX idx_post_id (post_id),
        INDEX idx_user_id (user_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Favorites table created');

    // Create follows table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS follows (
        id INT PRIMARY KEY AUTO_INCREMENT,
        follower_id INT NOT NULL,
        followed_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (follower_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (followed_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE KEY unique_follow (follower_id, followed_id),
        INDEX idx_follower_id (follower_id),
        INDEX idx_followed_id (followed_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Follows table created');

    // Create notifications table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        sender_id INT,
        type ENUM('like', 'comment', 'follow', 'mention', 'admin') NOT NULL,
        title VARCHAR(255),
        content TEXT NOT NULL,
        related_id INT,
        data JSON,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE SET NULL,
        INDEX idx_user_id (user_id),
        INDEX idx_sender_id (sender_id),
        INDEX idx_is_read (is_read),
        INDEX idx_created_at (created_at),
        INDEX idx_related_id (related_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Notifications table created');

    // Create banners table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS banners (
        id INT PRIMARY KEY AUTO_INCREMENT,
        title VARCHAR(255) NOT NULL,
        image_url VARCHAR(500) NOT NULL,
        icon VARCHAR(50),
        target_url VARCHAR(500),
        is_active BOOLEAN DEFAULT TRUE,
        order_index INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_is_active (is_active),
        INDEX idx_order_index (order_index)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Banners table created');

    // Create contact_messages table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT,
        name VARCHAR(100),
        email VARCHAR(255),
        phone VARCHAR(20),
        subject VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        status ENUM('pending', 'read', 'replied', 'closed') DEFAULT 'pending',
        admin_reply TEXT,
        replied_by INT,
        replied_at TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
        FOREIGN KEY (replied_by) REFERENCES users(id) ON DELETE SET NULL,
        INDEX idx_user_id (user_id),
        INDEX idx_status (status),
        INDEX idx_created_at (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Contact messages table created');

    // Create reports table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS reports (
        id INT PRIMARY KEY AUTO_INCREMENT,
        reporter_id INT NOT NULL,
        type ENUM('post', 'user', 'comment') NOT NULL,
        target_id INT NOT NULL,
        reason VARCHAR(255) NOT NULL,
        description TEXT,
        status ENUM('pending', 'reviewed', 'resolved', 'dismissed') DEFAULT 'pending',
        admin_notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (reporter_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_reporter_id (reporter_id),
        INDEX idx_type (type),
        INDEX idx_target_id (target_id),
        INDEX idx_status (status),
        INDEX idx_created_at (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Reports table created');

    // Insert default boxes
    await connection.query(`
      INSERT IGNORE INTO boxes (id, name, description, icon, color, order_index) VALUES
      (1, 'صندوق التقنية والبرمجة', 'أحدث الأفكار والمشاريع في عالم التقنية والبرمجة والذكاء الاصطناعي', 'code-slash', '#3B82F6', 1),
      (2, 'صندوق الفن والإبداع', 'مساحة للفنانين والمبدعين لمشاركة أعمالهم وإلهام الآخرين', 'color-palette', '#8B5CF6', 2),
      (3, 'صندوق الكتابة والأدب', 'قصص وأفكار أدبية من كتّاب موهوبين حول العالم', 'book', '#10B981', 3),
      (4, 'صندوق الرياضة واللياقة', 'نصائح وتجارب رياضية لحياة صحية ونشطة', 'fitness', '#EF4444', 4),
      (5, 'صندوق السفر والمغامرات', 'تجارب سفر مذهلة ووجهات سياحية من حول العالم', 'airplane', '#F59E0B', 5),
      (6, 'صندوق ريادة الأعمال', 'أفكار ونصائح لرواد الأعمال والمشاريع الناشئة', 'briefcase', '#06B6D4', 6)
    `);
    console.log('✅ Default boxes inserted');

    // Insert default categories
    await connection.query(`
      INSERT IGNORE INTO categories (id, name, description, icon, color, box_id, order_index) VALUES
      (1, 'برمجة', 'مواضيع البرمجة والتطوير', 'code', '#3B82F6', 1, 1),
      (2, 'ذكاء اصطناعي', 'الذكاء الاصطناعي والتعلم الآلي', 'bulb', '#8B5CF6', 1, 2),
      (3, 'تصميم', 'التصميم الجرافيكي وتجربة المستخدم', 'brush', '#EC4899', 1, 3),
      (4, 'رسم', 'الرسم والفنون التشكيلية', 'color-palette', '#8B5CF6', 2, 1),
      (5, 'موسيقى', 'الموسيقى والفنون الصوتية', 'musical-notes', '#F59E0B', 2, 2),
      (6, 'تصوير', 'التصوير الفوتوغرافي', 'camera', '#06B6D4', 2, 3),
      (7, 'شعر', 'الشعر والقصائد', 'book', '#10B981', 3, 1),
      (8, 'قصص', 'القصص القصيرة والروايات', 'library', '#3B82F6', 3, 2),
      (9, 'مقالات', 'المقالات والكتابة الحرة', 'document-text', '#F59E0B', 3, 3),
      (10, 'كرة قدم', 'كرة القدم والرياضات الجماعية', 'football', '#EF4444', 4, 1),
      (11, 'لياقة', 'اللياقة البدنية والتمارين', 'fitness', '#10B981', 4, 2),
      (12, 'تغذية', 'التغذية الصحية', 'nutrition', '#F59E0B', 4, 3),
      (13, 'سياحة', 'السياحة والسفر', 'airplane', '#06B6D4', 5, 1),
      (14, 'مغامرات', 'المغامرات والرحلات', 'compass', '#EF4444', 5, 2),
      (15, 'ثقافات', 'الثقافات والتقاليد', 'globe', '#8B5CF6', 5, 3),
      (16, 'ريادة', 'ريادة الأعمال والشركات الناشئة', 'rocket', '#06B6D4', 6, 1),
      (17, 'تسويق', 'التسويق والمبيعات', 'megaphone', '#EC4899', 6, 2),
      (18, 'إدارة', 'الإدارة والقيادة', 'briefcase', '#3B82F6', 6, 3)
    `);
    console.log('✅ Default categories inserted');

    console.log('');
    console.log('🎉 ═══════════════════════════════════════════════════');
    console.log('   Database initialization completed successfully!');
    console.log('   ═══════════════════════════════════════════════════');
    console.log('');
    console.log('   📊 Tables created:');
    console.log('   - users (with push_token, is_banned, ban_reason)');
    console.log('   - boxes (صناديق الأفكار)');
    console.log('   - categories (فئات المنشورات)');
    console.log('   - posts (with is_private, is_featured)');
    console.log('   - comments');
    console.log('   - likes');
    console.log('   - favorites');
    console.log('   - follows');
    console.log('   - notifications');
    console.log('   - contact_messages (رسائل التواصل)');
    console.log('');
    console.log('   📦 Default data inserted:');
    console.log('   - 6 boxes (صناديق)');
    console.log('   - 18 categories (فئات)');
    console.log('');
    console.log('   💡 Next steps:');
    console.log('   1. Run: npm run seed (to add test users and posts)');
    console.log('   2. Run: npm start (to start the server)');
    console.log('   3. Test the API endpoints');
    console.log('');
    console.log('   ═══════════════════════════════════════════════════');

  } catch (error) {
    console.error('❌ Error initializing database:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};

// Run initialization
initDatabase();
