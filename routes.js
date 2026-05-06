import express from 'express';

import { showHomePage } from './controllers/index.js';

import {
  showOrganizationsPage,
  showOrganizationDetailsPage
} from './controllers/organizations.js';

import {
  showProjectsPage,
  showProjectDetailsPage
} from './controllers/projects.js';

import {
  showCategoriesPage,
  showCategoryDetailsPage
} from './controllers/categories.js';

import { testErrorPage } from './controllers/errors.js';

const router = express.Router();

// Home route
router.get('/', showHomePage);

// Organizations routes
router.get('/organizations', showOrganizationsPage);

// Dynamic organization details route
router.get('/organization/:id', showOrganizationDetailsPage);

// Projects routes
router.get('/projects', showProjectsPage);

// Dynamic project details route
router.get('/project/:id', showProjectDetailsPage);

// Categories routes
router.get('/categories', showCategoriesPage);

// Dynamic category details route
router.get('/category/:id', showCategoryDetailsPage);

// Error testing route
router.get('/test-error', testErrorPage);

export default router;