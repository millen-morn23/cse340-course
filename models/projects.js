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

// Export model functions
export {
  getAllProjects,
  getUpcomingProjects,
  getProjectDetails,
  getProjectsByOrganizationId
};