const mongoose = require('../mongoose');

const Offer = mongoose.model('Offer', {
  title: { type: String, required: true, unique: true },
  bidding: { type: Boolean, required: true },
  biddingStatus: { type: Number, required: false }, // 1 => waiting, 2 => started, 3 => finished
  price: { type: Number, required: true },
  author: { type: String, required: true },
  closed: { type: Boolean, required: false },
  buyer: { type: String, required: false },
  buyerName: { type: String, required: false },
});

Offer.processErrors = (err) => {
  const msg = err.errors.map((key) => {
    msg[key] = err.errors[key].message;
    return msg;
  });
  return msg;
};

module.exports = Offer;
