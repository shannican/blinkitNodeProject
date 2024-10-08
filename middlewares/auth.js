const jwt = require('jsonwebtoken');
require('dotenv').config();

async function customUserLoggedIn(req, res, next) {
  try {
    const token = req.cookies.token;
    if (!token) return res.redirect('/users/login');

    const verified = jwt.verify(token, process.env.JWT_KEY);
    req.user = verified; // Set user details from token
    next();
  } catch (err) {
    console.error('JWT verification error:', err);
    return res.redirect('/users/login');
  }
}

module.exports = { customUserLoggedIn };
