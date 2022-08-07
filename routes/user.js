const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const auth = require('../middleware/auth')

// import the router controller
const usersController = require('../controllers/usersController');

// Register New User
router.post('/api/auth/register', usersController.registerUser);

// Login user
router.post('/api/auth/login',
  [
    check("email", "please enter a valid email").isEmail(),
    check("password", "please enter a valid password").exists()
  ],
  usersController.loginUser
);

// Get logged in user
router.get('/api/auth', auth, usersController.getLoggedInUser); 

// Log out
router.get('/api/auth/logout' , usersController.logoutUser);

router.patch('/api/auth/reset', usersController.forgotPassword);

module.exports = router;