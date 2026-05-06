import {
  getUpcomingProjects,
  getProjectDetails
} from '../models/projects.js';

import {
  getCategoriesByProjectId
} from '../models/categories.js';

// Number of upcoming projects to display
const NUMBER_OF_UPCOMING_PROJECTS = 5;

// Show upcoming projects page
const showProjectsPage = async (req, res, next) => {

  try {

    const projects =
      await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);

    const title = 'Upcoming Service Projects';

    res.render('projects', {
      title,
      projects
    });

  } catch (error) {
    next(error);
  }
};

// Show ONE project details page
const showProjectDetailsPage = async (req, res, next) => {

  try {

    // Get project ID from route parameter
    const projectId = req.params.id;

    // Load project details
    const project =
      await getProjectDetails(projectId);

    // Handle missing project
    if (!project) {

      const err = new Error('Project Not Found');

      err.status = 404;

      return next(err);
    }

    // Load categories for this project
    const categories =
      await getCategoriesByProjectId(projectId);

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

// Export controller functions
export {
  showProjectsPage,
  showProjectDetailsPage
};