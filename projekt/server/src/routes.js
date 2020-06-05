const AuthenticationController = require('./controllers/AuthenticationController')
const OffersController = require('./controllers/OffersController')
const ChatsController = require('./controllers/ChatsController')
const isAuthenticated = require('./policies/isAuthenticated')

const express = require('express')
const router = express.Router()

const rejectMethod = (_req, res, _next) => {
    // Method Not Allowed
    res.sendStatus(405);
};

    router.route('/register').post(
        AuthenticationController.register)

    router.route('/login').post(
        AuthenticationController.login)

    router.route('/offers').get(
        OffersController.index)

    router.route('/history').get(
        isAuthenticated,
        OffersController.history)

    router.route('/historyBidding').get(
        isAuthenticated,
        OffersController.historyBidding)

    router.route('/offers').post(
        isAuthenticated,
        OffersController.post)

    router.route('/offers/:offerId').get(
        OffersController.show)

    router.route('/offers/:offerId').put(
        isAuthenticated,
        OffersController.put)

    router.route('/offers/:offerId/buy').put(
        isAuthenticated,
        OffersController.buy)

    router.route('/offers/:offerId/start').put(
        isAuthenticated,
        OffersController.start)

    router.route('/offers/:offerId/finish').put(
        isAuthenticated,
        OffersController.finish)

    router.route('/offers/:offerId/bid').put(
        isAuthenticated,
        OffersController.bid)

    router.route('/offers/:offerId/bids').get(
        isAuthenticated,
        OffersController.indexBids)

    router.route('/chats').get(
        isAuthenticated,
        ChatsController.index)

    router.route('/chats').post(
        isAuthenticated,
        ChatsController.post)

    router.route('/notes').get(
        isAuthenticated,
        ChatsController.getNotes)

    router.route('/chats/:userId').get(
        isAuthenticated,
        ChatsController.show)

    router.route('/user/:userId').get(
        AuthenticationController.show)

module.exports = router;