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

import { testErrorPage } from './controllers/errors.js';

const router = express.Router();

// Home route
router.get('/', showHomePage);

// Organizations routes
router.get('/organizations', showOrganizationsPage);

// New organization form route
router.get('/new-organization', showNewOrganizationForm);

// Edit organization form route
router.get(
  '/edit-organization/:id',
  showEditOrganizationForm
);

// Handle new organization form submission
router.post(
  '/new-organization',
  organizationValidation,
  processNewOrganizationForm
);

// Handle edit organization form submission
router.post(
  '/edit-organization/:id',
  organizationValidation,
  processEditOrganizationForm
);

// Dynamic organization details route
router.get('/organization/:id', showOrganizationDetailsPage);

// Projects routes
router.get('/projects', showProjectsPage);

// New project form route
router.get(
  '/new-project',
  showNewProjectForm
);

// Edit project form route
router.get(
  '/edit-project/:id',
  showEditProjectForm
);

// Handle new project form submission
router.post(
  '/new-project',
  projectValidation,
  processNewProjectForm
);

// Handle edit project form submission
router.post(
  '/edit-project/:id',
  projectValidation,
  processEditProjectForm
);

// Dynamic project details route
router.get('/project/:id', showProjectDetailsPage);

// Assign categories routes
router.get(
  '/assign-categories/:projectId',
  showAssignCategoriesForm
);

router.post(
  '/assign-categories/:projectId',
  processAssignCategoriesForm
);

// Categories routes
router.get('/categories', showCategoriesPage);

// New category form route
router.get(
  '/new-category',
  showNewCategoryForm
);

// Edit category form route
router.get(
  '/edit-category/:id',
  showEditCategoryForm
);

// Handle new category form submission
router.post(
  '/new-category',
  categoryValidation,
  processNewCategoryForm
);

// Handle edit category form submission
router.post(
  '/edit-category/:id',
  categoryValidation,
  processEditCategoryForm
);

// Dynamic category details route
router.get('/category/:id', showCategoryDetailsPage);

// Error testing route
router.get('/test-error', testErrorPage);

export default router;