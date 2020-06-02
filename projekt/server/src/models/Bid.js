const mongoose = require("../mongoose");
var Bid = mongoose.model('Bid', {
  bidderId: {type: String, required: true},
  bidderName: {type: String, required: true},
  offerId: {type: String, required: true},
  price: {type: Number, required: true}
})

Bid.processErrors = (err) => {
    let msg = {};
    for (let key in err.errors) {
        msg[key] = err.errors[key].message;
    }
    return msg;
};

module.exports = Bid;