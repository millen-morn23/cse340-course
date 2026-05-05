import pkg from 'pg';
const { Pool } = pkg;

let pool;

// If DATABASE_URL exists → use Render DB
if (process.env.DATABASE_URL) {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });
} else {
  // Otherwise use local DB (no SSL)
  pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'cse340',
    password: 'milo1738',
    port: 5432,
  });
}

export default pool;