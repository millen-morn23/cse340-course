import pool from '../db/connection.js';

// Add volunteer
const addVolunteer = async (
  userId,
  projectId
) => {

  const query = `
    INSERT INTO project_volunteers (
      user_id,
      project_id
    )
    VALUES ($1, $2)
  `;

  const queryParams = [
    userId,
    projectId
  ];

  await pool.query(
    query,
    queryParams
  );
};

// Remove volunteer
const removeVolunteer = async (
  userId,
  projectId
) => {

  const query = `
    DELETE FROM project_volunteers
    WHERE user_id = $1
    AND project_id = $2
  `;

  const queryParams = [
    userId,
    projectId
  ];

  await pool.query(
    query,
    queryParams
  );
};

// Get projects user volunteered for
const getVolunteerProjects =
  async (userId) => {

    const query = `
      SELECT
        p.project_id,
        p.title,
        p.description,
        p.location,
        p.project_date
      FROM projects p

      JOIN project_volunteers pv
        ON p.project_id = pv.project_id

      WHERE pv.user_id = $1

      ORDER BY p.project_date
    `;

    const queryParams = [userId];

    const result = await pool.query(
      query,
      queryParams
    );

    return result.rows;
  };

// Check volunteer status
const isVolunteer = async (
  userId,
  projectId
) => {

  const query = `
    SELECT *
    FROM project_volunteers
    WHERE user_id = $1
    AND project_id = $2
  `;

  const queryParams = [
    userId,
    projectId
  ];

  const result = await pool.query(
    query,
    queryParams
  );

  return result.rows.length > 0;
};

export {
  addVolunteer,
  removeVolunteer,
  getVolunteerProjects,
  isVolunteer
};