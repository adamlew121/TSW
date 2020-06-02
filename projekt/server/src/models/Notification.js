const mongoose = require("../mongoose");
var Notification = mongoose.model('Notification', {
  senderUserName: {type: String, required: true},
  receiverId: {type: String, required: true},
  isRead: {type: Boolean, required: true}
})

Notification.processErrors = (err) => {
    let msg = {};
    for (let key in err.errors) {
        msg[key] = err.errors[key].message;
    }
    return msg;
};

module.exports = Notification;