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

// Assign category to project
const assignCategoryToProject = async (
  categoryId,
  projectId
) => {

  const query = `
    INSERT INTO project_categories (
      category_id,
      project_id
    )
    VALUES ($1, $2)
  `;

  const queryParams = [
    categoryId,
    projectId
  ];

  await pool.query(query, queryParams);
};

// Update category assignments
const updateCategoryAssignments = async (
  projectId,
  categoryIds
) => {

  // Remove existing assignments
  const deleteQuery = `
    DELETE FROM project_categories
    WHERE project_id = $1
  `;

  await pool.query(deleteQuery, [projectId]);

  // Add new assignments
  for (const categoryId of categoryIds) {

    await assignCategoryToProject(
      categoryId,
      projectId
    );
  }
};

// Create new category
const createCategory = async (name) => {

  const query = `
    INSERT INTO categories (
      name
    )
    VALUES ($1)
    RETURNING category_id
  `;

  const result = await pool.query(
    query,
    [name]
  );

  if (result.rows.length === 0) {

    throw new Error(
      'Failed to create category'
    );
  }

  return result.rows[0].category_id;
};

// Update category
const updateCategory = async (
  categoryId,
  name
) => {

  const query = `
    UPDATE categories
    SET
      name = $1
    WHERE category_id = $2
    RETURNING category_id
  `;

  const result = await pool.query(
    query,
    [name, categoryId]
  );

  if (result.rows.length === 0) {

    throw new Error(
      'Failed to update category'
    );
  }

  return result.rows[0].category_id;
};

// Export model functions
export {
  getAllCategories,
  getCategoryDetails,
  getProjectsByCategoryId,
  getCategoriesByProjectId,
  updateCategoryAssignments,
  createCategory,
  updateCategory
};