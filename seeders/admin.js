const User = require('../models/User');
const bcrypt = require('bcrypt');
// const dotenv = require('dotenv').config();

exports.seedAdmin = () => {
  const admin = User.findOne({ userRole: "admin"}, (err, admin) => {
    if (err) throw err;
    if (admin) {
      return "Admin account already exists"
    }
    
    const newUser = new User({
      firstName: "Iyobosa",
      lastName: "Omoruyi",
      email: "omosiyobo@gmail.com",
      userRole: "admin",
      isAdmin: true,
      password : "admin123"
    });

      bcrypt.genSalt(10, (err, salt) => {
        console.log(newUser);
        if (err) throw err;
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          // set password to hashed
          newUser.password = hash;
          // save user
          newUser.save((err, savedUser) => {
            if (err) throw err;
            return "admin account created successfully"
          })
        })
      });
  })
}