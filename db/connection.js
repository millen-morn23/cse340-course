import dotenv from 'dotenv';

dotenv.config();

import pkg from 'pg';

const { Pool } = pkg;

let pool;

if (process.env.DATABASE_URL) {

  console.log(
    'Using Render database'
  );

  pool = new Pool({

    connectionString:
      process.env.DATABASE_URL,

    ssl: {
      rejectUnauthorized: false
    }
  });

} else {

  console.log(
    'Using LOCAL database'
  );

  pool = new Pool({

    user: 'postgres',
    host: 'localhost',
    database: 'cse340',
    password: 'milo1738',
    port: 5432
  });
}

export default pool;