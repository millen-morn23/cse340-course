import pool from '../db/connection.js';

export const getAllOrganizations = async () => {
  const result = await pool.query(`
    SELECT 
      id,
      name,
      description,
      image,
      contact_email
    FROM organizations
  `);

  return result.rows;
};