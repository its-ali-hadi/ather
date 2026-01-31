const mysql = require('mysql2/promise');
require('dotenv').config();

const addPrivateField = async () => {
  let connection;

  try {
    // Connect to database
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'athar_db',
      port: process.env.DB_PORT || 3306,
    });

    console.log('✅ Connected to database');

    // Check if column already exists
    const [columns] = await connection.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = ? 
      AND TABLE_NAME = 'posts' 
      AND COLUMN_NAME = 'is_private'
    `, [process.env.DB_NAME || 'athar_db']);

    if (columns.length > 0) {
      console.log('ℹ️  Column is_private already exists');
      return;
    }

    // Add is_private column
    await connection.query(`
      ALTER TABLE posts 
      ADD COLUMN is_private BOOLEAN DEFAULT FALSE AFTER is_archived
    `);
    console.log('✅ Added is_private column');

    // Add index for better performance
    await connection.query(`
      ALTER TABLE posts 
      ADD INDEX idx_is_private (is_private)
    `);
    console.log('✅ Added index on is_private');

    console.log('');
    console.log('🎉 ═══════════════════════════════════════════════════');
    console.log('   Migration completed successfully!');
    console.log('   ═══════════════════════════════════════════════════');
    console.log('');
    console.log('   ✅ Added is_private field to posts table');
    console.log('   ✅ Added index for better performance');
    console.log('');
    console.log('   💡 Next steps:');
    console.log('   1. Update postController.js to handle is_private');
    console.log('   2. Test creating private posts');
    console.log('   3. Update frontend to filter private posts');
    console.log('');
    console.log('   ═══════════════════════════════════════════════════');

  } catch (error) {
    console.error('❌ Error adding private field:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};

// Run migration
addPrivateField();