const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth2').Strategy;
let userProfile;
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/v1/auth/google/callback",
    passReqToCallback: true
  },
  function (request, accessToken, refreshToken, profile, done) {
    userProfile = profile;
    // console.log(profile);
    return done(null, userProfile);

  }
));

passport.serializeUser(function (user, done) {
  done(null, user)
});

passport.deserializeUser(function (user, done) {
  done(null, user)
});
