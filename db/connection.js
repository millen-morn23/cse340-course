import dotenv from 'dotenv';
dotenv.config();

import pkg from 'pg';

const { Pool } = pkg;

let pool;

if (process.env.DB_URL) {

  pool = new Pool({
    connectionString: process.env.DB_URL,

    ssl: {
      rejectUnauthorized: false
    }
  });

} else {

  pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'cse340',
    password: 'milo1738',
    port: 5432,
  });
}

export default pool;