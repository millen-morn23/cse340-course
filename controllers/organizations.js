import {
  body,
  validationResult
} from 'express-validator';

import {
  getAllOrganizations,
  getOrganizationDetails,
  createOrganization,
  updateOrganization
} from '../models/organizations.js';

import {
  getProjectsByOrganizationId
} from '../models/projects.js';

// Define validation and sanitization rules
const organizationValidation = [

  body('name')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Organization name is required')
    .isLength({ min: 3, max: 150 })
    .withMessage(
      'Organization name must be between 3 and 150 characters'
    ),

  body('description')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Organization description is required')
    .isLength({ max: 500 })
    .withMessage(
      'Organization description cannot exceed 500 characters'
    ),

  body('contactEmail')
    .normalizeEmail()
    .notEmpty()
    .withMessage('Contact email is required')
    .isEmail()
    .withMessage(
      'Please provide a valid email address'
    )
];

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

// Show new organization form
const showNewOrganizationForm = async (req, res) => {

  const title = 'Add New Organization';

  res.render('new-organization', {
    title
  });
};

// Show edit organization form
const showEditOrganizationForm = async (
  req,
  res,
  next
) => {

  try {

    const organizationId = req.params.id;

    const organizationDetails =
      await getOrganizationDetails(organizationId);

    if (!organizationDetails) {

      const err = new Error('Organization Not Found');

      err.status = 404;

      return next(err);
    }

    const title =
      `Edit ${organizationDetails.name}`;

    res.render('edit-organization', {
      title,
      organizationDetails
    });

  } catch (error) {

    next(error);
  }
};

// Process new organization form
const processNewOrganizationForm = async (req, res) => {

  // Check for validation errors
  const results = validationResult(req);

  if (!results.isEmpty()) {

    // Save validation errors as flash messages
    results.array().forEach((error) => {

      req.flash('error', error.msg);
    });

    // Redirect back to form
    return res.redirect('/new-organization');
  }

  const {
    name,
    description,
    contactEmail
  } = req.body;

  // Placeholder image for all new organizations
  const image = '/images/placeholder-logo.png';

  const organizationId =
    await createOrganization(
      name,
      description,
      contactEmail,
      image
    );

  // Set flash success message
  req.flash(
    'success',
    'Organization added successfully!'
  );

  // Redirect to new organization page
  res.redirect(`/organization/${organizationId}`);
};

// Process edit organization form
const processEditOrganizationForm = async (
  req,
  res
) => {

  const organizationId = req.params.id;

  // Check validation errors
  const results = validationResult(req);

  if (!results.isEmpty()) {

    results.array().forEach((error) => {

      req.flash('error', error.msg);
    });

    return res.redirect(
      `/edit-organization/${organizationId}`
    );
  }

  const {
    name,
    description,
    contactEmail,
    logoFilename
  } = req.body;

  await updateOrganization(
    organizationId,
    name,
    description,
    contactEmail,
    logoFilename
  );

  req.flash(
    'success',
    'Organization updated successfully!'
  );

  res.redirect(`/organization/${organizationId}`);
};

// Export controller functions
export {
  showOrganizationsPage,
  showOrganizationDetailsPage,
  showNewOrganizationForm,
  showEditOrganizationForm,
  processNewOrganizationForm,
  processEditOrganizationForm,
  organizationValidation
};