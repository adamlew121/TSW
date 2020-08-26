// const mongodb = require('mongodb');
// const jwt = require('jsonwebtoken');
const passport = require('passport');
// const config = require('../config/config');
const bcrypt = require('../bcrypt/index');

const User = require('../models/index');

// function jwtSignUser (user) {
//     const ONE_WEEK = 60 * 60 * 24 * 7
//     return jwt.sign(user, 'secret', {
//         expiresIn: ONE_WEEK
//     })
// }

module.exports = {
  async register(req, res) {
    try {
      const { username, password } = req.body;
      const user = await User.create({
        username,
        password: bcrypt.hash(password),
      });
      const userJson = user.toJSON();
      res.send({
        user: userJson,
        // token: jwtSignUser(userJson)
      });
    } catch (err) {
      res.status(400).send({
        error: 'This username is already in use.',
      });
    }
  },
  async login(req, res, next) {
    try {
      passport.authenticate('local', (err, user) => {
        if (err || !user) {
          res.status(401).json({
            message: 'Incorrect username or password',
          });
        } else {
          // eslint-disable-next-line consistent-return
          req.logIn(user, (er) => {
            if (er) {
              return next(er);
            }
            res.status(200).json({
              user,
            });
          });
        }
      })(req, res, next);
    } catch (err) {
      res.status(500).send({
        error: 'An error has occured trying to login.',
      });
    }
  },
  async show(req, res) {
    try {
      const user = await User.findOne({
        _id: req.params.userId,
      });
      res.send(user);
    } catch (err) {
      res.status(500).send({
        error: 'An error has occured trying to show the user',
      });
    }
  },

};
