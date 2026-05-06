import pool from '../db/connection.js';

// Get all organizations
const getAllOrganizations = async () => {
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

// Get details for ONE organization
const getOrganizationDetails = async (organizationId) => {

  const query = `
    SELECT
      id,
      name,
      description,
      image,
      contact_email
    FROM organizations
    WHERE id = $1
  `;

  const queryParams = [organizationId];

  const result = await pool.query(query, queryParams);

  // Return first matching row or null
  return result.rows.length > 0
    ? result.rows[0]
    : null;
};

// Export model functions
export {
  getAllOrganizations,
  getOrganizationDetails
};