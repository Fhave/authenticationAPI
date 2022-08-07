// Check for token and header
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();
const { SECRET } = process.env;

exports.auth = (req, res, next) => {
  // Get token from header
  const token = req.header("x-auth-token");

  // Check if token doesn't exist
  if(!token) 
      res
        .status(401)
        .json({
          statusCode: 401,
          message: 'token not found, Not authorized'
        });

  try {
    const decoded = jwt.verify(token, SECRET);

    // assign user to request object
    req.decoded = decoded.email;

    return next()
  } catch (err) {
    return res.status(401).json({statusCode: 401, message: 'Invalid Token'});
  }
}

