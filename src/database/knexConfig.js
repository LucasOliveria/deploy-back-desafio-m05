const knex = require('knex')({
  client: 'pg',
  connection: {
    host: process.env.DB_HOST,
    user: process.env.PG_USER,
    password: process.env.PG_PASS,
    database: process.env.DB_NAME,
    ssl: { rejectUnauthorized: false }
  }
});

module.exports = knex;