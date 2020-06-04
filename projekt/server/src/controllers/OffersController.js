const mongodb = require('mongodb')
const Offer = require('../models/Offer')
const Bid = require('../models/Bid')


module.exports = {
    async index (req, res) {
        try {
            const offers = await Offer.find({})
            res.send(offers)
        } catch (err) {
            res.status(500).send({
                error: 'An error has occured trying to fetch the offer'
            })
        }
    },
    async history (req, res) {
        try {
            var offers1 = await Offer.find({
                author: req.user._id,
                closed: true
            })
            var offers2 = await Offer.find({
                buyer: req.user._id,
                closed: true
            })
            var offers = offers1.concat(offers2)
            res.send(offers)
        } catch (err) {
            res.status(500).send({
                error: 'An error has occured trying to fetch the offer'
            })
        }
    },
    async historyBidding (req, res) {
        try {
            var bids = await Bid.find({
                bidderId: req.user._id
            })
            console.log('1')
            var offerIds = []
            for (var i = 0; i < bids.length; i++) {
                if (!offerIds.includes(bids[i].offerId)) {
                    offerIds.push(bids[i].offerId)
                }  
            }
            console.log('1')
            var offers = []
            for (var i = 0; i < offerIds.length; i++) {
                const offer = await Offer.findOne({
                    _id: new mongodb.ObjectID(offerIds[i]),
                    closed: false
                })
                if (offer !== null) {
                    offers.push(offer)
                }
            }
            console.log('1')
            console.log(offers)
            res.send(offers)
        } catch (err) {
            res.status(500).send({
                error: 'An error has occured trying to fetch the offer'
            })
        }
    },
    async post (req, res) {
        try {
            req.body.closed = false
            req.body.biddingStatus = 1
            console.log(req.body)
            const offer = await Offer.create(req.body)
            res.send(offer)
        } catch (err) {
            res.status(500).send({
                error: 'An error has occured trying to post the offer'
            })
        }
    },
    async show (req, res) {
        try {
            // console.log(req.app)
            const offer = await Offer.findOne({
                _id: req.params.offerId
            })
            console.log(offer)
            res.send(offer)
        } catch (err) {
            res.status(500).send({
                error: 'An error has occured trying to show the offer'
            })
        }
    },
    async put (req, res) {
        try {
            console.log(req.params)
            const offer = await Offer.update({
                _id: new mongodb.ObjectID(req.params.offerId)
            }, req.body)
            res.send(req.body)
        } catch (err) {
            console.log('check3: ' + err)
            res.status(500).send({
                error: 'An error has occured trying to update the offer'
            })
        }
    },
    async buy (req, res) {
        try {
            req.body.closed = true
            console.log(req.user)
            req.body.buyer = req.user._id
            const offer = await Offer.update({
                _id: new mongodb.ObjectID(req.params.offerId)
            }, req.body)
            res.send(req.body)
        } catch (err) {
            console.log('check3: ' + err)
            res.status(500).send({
                error: 'An error has occured trying to update the offer'
            })
        }
    },
    async start (req, res) {
        try {
            req.body.biddingStatus = 2
            const offer = await Offer.update({
                _id: new mongodb.ObjectID(req.params.offerId)
            }, req.body)
            res.send(req.body)
        } catch (err) {
            console.log('check3: ' + err)
            res.status(500).send({
                error: 'An error has occured trying to update the offer'
            })
        }
    },
    async finish (req, res) {
        try {
            req.body.biddingStatus = 3
            req.body.closed = true
            const offer = await Offer.update({
                _id: new mongodb.ObjectID(req.params.offerId)
            }, req.body)
            res.send(req.body)
        } catch (err) {
            console.log('check3: ' + err)
            res.status(500).send({
                error: 'An error has occured trying to update the offer'
            })
        }
    },
    async bid (req, res) {
        try {
            const offer = await Offer.findOne({
                _id: req.params.offerId
            })
            offer.price = req.body.price
            offer.buyer = req.user._id
            await Offer.update({
                _id: new mongodb.ObjectID(req.params.offerId)
            }, offer)
            const bid = await Bid.create({
                bidderId: req.user._id,
                bidderName: req.user.username,
                offerId: req.params.offerId,
                price: req.body.price
            })
            res.send(bid)
        } catch (err) {
            // console.log(err)
            res.status(500).send({
                error: 'An error has occured trying to create a bid'
            })
        }
    },
    async indexBids (req, res) {
        try {
            const bids = await Bid.find({
                offerId: req.params.offerId
            })
            res.send(bids)
        } catch (err) {
            res.status(500).send({
                error: 'An error has occured trying to fetch the bids'
            })
        }
    }

}