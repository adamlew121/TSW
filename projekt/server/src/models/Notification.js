const mongoose = require('../mongoose');

const Notification = mongoose.model('Notification', {
  receiverId: { type: String, required: true },
  isRead: { type: Boolean, required: true },
  text: { type: String, required: true },
});

Notification.processErrors = (err) => {
  const msg = err.errors.map((key) => {
    msg[key] = err.errors[key].message;
    return msg;
  });
  return msg;
};

module.exports = Notification;
