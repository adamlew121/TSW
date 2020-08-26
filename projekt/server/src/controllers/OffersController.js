const mongodb = require('mongodb');
const Offer = require('../models/Offer');
const Bid = require('../models/Bid');

module.exports = {
  async index(req, res) {
    try {
      const offers = await Offer.find({});
      res.send(offers);
    } catch (err) {
      res.status(500).send({
        error: 'An error has occured trying to fetch the offer',
      });
    }
  },
  async history(req, res) {
    try {
      const offers1 = await Offer.find({
        author: req.user.id,
        closed: true,
      });
      const offers2 = await Offer.find({
        buyer: req.user.id,
        closed: true,
      });
      const offers = offers1.concat(offers2);
      res.send(offers);
    } catch (err) {
      res.status(500).send({
        error: 'An error has occured trying to fetch the offer',
      });
    }
  },
  async historyBidding(req, res) {
    try {
      const bids = await Bid.find({
        bidderId: req.user.id,
      });
      const offerIds = [];
      for (let i = 0; i < bids.length; i += 1) {
        if (!offerIds.includes(bids[i].offerId)) {
          offerIds.push(bids[i].offerId);
        }
      }
      const offers = [];
      for (let i = 0; i < offerIds.length; i += 1) {
        const offer = Offer.findOne({
          _id: new mongodb.ObjectID(offerIds[i]),
          closed: false,
        });
        if (offer !== null) {
          offers.push(offer);
        }
      }
      res.send(offers);
    } catch (err) {
      res.status(500).send({
        error: 'An error has occured trying to fetch the offer',
      });
    }
  },
  async post(req, res) {
    try {
      req.body.closed = false;
      req.body.biddingStatus = 1;
      const offer = await Offer.create(req.body);
      res.send(offer);
    } catch (err) {
      res.status(500).send({
        error: 'An error has occured trying to post the offer',
      });
    }
  },
  async show(req, res) {
    try {
      const offer = await Offer.findOne({
        _id: req.params.offerId,
      });
      res.send(offer);
    } catch (err) {
      res.status(500).send({
        error: 'An error has occured trying to show the offer',
      });
    }
  },
  async put(req, res) {
    try {
      await Offer.update({
        _id: new mongodb.ObjectID(req.params.offerId),
      }, req.body);
      res.send(req.body);
    } catch (err) {
      res.status(500).send({
        error: 'An error has occured trying to update the offer',
      });
    }
  },
  async buy(req, res) {
    try {
      req.body.closed = true;
      req.body.buyer = req.user.id;
      await Offer.update({
        _id: new mongodb.ObjectID(req.params.offerId),
      }, req.body);
      res.send(req.body);
    } catch (err) {
      res.status(500).send({
        error: 'An error has occured trying to update the offer',
      });
    }
  },
  async start(req, res) {
    try {
      req.body.biddingStatus = 2;
      await Offer.update({
        _id: new mongodb.ObjectID(req.params.offerId),
      }, req.body);
      res.send(req.body);
    } catch (err) {
      res.status(500).send({
        error: 'An error has occured trying to update the offer',
      });
    }
  },
  async finish(req, res) {
    try {
      req.body.biddingStatus = 3;
      req.body.closed = true;
      await Offer.update({
        _id: new mongodb.ObjectID(req.params.offerId),
      }, req.body);
      res.send(req.body);
    } catch (err) {
      res.status(500).send({
        error: 'An error has occured trying to update the offer',
      });
    }
  },
  async bid(req, res) {
    try {
      const offer = await Offer.findOne({
        _id: req.params.offerId,
      });
      if (offer.price >= req.body.price) {
        res.status(400).send({
          error: 'Actual price is higher than bidded',
        });
      } else {
        offer.price = req.body.price;
        offer.buyer = req.user.id;
        await Offer.update({
          _id: new mongodb.ObjectID(req.params.offerId),
        }, offer);
        const bid = await Bid.create({
          bidderId: req.user.id,
          bidderName: req.user.username,
          offerId: req.params.offerId,
          price: req.body.price,
        });
        res.send(bid);
      }
    } catch (err) {
      res.status(500).send({
        error: 'An error has occured trying to create a bid',
      });
    }
  },
  async indexBids(req, res) {
    try {
      const bids = await Bid.find({
        offerId: req.params.offerId,
      });
      res.send(bids);
    } catch (err) {
      res.status(500).send({
        error: 'An error has occured trying to fetch the bids',
      });
    }
  },

};
