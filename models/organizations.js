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

// Create new organization
const createOrganization = async (
  name,
  description,
  contactEmail,
  image
) => {

  const query = `
    INSERT INTO organizations (
      name,
      description,
      contact_email,
      image
    )
    VALUES ($1, $2, $3, $4)
    RETURNING id
  `;

  const queryParams = [
    name,
    description,
    contactEmail,
    image
  ];

  const result =
    await pool.query(query, queryParams);

  if (result.rows.length === 0) {
    throw new Error('Failed to create organization');
  }

  return result.rows[0].id;
};

// Update organization
const updateOrganization = async (
  id,
  name,
  description,
  contactEmail,
  image
) => {

  const query = `
    UPDATE organizations
    SET
      name = $1,
      description = $2,
      contact_email = $3,
      image = $4
    WHERE id = $5
  `;

  const queryParams = [
    name,
    description,
    contactEmail,
    image,
    id
  ];

  await pool.query(query, queryParams);
};

// Export model functions
export {
  getAllOrganizations,
  getOrganizationDetails,
  createOrganization,
  updateOrganization
};