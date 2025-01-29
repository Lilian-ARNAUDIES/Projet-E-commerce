const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.DB_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.DB_PORT,
});

pool.connect()
  .then(() => {
    console.log('Connected to PostgreSQL successfully');
  })
  .catch((err) => {
    console.error('Error connecting to PostgreSQL:', err.message);
  });

module.exports = pool;