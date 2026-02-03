require('dotenv').config({ path: './backend/.env' });
const { pool } = require('./backend/src/config/database');

async function fix() {
    try {
        console.log('Fixing notifications table schema...');
        // Make body column nullable or have a default value
        await pool.query('ALTER TABLE notifications MODIFY COLUMN body TEXT NULL');
        console.log('✅ Column "body" is now nullable');

        // Also check if content exists and is NOT NULL
        const [columns] = await pool.query('SHOW COLUMNS FROM notifications');
        const contentCol = columns.find(c => c.Field === 'content');
        if (contentCol && contentCol.Null === 'NO') {
            await pool.query('ALTER TABLE notifications MODIFY COLUMN content TEXT NULL');
            console.log('✅ Column "content" is now nullable');
        }

        console.log('✅ Database schema fix complete');
    } catch (e) {
        console.error('❌ Error fixing database schema:', e);
    }
    process.exit();
}
fix();
