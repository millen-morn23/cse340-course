import dotenv from 'dotenv';

dotenv.config();

import express from 'express';
import session from 'express-session';

import flash from './src/middleware/flash.js';

import pool from './db/connection.js';
import router from './routes.js';

// Test database connection
pool.query('SELECT NOW()')
  .then(res => {

    console.log(
      'Database connected:',
      res.rows
    );
  })
  .catch(err => {

    console.error(
      'Database error:',
      err
    );
  });

// Define environment
const NODE_ENV =
  process.env.NODE_ENV?.toLowerCase()
  || 'production';

// Session secret
const SESSION_SECRET =
  process.env.SESSION_SECRET;

// Define port
const PORT =
  process.env.PORT || 3000;

const app = express();

// EJS setup
app.set('view engine', 'ejs');

app.set('views', './views');

// Session setup
app.use(session({

  secret: SESSION_SECRET,

  resave: false,

  saveUninitialized: true,

  cookie: {
    maxAge: 60 * 60 * 1000
  }
}));

// Flash middleware
app.use(flash);

// Make flash messages available globally
app.use((req, res, next) => {

  res.locals.messages =
    req.flash();

  next();
});

// Request logging middleware
app.use((req, res, next) => {

  if (NODE_ENV === 'development') {

    console.log(
      `${req.method} ${req.url}`
    );
  }

  next();
});

// Login + user middleware
app.use((req, res, next) => {

  res.locals.isLoggedIn = false;

  res.locals.user = null;

  if (
    req.session &&
    req.session.user
  ) {

    res.locals.isLoggedIn = true;

    res.locals.user =
      req.session.user;
  }

  res.locals.NODE_ENV =
    NODE_ENV;

  next();
});

// Parse form data
app.use(
  express.urlencoded({
    extended: true
  })
);

app.use(express.json());

// Static files
app.use(
  express.static('public')
);

// Dynamic year middleware
app.use((req, res, next) => {

  res.locals.year =
    new Date().getFullYear();

  next();
});

// Use routes
app.use(router);

// 404 handler
app.use((req, res, next) => {

  const err =
    new Error('Page Not Found');

  err.status = 404;

  next(err);
});

// Global error handler
app.use((err, req, res, next) => {

  console.error(
    'Error occurred:',
    err.message
  );

  console.error(
    'Stack trace:',
    err.stack
  );

  const status =
    err.status || 500;

  const template =
    status === 404
      ? '404'
      : '500';

  const context = {

    title:
      status === 404
        ? 'Page Not Found'
        : 'Server Error',

    error: err.message,

    stack: err.stack
  };

  res
    .status(status)
    .render(
      `errors/${template}`,
      context
    );
});

// Start server
app.listen(
  PORT,
  '0.0.0.0',
  () => {

    console.log(
      `Server is running on port ${PORT}`
    );

    console.log(
      `Environment: ${NODE_ENV}`
    );
  }
);