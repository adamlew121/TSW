const passport = require('passport');
// const config = require('./config/config');
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const User = require('./models');

passport.use(
  new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'secret',
  }, (async (jwtPayload, done) => {
    try {
      // eslint-disable-next-line no-underscore-dangle
      const user = await User.findOne({ _id: jwtPayload._id });
      if (!user) {
        return done(new Error(), false);
      }
      return done(null, user);
    } catch (err) {
      return done(new Error(), false);
    }
  })),
);

module.exports = null;
