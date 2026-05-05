import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'cse340',
  password: 'milo1738',
  port: 5432,
});

export default pool;