const User = require('../models/User');
const bcrypt = require('bcrypt');
// const dotenv = require('dotenv').config();

exports.seedManager = () => {
  const manager = User.findOne({ userRole: "manager"}, (err, manager) => {
    if (err) throw err;
    if (manager) {
      return "Manager account already exists"
    }
    
    const newUser = new User({
      firstName: "Iyobosa",
      lastName: "Omoruyi",
      email: "iyobosaomoruyi@yahoo.com",
      userRole: "manager",
      isManager: true,
      password : "manager456"
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