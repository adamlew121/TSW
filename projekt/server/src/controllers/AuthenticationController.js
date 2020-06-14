const mongodb = require('mongodb')
const User = require("../models/index")
const jwt = require('jsonwebtoken')
const config = require('../config/config')
const bcrypt = require('../bcrypt/index')
const passport = require('passport');

// function jwtSignUser (user) {
//     const ONE_WEEK = 60 * 60 * 24 * 7
//     return jwt.sign(user, 'secret', {
//         expiresIn: ONE_WEEK
//     })
// }

module.exports = {
    async register (req, res) {
        try {
        const {username, password} = req.body
        const user = await User.create({
            username: username,
            password: bcrypt.hash(password)
        })
        const userJson = user.toJSON()
        res.send({
                user: userJson,
                // token: jwtSignUser(userJson)
            })
        } catch (err) {
            res.status(400).send({
                error: 'This username is already in use.'
            })
        }
    },
    async login (req, res, next) {
        try {
            passport.authenticate("local", (err, user) => {
                console.log('ee4')
                if (err || !user) {
                    console.log('222');
                    res.status(401).json({
                        message: "Incorrect username or password",
                    })
                } else {
                    console.log(user)
                    req.logIn(user, (err) => {
                        console.log('d1')
                        if (err) {
                            console.log('d2')
                            return next(err);
                        }
                        console.log('d3')
                        console.log(req.session)
                        res.status(200).json({
                            user: user
                        })
                    })
                }
            })(req, res, next);
        } catch (err) {
            console.log(err);
            res.status(500).send({
                error: 'An error has occured trying to login.'
            })
        }
    },
    async show (req, res)  {
      try {
        const user = await User.findOne({
            _id: req.params.userId
        })
      // console.log(user)
        res.send(user)
      } catch (err) {
        res.status(500).send({
            error: 'An error has occured trying to show the user'
        })
      }
    }
    
}