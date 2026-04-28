const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/User');
const Profile = require('../models/Profile');

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || 'missing_google_client_id',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'missing_google_secret',
    callbackURL: `${BACKEND_URL}/api/auth/google/callback`
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      if (!profile || !profile.emails) {
        return done(new Error('Google profile thiếu email'), null);
      }
      const email = profile.emails[0].value;
      let user = await User.findOne({ email: email.toLowerCase() });

      if (user) {
        // Bảo mật: không cho phép OAuth login vào tài khoản đã đăng ký bằng phương thức khác
        if (user.loginMethod !== 'google') {
          return done(null, false, {
            message: `Email này đã đăng ký bằng ${user.loginMethod}. Vui lòng đăng nhập đúng phương thức.`
          });
        }
        // Cập nhật lần đăng nhập gần nhất
        user.lastLogin = new Date();
        await user.save();
        return done(null, user);
      }

      // Chỉ tạo user mới nếu email chưa tồn tại
      user = await User.create({
        name: profile.displayName,
        email: email.toLowerCase(),
        password: require('crypto').randomBytes(32).toString('hex'),
        loginMethod: 'google',
        googleId: profile.id,
        isPaid: false
      });
      await Profile.create({ user: user._id, email: user.email, displayName: user.name });
      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
));

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID || 'missing_facebook_app_id',
    clientSecret: process.env.FACEBOOK_APP_SECRET || 'missing_facebook_secret',
    callbackURL: `${BACKEND_URL}/api/auth/facebook/callback`,
    profileFields: ['id', 'displayName', 'emails']
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails && profile.emails[0]
        ? profile.emails[0].value
        : `fb_${profile.id}@facebook.noreply`;
      let user = await User.findOne({ email: email.toLowerCase() });

      if (user) {
        // Bảo mật: không cho phép OAuth login vào tài khoản đã đăng ký bằng phương thức khác
        if (user.loginMethod !== 'facebook') {
          return done(null, false, {
            message: `Email này đã đăng ký bằng ${user.loginMethod}. Vui lòng đăng nhập đúng phương thức.`
          });
        }
        // Cập nhật lần đăng nhập gần nhất
        user.lastLogin = new Date();
        await user.save();
        return done(null, user);
      }

      // Chỉ tạo user mới nếu email chưa tồn tại
      user = await User.create({
        name: profile.displayName,
        email: email.toLowerCase(),
        password: require('crypto').randomBytes(32).toString('hex'),
        loginMethod: 'facebook',
        facebookId: profile.id,
        isPaid: false
      });
      await Profile.create({ user: user._id, email: user.email, displayName: user.name });
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
