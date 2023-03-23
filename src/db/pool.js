const { Pool } = require('pg');
const format = require("pg-format");
const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_DATABASE } = process.env;

const pool = new Pool({
  user: DB_USER,
  host: DB_HOST,
  database: DB_DATABASE,
  password: DB_PASSWORD,
  port: DB_PORT,
  allowExitOnIdle: true
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  oneOrNone: async (text, params) => {
    const res = await pool.query(text, params);
    return res.rowCount === 1 ? res.rows[0] : null;
  },
  any: async (text, params) => {
    const res = await pool.query(text, params);
    return res.rows;
  },
  pool,
};
  