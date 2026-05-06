import {
  getAllCategories,
  getCategoryDetails,
  getProjectsByCategoryId
} from '../models/categories.js';

// Show all categories page
const showCategoriesPage = async (req, res, next) => {

  try {

    const categories = await getAllCategories();

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
const showCategoryDetailsPage = async (req, res, next) => {

  try {

    // Get category ID from route parameter
    const categoryId = req.params.id;

    // Load category details
    const category =
      await getCategoryDetails(categoryId);

    // Handle missing category
    if (!category) {

      const err = new Error('Category Not Found');

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

// Export controller functions
export {
  showCategoriesPage,
  showCategoryDetailsPage
};