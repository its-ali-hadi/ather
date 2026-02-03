const { pool } = require('../src/config/database');

async function fixNotificationsTable() {
    try {
        const [columns] = await pool.query('SHOW COLUMNS FROM notifications');
        const columnNames = columns.map(c => c.Field);

        if (!columnNames.includes('content')) {
            if (columnNames.includes('body')) {
                console.log('Renaming body to content...');
                await pool.query('ALTER TABLE notifications CHANGE body content TEXT NOT NULL');
            } else {
                console.log('Adding content column...');
                await pool.query('ALTER TABLE notifications ADD COLUMN content TEXT NOT NULL AFTER title');
            }
        }

        if (!columnNames.includes('related_id')) {
            console.log('Adding related_id column...');
            await pool.query('ALTER TABLE notifications ADD COLUMN related_id INT AFTER content');
            await pool.query('ALTER TABLE notifications ADD INDEX idx_related_id (related_id)');
        }

        if (!columnNames.includes('sender_id')) {
            console.log('Adding sender_id column...');
            await pool.query('ALTER TABLE notifications ADD COLUMN sender_id INT AFTER user_id');
            await pool.query('ALTER TABLE notifications ADD INDEX idx_sender_id (sender_id)');
            await pool.query('ALTER TABLE notifications ADD FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE SET NULL');
        }

        console.log('✅ Notifications table fixed');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error fixing notifications table:', error);
        process.exit(1);
    }
}

fixNotificationsTable();
