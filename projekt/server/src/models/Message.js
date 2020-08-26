const mongoose = require('../mongoose');

const Message = mongoose.model('Message', {
  senderId: { type: String, required: true },
  receiverId: { type: String, required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, required: true },
});

Message.processErrors = (err) => {
  const msg = err.errors.map((key) => {
    msg[key] = err.errors[key].message;
    return msg;
  });
  return msg;
};

module.exports = Message;
