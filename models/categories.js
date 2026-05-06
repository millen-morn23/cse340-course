import pool from '../db/connection.js';

// Get all categories
const getAllCategories = async () => {

  const result = await pool.query(`
    SELECT
      category_id,
      name
    FROM categories
  `);

  return result.rows;
};

// Get ONE category details
const getCategoryDetails = async (categoryId) => {

  const query = `
    SELECT
      category_id,
      name
    FROM categories
    WHERE category_id = $1
  `;

  const queryParams = [categoryId];

  const result = await pool.query(query, queryParams);

  return result.rows.length > 0
    ? result.rows[0]
    : null;
};

// Get all projects for ONE category
const getProjectsByCategoryId = async (categoryId) => {

  const query = `
    SELECT
      projects.project_id,
      projects.title,
      projects.project_date,
      projects.location
    FROM project_categories
    JOIN projects
      ON project_categories.project_id = projects.project_id
    WHERE project_categories.category_id = $1
    ORDER BY projects.project_date
  `;

  const queryParams = [categoryId];

  const result = await pool.query(query, queryParams);

  return result.rows;
};

// Get all categories for ONE project
const getCategoriesByProjectId = async (projectId) => {

  const query = `
    SELECT
      categories.category_id,
      categories.name
    FROM project_categories
    JOIN categories
      ON project_categories.category_id = categories.category_id
    WHERE project_categories.project_id = $1
  `;

  const queryParams = [projectId];

  const result = await pool.query(query, queryParams);

  return result.rows;
};

// Export model functions
export {
  getAllCategories,
  getCategoryDetails,
  getProjectsByCategoryId,
  getCategoriesByProjectId
};