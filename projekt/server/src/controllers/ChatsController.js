const mongodb = require('mongodb')
const Message = require('../models/Message')
const User = require('../models')
const Notification = require('../models/Notification')

module.exports = {
    async index (req, res) {
        try {
            var userIds = []
            const messages1 = await Message.find({
                receiverId: req.user._id
            })
            console.log(messages1)
            for (var i = 0; i < messages1.length; i++) {
                if (!userIds.includes(messages1[i].senderId)) {
                    userIds.push(messages1[i].senderId)
                }
            }
            const messages2 = await Message.find({
                senderId: req.user._id
            })
            console.log(messages2)
            for (var i = 0; i < messages2.length; i++) {
                if (!userIds.includes(messages2[i].receiverId)) {
                    userIds.push(messages2[i].receiverId)
                }
            }
            var users = []
            for (var i = 0; i < userIds.length; i++) {
                const user = await User.findOne({
                    _id: new mongodb.ObjectID(userIds[i])
                })
                users.push(user)
            }
            console.log(users)
            res.send(users)
        } catch (err) {
            res.status(500).send({
                error: 'An error has occured trying to fetch the users'
            })
        }
    },
    async show (req, res) {
        try {
            const messages1 = await Message.find({
                receiverId: req.user._id,
                senderId: req.params.userId
            })
            const messages2 = await Message.find({
                senderId: req.user._id,
                receiverId: req.params.userId
            })
            var messages = messages1.concat(messages2)
            messages.sort(function(a, b) {
                return new Date(a.createdAt) - new Date(b.createdAt)
            })

            console.log(messages)

            res.send(messages)
        } catch (err) {
            res.status(500).send({
                error: 'An error has occured trying to fetch the messages'
            })
        }
    },
    async post (req, res) {
        try {
            console.log(req.body)
            const message = await Message.create(req.body)
            const notification = await Notification.create({
                senderUserName: req.user.username,
                receiverId: req.body.receiverId,
                isRead: false
            })
            res.send(message)
        } catch (err) {
            res.status(500).send({
                error: 'An error has occured trying to post the message'
            })
        }
    },
    async getNotes (req, res) {
        try {
            const notes = await Notification.find({
                receiverId: req.user._id,
                isRead: false
            })
            // console.log(messages1)
            for (var i = 0; i < notes.length; i++) {
                await Notification.update({
                    _id: new mongodb.ObjectID(notes[i]._id)
                }, {isRead: true})
            }
            res.send(notes)
        } catch (err) {
            res.status(500).send({
                error: 'An error has occured trying to fetch the notifications'
            })
        }
    },

}