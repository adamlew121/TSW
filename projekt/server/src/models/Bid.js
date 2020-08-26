const mongoose = require('../mongoose');

const Bid = mongoose.model('Bid', {
  bidderId: { type: String, required: true },
  bidderName: { type: String, required: true },
  offerId: { type: String, required: true },
  price: { type: Number, required: true },
});

Bid.processErrors = (err) => {
  const msg = err.errors.map((key) => {
    msg[key] = err.errors[key].message;
    return msg;
  });
  return msg;
};

module.exports = Bid;
