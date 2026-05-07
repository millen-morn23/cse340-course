import pool from '../db/connection.js';

// Get all projects
const getAllProjects = async () => {

  const result = await pool.query(`
    SELECT 
      projects.project_id,
      projects.project_date,
      projects.title,
      projects.description,
      projects.location,
      organizations.id AS organization_id,
      organizations.name AS organization_name
    FROM projects
    JOIN organizations 
    ON projects.organization_id = organizations.id
  `);

  return result.rows;
};

// Get upcoming projects
const getUpcomingProjects = async (numberOfProjects) => {

  const query = `
    SELECT
      projects.project_id,
      projects.title,
      projects.description,
      projects.project_date,
      projects.location,
      organizations.id AS organization_id,
      organizations.name AS organization_name
    FROM projects
    JOIN organizations
      ON projects.organization_id = organizations.id
    WHERE projects.project_date >= CURRENT_DATE
    ORDER BY projects.project_date ASC
    LIMIT $1
  `;

  const queryParams = [numberOfProjects];

  const result = await pool.query(query, queryParams);

  return result.rows;
};

// Get details for ONE project
const getProjectDetails = async (projectId) => {

  const query = `
    SELECT
      projects.project_id,
      projects.title,
      projects.description,
      projects.project_date,
      projects.location,
      organizations.id AS organization_id,
      organizations.name AS organization_name
    FROM projects
    JOIN organizations
      ON projects.organization_id = organizations.id
    WHERE projects.project_id = $1
  `;

  const queryParams = [projectId];

  const result = await pool.query(query, queryParams);

  return result.rows.length > 0
    ? result.rows[0]
    : null;
};

// Get projects belonging to ONE organization
const getProjectsByOrganizationId = async (organizationId) => {

  const query = `
    SELECT
      project_id,
      organization_id,
      title,
      description,
      location,
      project_date
    FROM projects
    WHERE organization_id = $1
    ORDER BY project_date
  `;

  const queryParams = [organizationId];

  const result = await pool.query(query, queryParams);

  return result.rows;
};

// Create new project
const createProject = async (
  title,
  description,
  location,
  date,
  organizationId
) => {

  const query = `
    INSERT INTO projects (
      title,
      description,
      location,
      project_date,
      organization_id
    )
    VALUES ($1, $2, $3, $4, $5)
    RETURNING project_id
  `;

  const queryParams = [
    title,
    description,
    location,
    date,
    organizationId
  ];

  const result =
    await pool.query(query, queryParams);

  if (result.rows.length === 0) {

    throw new Error(
      'Failed to create project'
    );
  }

  return result.rows[0].project_id;
};

// Update project
const updateProject = async (
  projectId,
  title,
  description,
  location,
  date,
  organizationId
) => {

  const query = `
    UPDATE projects
    SET
      title = $1,
      description = $2,
      location = $3,
      project_date = $4,
      organization_id = $5
    WHERE project_id = $6
    RETURNING project_id
  `;

  const queryParams = [
    title,
    description,
    location,
    date,
    organizationId,
    projectId
  ];

  const result =
    await pool.query(query, queryParams);

  if (result.rows.length === 0) {

    throw new Error(
      'Failed to update project'
    );
  }

  return result.rows[0].project_id;
};

// Export model functions
export {
  getAllProjects,
  getUpcomingProjects,
  getProjectDetails,
  getProjectsByOrganizationId,
  createProject,
  updateProject
};