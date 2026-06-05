const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'school_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test connection and auto-initialize table on startup
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Database connection pool established successfully.');

    // Auto-create table on startup if it doesn't exist
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS schools (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        address VARCHAR(500) NOT NULL,
        latitude FLOAT NOT NULL,
        longitude FLOAT NOT NULL
      );
    `;
    await connection.query(createTableQuery);
    console.log('Table "schools" successfully verified/initialized.');

    connection.release();
  } catch (error) {
    console.error('Database connection or initialization failed:', error.message);
  }
})();

module.exports = pool;
