import pool from '../db/connection.js';

export const getAllProjects = async () => {
  const result = await pool.query(`
    SELECT 
      projects.project_date,
      projects.title,
      organizations.name AS organization_name
    FROM projects
    JOIN organizations 
    ON projects.organization_id = organizations.id
  `);

  return result.rows;
};