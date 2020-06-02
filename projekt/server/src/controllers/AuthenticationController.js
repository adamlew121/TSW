const mongodb = require('../../../client/node_modules/mongodb')
const User = require("../models/index")
const jwt = require('../../../client/node_modules/jsonwebtoken')
const config = require('../config/config')
const bcrypt = require('../bcrypt/index')

function jwtSignUser (user) {
    const ONE_WEEK = 60 * 60 * 24 * 7
    return jwt.sign(user, 'secret', {
        expiresIn: ONE_WEEK
    })
}

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
                token: jwtSignUser(userJson)
            })
        } catch (err) {
            res.status(400).send({
                error: 'This username is already in use.'
            })
        }
    },
    async login (req, res)  {
        try {
            const {username, password} = req.body
            const user = await User.findOne({
                    username: username
            })
            if (!user) {
                res.status(403).send({
                    error: 'The login information was incorrect1'
                })
            }
            console.log('jest user');
            console.log(user);
            const isPasswordValid = await bcrypt.compare(password, user.password)
            if (!isPasswordValid) {
                res.status(403).send({
                    error: 'The login information was incorrect2'
                })
            }
            console.log('password jest validny');
            const userJson = user.toJSON()
            console.log(userJson)
            console.log(config.authentication.jwSecret)
            res.send({
                user: userJson,
                token: jwtSignUser(userJson)
            })
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