const passport = require('passport')
const User = require('./models')
const config = require('./config/config')

const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt

passport.use(
    new JwtStrategy({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: 'secret'
    }, async function (jwtPayload, done) {
        try {
            const user = await User.findOne({_id: jwtPayload._id})
            if (!user) {
                return done(new Error(), false)
            }
            return done(null, user)
        } catch (err) {
            console.log(err)
            return done(new Error(), false)
        }
    })
)


module.exports = null