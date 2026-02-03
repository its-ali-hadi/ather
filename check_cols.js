require('dotenv').config({ path: './backend/.env' });
const { pool } = require('./backend/src/config/database');
async function check() {
    console.log('Starting check...');
    try {
        const [cols] = await pool.query('SHOW COLUMNS FROM notifications');
        console.log('COLUMNS_START');
        console.log(JSON.stringify(cols, null, 2));
        console.log('COLUMNS_END');
    } catch (e) {
        console.error('ERROR_START');
        console.error(e);
        console.error('ERROR_END');
    }
    process.exit();
}
check();
setTimeout(() => { console.log('Timeout'); process.exit(); }, 5000);
