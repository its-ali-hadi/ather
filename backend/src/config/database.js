const mysql = require('mysql2/promise');
// Only load .env if not in Docker (custom check) or if specific env var is missing
if (!process.env.DB_HOST) {
  require('dotenv').config();
}

// Debugging: Print DB connection details
console.log('--- DB CONFIG DEBUG ---');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('-----------------------');

// Create connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: (process.env.DB_PASSWORD || '').replace(/^'|'$/g, ''),
  database: process.env.DB_NAME || 'athar_db',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

// Test connection
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Database connected successfully');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    throw error;
  }
};

module.exports = { pool, testConnection };