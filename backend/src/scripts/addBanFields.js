const { pool } = require('../config/database');

async function addBanFields() {
  try {
    console.log('Adding ban fields to users table...');

    // Add is_banned column
    await pool.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS is_banned BOOLEAN DEFAULT FALSE
    `);

    // Add ban_reason column
    await pool.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS ban_reason TEXT
    `);

    // Add is_featured column to posts
    await pool.query(`
      ALTER TABLE posts 
      ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE
    `);

    console.log('✅ Ban fields added successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding ban fields:', error);
    process.exit(1);
  }
}

addBanFields();