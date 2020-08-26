const mongoose = require('../mongoose');

const Notification = mongoose.model('Notification', {
  senderUserName: { type: String, required: true },
  receiverId: { type: String, required: true },
  isRead: { type: Boolean, required: true },
});

Notification.processErrors = (err) => {
  const msg = err.errors.map((key) => {
    msg[key] = err.errors[key].message;
    return msg;
  });
  return msg;
};

module.exports = Notification;
