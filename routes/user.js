const express = require("express");
const router = express.Router();
const { userModel, validateUser } = require("../models/user");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const { customUserLoggedIn } = require('../middlewares/auth');

// Registration Route
router.post('/register', async function (req, res) {
  try {
    let { name, email, password, phone, age, address } = req.body;
    if (!age) return res.status(400).send("Age is required");
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message); // Send validation error

    let user = await userModel.findOne({ email });
    if (user) return res.status(400).send("User already exists");

    const saltRounds = 10;
    let hashedPassword = await bcrypt.hash(password, saltRounds);
    let newUser = new userModel({
      name,
      email,
      password: hashedPassword,
      phone,
      age,
      address
    });

    await newUser.save();
    let token = jwt.sign({ email: newUser.email, userId: newUser._id }, process.env.JWT_KEY, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true });
    res.redirect('/products');
  } catch (error) {
    console.error("Error creating user: ", error.message); 
    res.status(500).send("Error creating user");
  }
});


router.get('/login', function(req, res){
  res.render('user_login');
});
router.post('/login', passport.authenticate('local', {
  successRedirect: '/products',
  failureRedirect: '/users/login',
  failureFlash: true
}));


router.get('/register', function(req, res){
  res.render('user_register');
});

router.get('/logout', function(req, res, next){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.clearCookie('token');
    res.redirect('/users/login');
  });
});

module.exports = router;
