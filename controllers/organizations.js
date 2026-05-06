import {
  getAllOrganizations,
  getOrganizationDetails
} from '../models/organizations.js';

import {
  getProjectsByOrganizationId
} from '../models/projects.js';

// Show all organizations
const showOrganizationsPage = async (req, res, next) => {

  try {

    const organizations = await getAllOrganizations();

    const title = 'Organizations';

    res.render('organizations', {
      title,
      organizations
    });

  } catch (error) {
    next(error);
  }
};

// Show ONE organization details page
const showOrganizationDetailsPage = async (req, res, next) => {

  try {

    // Get organization ID from route parameter
    const organizationId = req.params.id;

    // Load organization details
    const organizationDetails =
      await getOrganizationDetails(organizationId);

    // Load organization projects
    const projects =
      await getProjectsByOrganizationId(organizationId);

    // Handle missing organization
    if (!organizationDetails) {

      const err = new Error('Organization Not Found');

      err.status = 404;

      return next(err);
    }

    const title = organizationDetails.name;

    // Render details page
    res.render('organization', {
      title,
      organizationDetails,
      projects
    });

  } catch (error) {
    next(error);
  }
};

// Export controller functions
export {
  showOrganizationsPage,
  showOrganizationDetailsPage
};