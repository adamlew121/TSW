const mongoose = require("../mongoose");
var Message = mongoose.model('Message', {
  senderId: {type: String, required: true},
  receiverId: {type: String, required: true},
  text: {type: String, required: true},
  createdAt: {type: Date, required: true}
})

Message.processErrors = (err) => {
    let msg = {};
    for (let key in err.errors) {
        msg[key] = err.errors[key].message;
    }
    return msg;
};

module.exports = Message;