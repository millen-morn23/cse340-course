import express from 'express';

import { showHomePage } from './controllers/index.js';

import {
  showOrganizationsPage,
  showOrganizationDetailsPage,
  showNewOrganizationForm,
  showEditOrganizationForm,
  processNewOrganizationForm,
  processEditOrganizationForm,
  organizationValidation
} from './controllers/organizations.js';

import {
  showProjectsPage,
  showProjectDetailsPage,
  showNewProjectForm,
  showEditProjectForm,
  processNewProjectForm,
  processEditProjectForm,
  projectValidation
} from './controllers/projects.js';

import {
  showCategoriesPage,
  showCategoryDetailsPage,
  showNewCategoryForm,
  processNewCategoryForm,
  showEditCategoryForm,
  processEditCategoryForm,
  showAssignCategoriesForm,
  processAssignCategoriesForm,
  categoryValidation
} from './controllers/categories.js';

import {
  requireLogin,
  requireRole,
  showUserRegistrationForm,
  processUserRegistrationForm,
  showLoginForm,
  processLoginForm,
  showDashboard,
  showUsersPage,
  processLogout
} from './controllers/users.js';

import {
  processVolunteer,
  processRemoveVolunteer
} from './controllers/volunteers.js';

import { testErrorPage } from './controllers/errors.js';

const router = express.Router();

// Home route
router.get('/', showHomePage);

// Organizations routes
router.get('/organizations', showOrganizationsPage);

// New organization form route
router.get(
  '/new-organization',
  requireRole('admin'),
  showNewOrganizationForm
);

// Edit organization form route
router.get(
  '/edit-organization/:id',
  requireRole('admin'),
  showEditOrganizationForm
);

// Handle new organization form submission
router.post(
  '/new-organization',
  requireRole('admin'),
  organizationValidation,
  processNewOrganizationForm
);

// Handle edit organization form submission
router.post(
  '/edit-organization/:id',
  requireRole('admin'),
  organizationValidation,
  processEditOrganizationForm
);

// Dynamic organization details route
router.get(
  '/organization/:id',
  showOrganizationDetailsPage
);

// Projects routes
router.get('/projects', showProjectsPage);

// New project form route
router.get(
  '/new-project',
  requireRole('admin'),
  showNewProjectForm
);

// Edit project form route
router.get(
  '/edit-project/:id',
  requireRole('admin'),
  showEditProjectForm
);

// Handle new project form submission
router.post(
  '/new-project',
  requireRole('admin'),
  projectValidation,
  processNewProjectForm
);

// Handle edit project form submission
router.post(
  '/edit-project/:id',
  requireRole('admin'),
  projectValidation,
  processEditProjectForm
);

// Dynamic project details route
router.get(
  '/project/:id',
  showProjectDetailsPage
);

// Volunteer routes
router.post(
  '/volunteer/:projectId',
  requireLogin,
  processVolunteer
);

router.post(
  '/remove-volunteer/:projectId',
  requireLogin,
  processRemoveVolunteer
);

// Assign categories routes
router.get(
  '/assign-categories/:projectId',
  requireRole('admin'),
  showAssignCategoriesForm
);

router.post(
  '/assign-categories/:projectId',
  requireRole('admin'),
  processAssignCategoriesForm
);

// Categories routes
router.get('/categories', showCategoriesPage);

// New category form route
router.get(
  '/new-category',
  requireRole('admin'),
  showNewCategoryForm
);

// Edit category form route
router.get(
  '/edit-category/:id',
  requireRole('admin'),
  showEditCategoryForm
);

// Handle new category form submission
router.post(
  '/new-category',
  requireRole('admin'),
  categoryValidation,
  processNewCategoryForm
);

// Handle edit category form submission
router.post(
  '/edit-category/:id',
  requireRole('admin'),
  categoryValidation,
  processEditCategoryForm
);

// Dynamic category details route
router.get(
  '/category/:id',
  showCategoryDetailsPage
);

// User registration routes
router.get(
  '/register',
  showUserRegistrationForm
);

router.post(
  '/register',
  processUserRegistrationForm
);

// User login routes
router.get(
  '/login',
  showLoginForm
);

router.post(
  '/login',
  processLoginForm
);

router.get(
  '/logout',
  processLogout
);

// Protected dashboard route
router.get(
  '/dashboard',
  requireLogin,
  showDashboard
);

// Admin users page
router.get(
  '/users',
  requireRole('admin'),
  showUsersPage
);

// Error testing route
router.get(
  '/test-error',
  testErrorPage
);

export default router;