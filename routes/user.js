const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { auth, checkIfAdmin, checkIfManager, checkIfStaff } = require('../middleware/auth')

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
router.get('/api/auth/admin', auth, usersController.checkIfAdmin, usersController.dashboard);

router.get('/api/auth/manager', auth, usersController.checkIfManager, usersController.dashboard);

router.get('/api/auth/staff', auth, usersController.checkIfStaff, usersController.dashboard);

router.get('/api/auth/user', auth, usersController.checkIfUser, usersController.dashboard);

router.get('/api/auth/unassigned', auth, usersController.checkIfUnassigned, usersController.dashboard);

module.exports = router;