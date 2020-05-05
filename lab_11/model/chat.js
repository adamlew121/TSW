const mongoose = require("../mongoose");
var Chat = mongoose.model('Chat', {
  title: { type: String, required: true, unique: true },
  messageData: { type: [String], required: false },
})

Chat.processErrors = (err) => {
    let msg = {};
    for (let key in err.errors) {
        msg[key] = err.errors[key].message;
    }
    return msg;
};

module.exports = Chat;