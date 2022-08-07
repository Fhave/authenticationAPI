const User = require('../models/User');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv').config();
const { SECRET } = process.env;

// POST api/auth/register
// Auth all users and get token
// Public access
exports.registerUser = async(req,res) => {
  try { 
    const {firstName, lastName, email, password } = req.body;
    const user = await User.findOne({email: email});

    if(user) 
      return res
        .status(400)
        .json({
          statusCode: 400, 
          message: 'User with this email exists already'
        });
      
    const newUser = new User({
      firstName,
      lastName,
      email,
      password
    });
    
    bcrypt.genSalt(10, (err, salt) => {
      console.log(newUser);
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) {
          console.log(err.message);
          return res.status(500).json({message: err.message});
        }
        // set password to hashed
        newUser.password = hash;
        // save user
        newUser.save((err, savedUser) => {
          if (err) {
            console.log(err.message);
            return res.status(500).json('Server error 1')
          }
          // Create jwt for new user
          jwt.sign(
            {
              firstName: newUser.firstName,
              lastName: newUser.lastName,
              email: newUser.email,
              userRole: newUser.userRole,
              isStaff: newUser.isStaff,
              isAdmin: newUser.isAdmin,
              isManager: newUser.isManager
            }, 
            SECRET, 
            {expiresIn: 360000}, 
            (err, token) => {
              if (err) {
                console.log(err.message);
                return res.status(500).json('Server error 2')
              }
              return res.status(200).json(
                {message: "User registered successfully",
                token}
              );
            }
          );
          })
        })
      });

  } catch (err) {
    console.log(err.message);
    res.status(500).json('Server error 3')
  }
}

// GET  api/auth
// Auth all users and get token
// Public access
exports.getLoggedInUser = async(req,res) => {
  try {
    const user = await User.findOne(req.user.id).select("-password");

    res.json({
      statusCode: 200,
      message: "User gotten successfully",
      user
    });

  } catch (err) {
    console.log(err.message);
    res.status(500).json('Server error 4')
  }
}


// POST api/auth/login
// Auth all users and get token
// Public access
exports.loginUser = async (req,res) => {
  // Check for errors
  const errors = validationResult(req);
  if(!errors.isEmpty())
    return res.status(400).json({errors: errors.array()});
  
  const {email, password} = req.body;

  try {
    let user = await User.findOne({email: email});

    if(!user) 
      return res
        .status(400)
        .json({
          statusCode: 400, 
          message: 'Invalid credentials'
        });

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch)
      return res
        .status(400)
        .json({
          statusCode: 401, 
          message: 'Invalid Credentials'
        });

    const payload = {
      user: {
        id:user.id
      }
    };

    jwt.sign(
      payload,
      SECRET, 
      {
        expiresIn: 360000,
      },
      (err, token) => {
        if (err) throw err;
        res.json({
          statusCode: 200,
          message: 'Logged In Successfully',
          user: {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            userRole: user.userRole,
            isStaff: user.isStaff,
            isAdmin: user.isAdmin,
            isManager: user.isManager
          }, 
          token
        })
      }
    );   
    console.log(user)
  } catch (err) {
      console.log(err.message);
      res.status(500).json('Server Error 4');
  }
}

// Get api/auth/logout
// Auth all users and get token
// Public access
exports.logoutUser = async (req, res) => {

}

// Check User role
exports.checkIfAdmin = (req, res, next) => {
  if (req.user.userRole !== "admin") {
    return res.status(401).json({message: "You are not an admin"})
  }
  return next()
}

exports.checkIfManager = (req, res, next) => {
  if (req.user.userRole !== "manager") {
    return res.status(401).json({message: "You are not a manager"})
  }
  return next()
}

exports.checkIfStaff = (req, res, next) => {
  if (req.user.userRole !== "staff") {
    return res.status(401).json({message: "You are not a staff"})
  }
  return next()
}

// Forgot Password
exports.forgotPassword =  async (req, res) => {
  try{
    const {firstName, lastName, email} = await req.body;
    const password = Math.random().toString(36).substr(2,8);
    let user = await User.findOne({email: email});
    if(!user) 
      return res
        .status(400)
        .json({
          statusCode: 400, 
          message: 'Invalid credentials'
        });

    const output = {
      firstName,
      lastName,
      email,
      password
    }
    
    const newUser = new User({
      firstName,
      lastName,
      email,
      password
    });
    
    bcrypt.genSalt(10, (err, salt) => {
      console.log(newUser);
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) {
          console.log(err.message);
          return res.status(500).json({message: err.message});
        }
        // set password to hashed
        newUser.password = hash;
        // save user
        newUser.save()
        })
      });

    const mail = `
    <p>${req.body.email} requested a new password</p>
    <h3>Password Recovery</h3>
    <ul>  
      <li>First Name: ${req.body.firstName}</li>
      <li>Last Name: ${req.body.lastName}</li>
      <li>Email: ${req.body.email}</li>
    </ul>
    <h3>Message</h3>
    <p>This is your new password: ${password}</p>
  `
    // Create Transporter
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
        clientId: process.env.OAUTH_CLIENTID,
        clientSecret: process.env.OAUTH_CLIENT_SECRET,
        refreshToken: process.env.OAUTH_REFRESH_TOKEN
      }
    });

     // Mail Options To User
     let mailOptions = {
      from: 'omosiyobo@gmail.com', //Sender address
      to: `${req.body.email}`, // Receiver address
      subject: 'Password Recovery',
      text: 'Hi',
      html: mail
    };

    transporter.sendMail(mailOptions, function(err, data) {
      if (err) {
        console.log("Error: " + err);
      } else {
        console.log("Email sent successfully");
        console.log(data);
      }
    });

    res.status(201).json({
      message: "Message sent",
      output
    })
  } catch (err) {
    console.log({message: err.message});
    res.status(500);
  }
}
