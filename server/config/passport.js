const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/User');
const Profile = require('../models/Profile');

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${BACKEND_URL}/api/auth/google/callback`
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      if (!profile || !profile.emails) {
        return done(new Error('Google profile missing email'), null);
      }
      let user = await User.findOne({ email: email.toLowerCase() });

      if (!user) {
        // Create new user if doesn't exist
        user = await User.create({
          name: profile.displayName,
          email: email.toLowerCase(),
          password: require('crypto').randomBytes(16).toString('hex'),
          loginMethod: 'google',
          isPaid: false
        });
        await Profile.create({ user: user._id, email: user.email, displayName: user.name });
      }
      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
));

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: `${BACKEND_URL}/api/auth/facebook/callback`,
    profileFields: ['id', 'displayName', 'emails']
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails ? profile.emails[0].value : `${profile.id}@facebook.com`;
      let user = await User.findOne({ email: email.toLowerCase() });

      if (!user) {
        user = await User.create({
          name: profile.displayName,
          email: email.toLowerCase(),
          password: require('crypto').randomBytes(16).toString('hex'),
          loginMethod: 'facebook',
          isPaid: false
        });
        await Profile.create({ user: user._id, email: user.email, displayName: user.name });
      }
      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

module.exports = passport;
