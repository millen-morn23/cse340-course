import {
  body,
  validationResult
} from 'express-validator';

import {
  getAllCategories,
  getCategoryDetails,
  getProjectsByCategoryId,
  getCategoriesByProjectId,
  updateCategoryAssignments,
  createCategory,
  updateCategory
} from '../models/categories.js';

import {
  getProjectDetails
} from '../models/projects.js';

// Category validation rules
const categoryValidation = [

  body('name')
    .trim()
    .notEmpty()
    .withMessage('Category name is required')
    .isLength({ min: 3, max: 100 })
    .withMessage(
      'Category name must be between 3 and 100 characters'
    )
];

// Show all categories page
const showCategoriesPage = async (
  req,
  res,
  next
) => {

  try {

    const categories =
      await getAllCategories();

    const title = 'Categories';

    res.render('categories', {
      title,
      categories
    });

  } catch (error) {

    next(error);
  }
};

// Show ONE category details page
const showCategoryDetailsPage = async (
  req,
  res,
  next
) => {

  try {

    // Get category ID from route parameter
    const categoryId = req.params.id;

    // Load category details
    const category =
      await getCategoryDetails(categoryId);

    // Handle missing category
    if (!category) {

      const err =
        new Error('Category Not Found');

      err.status = 404;

      return next(err);
    }

    // Load projects for this category
    const projects =
      await getProjectsByCategoryId(categoryId);

    const title = category.name;

    // Render category details page
    res.render('category', {
      title,
      category,
      projects
    });

  } catch (error) {

    next(error);
  }
};

// Show new category form
const showNewCategoryForm = async (
  req,
  res
) => {

  const title = 'Add New Category';

  res.render('new-category', {
    title
  });
};

// Process new category form
const processNewCategoryForm = async (
  req,
  res
) => {

  const errors =
    validationResult(req);

  if (!errors.isEmpty()) {

    errors.array().forEach((error) => {

      req.flash('error', error.msg);
    });

    return res.redirect('/new-category');
  }

  const { name } = req.body;

  try {

    const categoryId =
      await createCategory(name);

    req.flash(
      'success',
      'Category created successfully!'
    );

    res.redirect(
      `/category/${categoryId}`
    );

  } catch (error) {

    console.error(error);

    req.flash(
      'error',
      'There was an error creating the category.'
    );

    res.redirect('/new-category');
  }
};

// Show edit category form
const showEditCategoryForm = async (
  req,
  res,
  next
) => {

  try {

    const categoryId = req.params.id;

    const category =
      await getCategoryDetails(categoryId);

    if (!category) {

      const err =
        new Error('Category Not Found');

      err.status = 404;

      return next(err);
    }

    const title =
      `Edit ${category.name}`;

    res.render('edit-category', {
      title,
      category
    });

  } catch (error) {

    next(error);
  }
};

// Process edit category form
const processEditCategoryForm = async (
  req,
  res
) => {

  const categoryId = req.params.id;

  const errors =
    validationResult(req);

  if (!errors.isEmpty()) {

    errors.array().forEach((error) => {

      req.flash('error', error.msg);
    });

    return res.redirect(
      `/edit-category/${categoryId}`
    );
  }

  const { name } = req.body;

  try {

    await updateCategory(
      categoryId,
      name
    );

    req.flash(
      'success',
      'Category updated successfully!'
    );

    res.redirect(
      `/category/${categoryId}`
    );

  } catch (error) {

    console.error(error);

    req.flash(
      'error',
      'There was an error updating the category.'
    );

    res.redirect(
      `/edit-category/${categoryId}`
    );
  }
};

// Show assign categories form
const showAssignCategoriesForm = async (
  req,
  res,
  next
) => {

  try {

    const projectId =
      req.params.projectId;

    const projectDetails =
      await getProjectDetails(projectId);

    const categories =
      await getAllCategories();

    const assignedCategories =
      await getCategoriesByProjectId(projectId);

    const title =
      'Assign Categories to Project';

    res.render('assign-categories', {
      title,
      projectId,
      projectDetails,
      categories,
      assignedCategories
    });

  } catch (error) {

    next(error);
  }
};

// Process assign categories form
const processAssignCategoriesForm = async (
  req,
  res,
  next
) => {

  try {

    const projectId =
      req.params.projectId;

    const selectedCategoryIds =
      req.body.categoryIds || [];

    // Ensure categoryIds is always an array
    const categoryIdsArray =
      Array.isArray(selectedCategoryIds)
        ? selectedCategoryIds
        : [selectedCategoryIds];

    await updateCategoryAssignments(
      projectId,
      categoryIdsArray
    );

    req.flash(
      'success',
      'Categories updated successfully.'
    );

    res.redirect(
      `/project/${projectId}`
    );

  } catch (error) {

    next(error);
  }
};

// Export controller functions
export {
  showCategoriesPage,
  showCategoryDetailsPage,
  showNewCategoryForm,
  processNewCategoryForm,
  showEditCategoryForm,
  processEditCategoryForm,
  showAssignCategoriesForm,
  processAssignCategoriesForm,
  categoryValidation
};