import express from 'express';
import pool from './db/connection.js';
import router from './routes.js';

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

// Middleware to log all incoming requests
app.use((req, res, next) => {
  if (NODE_ENV === 'development') {
    console.log(`${req.method} ${req.url}`);
  }

  next();
});

// Middleware to make NODE_ENV available to all templates
app.use((req, res, next) => {
  res.locals.NODE_ENV = NODE_ENV;
  next();
});

// Static files
app.use(express.static('public'));

// Dynamic year middleware
app.use((req, res, next) => {
  res.locals.year = new Date().getFullYear();
  next();
});

// Use imported router
app.use(router);

// Catch-all route for 404 errors
app.use((req, res, next) => {
  const err = new Error('Page Not Found');
  err.status = 404;

  next(err);
});

// Global error handler
app.use((err, req, res, next) => {

  // Log error details
  console.error('Error occurred:', err.message);
  console.error('Stack trace:', err.stack);

  // Determine status and template
  const status = err.status || 500;
  const template = status === 404 ? '404' : '500';

  // Context for template
  const context = {
    title: status === 404 ? 'Page Not Found' : 'Server Error',
    error: err.message,
    stack: err.stack
  };

  // Render appropriate error page
  res.status(status).render(`errors/${template}`, context);
});

// Server listener
app.listen(PORT, () => {
  console.log(`Server is running at http://127.0.0.1:${PORT}`);
  console.log(`Environment: ${NODE_ENV}`);
});