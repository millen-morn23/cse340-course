import bcrypt from "bcrypt";

import {
  createUser,
  getAllUsers,
  authenticateUser
} from "../models/users.js";

// Middleware to protect routes
const requireLogin = (
  req,
  res,
  next
) => {

  if (!req.session.user) {

    req.flash(
      "error",
      "You must log in first."
    );

    return res.redirect("/login");
  }

  next();
};

// Middleware factory for role protection
const requireRole = (role) => {

  return (
    req,
    res,
    next
  ) => {

    if (
      req.session.user &&
      req.session.user.role_name === role
    ) {

      return next();
    }

    req.flash(
      "error",
      "You are not authorized to access that page."
    );

    return res.redirect("/dashboard");
  };
};

// Show registration form
const showUserRegistrationForm = (
  req,
  res
) => {

  res.render("register", {
    title: "Register"
  });
};

// Process registration
const processUserRegistrationForm =
  async (req, res) => {

    const {
      name,
      email,
      password
    } = req.body;

    try {

      const salt =
        await bcrypt.genSalt(10);

      const passwordHash =
        await bcrypt.hash(
          password,
          salt
        );

      await createUser(
        name,
        email,
        passwordHash
      );

      req.flash(
        "success",
        "Registration successful! Please log in."
      );

      res.redirect("/login");

    } catch (error) {

      console.error(
        "Registration error:",
        error
      );

      req.flash(
        "error",
        "An error occurred during registration."
      );

      res.redirect("/register");
    }
};

// Show login form
const showLoginForm = (
  req,
  res
) => {

  res.render("login", {
    title: "Login"
  });
};

// Process login
const processLoginForm =
  async (req, res) => {

    const {
      email,
      password
    } = req.body;

    try {

      const user =
        await authenticateUser(
          email,
          password
        );

      if (user) {

        req.session.user = user;

        req.flash(
          "success",
          "Login successful!"
        );

        console.log(
          "User logged in:",
          user
        );

        res.redirect("/dashboard");

      } else {

        req.flash(
          "error",
          "Invalid email or password."
        );

        res.redirect("/login");
      }

    } catch (error) {

      console.error(
        "Login error:",
        error
      );

      req.flash(
        "error",
        "An error occurred during login."
      );

      res.redirect("/login");
    }
};

// Show dashboard
const showDashboard = (
  req,
  res
) => {

  const {
    name,
    email
  } = req.session.user;

  res.render("dashboard", {
    title: "Dashboard",
    name,
    email
  });
};

// Show users page
const showUsersPage =
  async (req, res) => {

    try {

      const users =
        await getAllUsers();

      res.render("users", {
        title: "Users",
        users
      });

    } catch (error) {

      console.error(
        "Users page error:",
        error
      );

      req.flash(
        "error",
        "Unable to load users."
      );

      res.redirect("/dashboard");
    }
};

// Process logout
const processLogout = (
  req,
  res
) => {

  if (req.session.user) {
    delete req.session.user;
  }

  req.flash(
    "success",
    "Logout successful!"
  );

  res.redirect("/login");
};

export {
  requireLogin,
  requireRole,
  showUserRegistrationForm,
  processUserRegistrationForm,
  showLoginForm,
  processLoginForm,
  showDashboard,
  showUsersPage,
  processLogout
};