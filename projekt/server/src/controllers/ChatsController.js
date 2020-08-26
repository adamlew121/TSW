const mongodb = require('mongodb');
const Message = require('../models/Message');
const User = require('../models');
const Notification = require('../models/Notification');

module.exports = {
  async index(req, res) {
    try {
      const userIds = [];
      const messages1 = await Message.find({
        receiverId: req.user.id,
      });
      for (let i = 0; i < messages1.length; i += 1) {
        if (!userIds.includes(messages1[i].senderId)) {
          userIds.push(messages1[i].senderId);
        }
      }
      const messages2 = await Message.find({
        senderId: req.user.id,
      });
      for (let i = 0; i < messages2.length; i += 1) {
        if (!userIds.includes(messages2[i].receiverId)) {
          userIds.push(messages2[i].receiverId);
        }
      }
      const users = [];
      for (let i = 0; i < userIds.length; i += 1) {
        const user = User.findOne({
          _id: new mongodb.ObjectID(userIds[i]),
        });
        users.push(user);
      }
      res.send(users);
    } catch (err) {
      res.status(500).send({
        error: 'An error has occured trying to fetch the users',
      });
    }
  },
  async show(req, res) {
    try {
      const messages1 = await Message.find({
        receiverId: req.user.id,
        senderId: req.params.userId,
      });
      const messages2 = await Message.find({
        senderId: req.user.id,
        receiverId: req.params.userId,
      });
      const messages = messages1.concat(messages2);
      messages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

      res.send(messages);
    } catch (err) {
      res.status(500).send({
        error: 'An error has occured trying to fetch the messages',
      });
    }
  },
  async post(req, res) {
    try {
      const message = await Message.create(req.body);
      await Notification.create({
        senderUserName: req.user.username,
        receiverId: req.body.receiverId,
        isRead: false,
      });
      res.send(message);
    } catch (err) {
      res.status(500).send({
        error: 'An error has occured trying to post the message',
      });
    }
  },
  async getNotes(req, res) {
    try {
      const notes = await Notification.find({
        receiverId: req.user.id,
        isRead: false,
      });
      for (let i = 0; i < notes.length; i += 1) {
        Notification.update({
          // eslint-disable-next-line no-underscore-dangle
          _id: new mongodb.ObjectID(notes[i]._id),
        }, { isRead: true });
      }
      res.send(notes);
    } catch (err) {
      res.status(500).send({
        error: 'An error has occured trying to fetch the notifications',
      });
    }
  },

};
