import express from 'express';
import pool from './db/connection.js';
import { getAllProjects } from './models/projects.js';
import { getAllCategories } from './models/categories.js';
import { getAllOrganizations } from './models/organizations.js'; // ✅ ADDED

// Test database connection (temporary)
pool.query('SELECT NOW()')
  .then(res => {
    console.log('Database connected:', res.rows);
  })
  .catch(err => {
    console.error('Database error:', err);
  });

// Define the application environment
const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'production';

// Define the port number
const PORT = process.env.PORT || 3000;

const app = express();

// EJS setup
app.set('view engine', 'ejs');
app.set('views', './views');

// Static files
app.use(express.static('public'));

// Dynamic year middleware
app.use((req, res, next) => {
  res.locals.year = new Date().getFullYear();
  next();
});

// Routes
app.get('/', (req, res) => {
  res.render('home', { title: 'Home' });
});

// ✅ FIXED ORGANIZATIONS ROUTE
app.get('/organizations', async (req, res) => {
  try {
    const organizations = await getAllOrganizations();

    res.render('organizations', {
      title: 'Organizations',
      organizations
    });
  } catch (error) {
    console.error('Error loading organizations:', error);
    res.status(500).send('Server Error');
  }
});

// Projects
app.get('/projects', async (req, res) => {
  try {
    const projects = await getAllProjects();

    res.render('projects', {
      title: 'Projects',
      projects
    });
  } catch (error) {
    console.error('Error loading projects:', error);
    res.status(500).send('Server Error');
  }
});

// Categories
app.get('/categories', async (req, res) => {
  try {
    const categories = await getAllCategories();

    res.render('categories', {
      title: 'Categories',
      categories
    });
  } catch (error) {
    console.error('Error loading categories:', error);
    res.status(500).send('Server Error');
  }
});

// Server listener
app.listen(PORT, () => {
  console.log(`Server is running at http://127.0.0.1:${PORT}`);
  console.log(`Environment: ${NODE_ENV}`);
});