import {
  body,
  validationResult
} from 'express-validator';

import {
  getUpcomingProjects,
  getProjectDetails,
  createProject,
  updateProject
} from '../models/projects.js';

import {
  getAllOrganizations
} from '../models/organizations.js';

import {
  getCategoriesByProjectId
} from '../models/categories.js';

// Number of upcoming projects to display
const NUMBER_OF_UPCOMING_PROJECTS = 5;

// Project validation rules
const projectValidation = [

  body('title')
    .trim()
    .notEmpty()
    .withMessage('Project title is required')
    .isLength({ min: 3, max: 200 })
    .withMessage(
      'Project title must be between 3 and 200 characters'
    ),

  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ max: 1000 })
    .withMessage(
      'Description must be less than 1000 characters'
    ),

  body('location')
    .trim()
    .notEmpty()
    .withMessage('Location is required')
    .isLength({ max: 200 })
    .withMessage(
      'Location must be less than 200 characters'
    ),

  body('date')
    .notEmpty()
    .withMessage('Date is required')
    .isISO8601()
    .withMessage(
      'Date must be valid'
    ),

  body('organizationId')
    .notEmpty()
    .withMessage('Organization is required')
    .isInt()
    .withMessage(
      'Organization must be valid'
    )
];

// Show upcoming projects page
const showProjectsPage = async (
  req,
  res,
  next
) => {

  try {

    const projects =
      await getUpcomingProjects(
        NUMBER_OF_UPCOMING_PROJECTS
      );

    const title =
      'Upcoming Service Projects';

    res.render('projects', {
      title,
      projects
    });

  } catch (error) {

    next(error);
  }
};

// Show ONE project details page
const showProjectDetailsPage = async (
  req,
  res,
  next
) => {

  try {

    // Get project ID from route parameter
    const projectId = req.params.id;

    // Load project details
    const project =
      await getProjectDetails(projectId);

    // Handle missing project
    if (!project) {

      const err = new Error(
        'Project Not Found'
      );

      err.status = 404;

      return next(err);
    }

    // Load categories for this project
    const categories =
      await getCategoriesByProjectId(
        projectId
      );

    const title = project.title;

    // Render project details page
    res.render('project', {
      title,
      project,
      categories
    });

  } catch (error) {

    next(error);
  }
};

// Show new project form
const showNewProjectForm = async (
  req,
  res,
  next
) => {

  try {

    const organizations =
      await getAllOrganizations();

    const title =
      'Add New Service Project';

    res.render('new-project', {
      title,
      organizations
    });

  } catch (error) {

    next(error);
  }
};

// Show edit project form
const showEditProjectForm = async (
  req,
  res,
  next
) => {

  try {

    const projectId = req.params.id;

    const project =
      await getProjectDetails(projectId);

    if (!project) {

      const err = new Error(
        'Project Not Found'
      );

      err.status = 404;

      return next(err);
    }

    const organizations =
      await getAllOrganizations();

    const title =
      `Edit ${project.title}`;

    res.render('edit-project', {
      title,
      project,
      organizations
    });

  } catch (error) {

    next(error);
  }
};

// Process new project form
const processNewProjectForm = async (
  req,
  res
) => {

  // Check validation errors
  const errors =
    validationResult(req);

  if (!errors.isEmpty()) {

    errors.array().forEach((error) => {

      req.flash('error', error.msg);
    });

    return res.redirect('/new-project');
  }

  const {
    title,
    description,
    location,
    date,
    organizationId
  } = req.body;

  try {

    const newProjectId =
      await createProject(
        title,
        description,
        location,
        date,
        organizationId
      );

    req.flash(
      'success',
      'New service project created successfully!'
    );

    res.redirect(
      `/project/${newProjectId}`
    );

  } catch (error) {

    console.error(
      'Error creating project:',
      error
    );

    req.flash(
      'error',
      'There was an error creating the project.'
    );

    res.redirect('/new-project');
  }
};

// Process edit project form
const processEditProjectForm = async (
  req,
  res
) => {

  const projectId = req.params.id;

  // Check validation errors
  const errors =
    validationResult(req);

  if (!errors.isEmpty()) {

    errors.array().forEach((error) => {

      req.flash('error', error.msg);
    });

    return res.redirect(
      `/edit-project/${projectId}`
    );
  }

  const {
    title,
    description,
    location,
    date,
    organizationId
  } = req.body;

  try {

    await updateProject(
      projectId,
      title,
      description,
      location,
      date,
      organizationId
    );

    req.flash(
      'success',
      'Project updated successfully!'
    );

    res.redirect(
      `/project/${projectId}`
    );

  } catch (error) {

    console.error(
      'Error updating project:',
      error
    );

    req.flash(
      'error',
      'There was an error updating the project.'
    );

    res.redirect(
      `/edit-project/${projectId}`
    );
  }
};

// Export controller functions
export {
  showProjectsPage,
  showProjectDetailsPage,
  showNewProjectForm,
  showEditProjectForm,
  processNewProjectForm,
  processEditProjectForm,
  projectValidation
};