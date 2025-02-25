const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
require("dotenv").config();

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID, // Facebook App ID
      clientSecret: process.env.FACEBOOK_APP_SECRET, // Facebook App Secret
      callbackURL: "/auth/facebook/callback", // Redirect URI
      profileFields: ["id", "emails", "name", "photos"], // Request necessary fields
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        return done(null, profile);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// Serialize & Deserialize User
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

module.exports = passport;
