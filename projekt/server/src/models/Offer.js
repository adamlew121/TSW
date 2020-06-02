const mongoose = require("../mongoose");
var Offer = mongoose.model('Offer', {
  title: { type: String, required: true, unique: true },
  bidding: {type: Boolean, required: true},
  biddingStatus: {type: Number, required: false}, // 1 => waiting, 2 => started, 3 => finished
  price: { type: Number, required: true },
  author: {type: String, required: true},
  closed: {type: Boolean, required: false},
  buyer: {type: String, required: false},
})

Offer.processErrors = (err) => {
    let msg = {};
    for (let key in err.errors) {
        msg[key] = err.errors[key].message;
    }
    return msg;
};

module.exports = Offer;