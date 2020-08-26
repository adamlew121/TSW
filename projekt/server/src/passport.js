const passport = require('passport');

// const JwtStrategy = require('passport-jwt').Strategy;
const LocalStrategy = require('passport-local').Strategy;
// const ExtractJwt = require('passport-jwt').ExtractJwt;

const bcrypt = require('bcryptjs');
const User = require('./models');

passport.use(new LocalStrategy((username, password, done) => {
  User.findOne({ username }, (err, user) => {
    if (err) {
      done(err, false);
    }
    if (!user) {
      done(null, false, { message: 'Incorrect username' });
    } else {
      bcrypt.compare(password, user.password, (er, isMatch) => {
        if (er) throw er;
        if (isMatch) {
          done(null, user);
        } else {
          done(null, false, { message: 'Incorrect password' });
        }
      });
    }
  });
}));

// passport.use(new JwtStrategy({
//         jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//         secretOrKey: "secretdab"
//     }, (payload, done) => {
//     done(null, payload)
// }));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findOne({ _id: id }, (err, user) => {
    if (err) {
      done(err);
    }
    if (user) {
      done(null, {
        // eslint-disable-next-line no-underscore-dangle
        id: user._id,
        username: user.username,
        password: user.password,
      });
    } else {
      done({
        message: 'Id not found.',
      });
    }
  });
});

module.exports = passport;
