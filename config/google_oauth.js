const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { userModel } = require('../models/user');
const passport = require('passport');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback"
  },
  async function(accessToken, refreshToken, profile, cb) {
    try {
      const email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null;

      if (!email) {
        return cb(new Error('No email found'), false);
      }

      let user = await userModel.findOne({ email: email });

      if (!user) {
        user = new userModel({
          name: profile.displayName,
          email: email,
          age: 25,
        });
        await user.save();
      }
      
      cb(null, user); 
    } catch (error) {
      cb(error, false); 
    }
  }
));

passport.serializeUser(function(user, cb) {
  cb(null, user._id);
});

passport.deserializeUser(async function(id, cb) {
  try {
    let user = await userModel.findOne({ _id: id });
    cb(null, user);
  } catch (error) {
    cb(error, null);
  }
});

module.exports = passport;
