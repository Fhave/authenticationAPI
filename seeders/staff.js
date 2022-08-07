const User = require('../models/User');
const bcrypt = require('bcrypt');
// const dotenv = require('dotenv').config();

exports.seedStaff = () => {
  const staff = User.findOne({ userRole: "staff"}, (err, staff) => {
    if (err) throw err;
    if (staff) {
      return "Staff account already exists"
    }
    
    const newUser = new User({
      firstName: "Iyobosa",
      lastName: "Omoruyi",
      email: "iyobosaomoruyi@gmail.com",
      userRole: "staff",
      isStaff: true,
      password : "staff789"
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
            return "staff account created successfully"
          })
        })
      });
  })
}