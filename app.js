const express = require('express');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');
const { userModel } = require('./models/user'); // Ensure this path is correct

const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const adminRouter = require('./routes/admin');
const productRouter = require('./routes/product');
const categoriesRouter = require('./routes/categories');
const userRouter = require('./routes/user');
const cartRouter = require('./routes/cart');

require('dotenv').config();
require('./config/google_oauth');
require('./config/db');
require('./config/passport');

// Set up view engine
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize cookie parser and session management
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// Initialize connect-flash
app.use(flash());

// Configure Passport serialization
passport.serializeUser((user, done) => {
  done(null, user.id); // Save user id to session
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await userModel.findById(id); // Retrieve user from DB
    if (!user) {
      return done(new Error('User not found'));
    }
    done(null, user); // Pass user to session if found
  } catch (err) {
    done(err, null); // Handle error, pass error to done
  }
});

// Set up routes
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/admin', adminRouter);
app.use('/products', productRouter);
app.use('/categories', categoriesRouter);
app.use('/users', userRouter);
app.use('/cart', cartRouter);

// Error handling middleware (optional)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
