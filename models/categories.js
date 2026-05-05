import pool from '../db/connection.js';

export const getAllCategories = async () => {
  const result = await pool.query(`
    SELECT category_id, name
    FROM categories
  `);

  return result.rows;
};