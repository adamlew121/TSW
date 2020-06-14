const AuthenticationController = require('./controllers/AuthenticationController')
const OffersController = require('./controllers/OffersController')
const ChatsController = require('./controllers/ChatsController')
// const isAuthenticated = require('./policies/isAuthenticated')
const passport = require('passport');

const express = require('express')
const router = express.Router()

const rejectMethod = (_req, res, _next) => {
    // Method Not Allowed
    res.sendStatus(405);
};

const authMiddleware = (req, res, next) => {
    console.log('auth?: ' + req.isAuthenticated())
    console.log(req.user)
    if (!req.isAuthenticated()) {
        res.status(401).json({
            error: "Unauthorized"
        });
    } else {
        return next();
    }
}


    router.route('/register').post(
        AuthenticationController.register)

    router.route('/login').post(
        AuthenticationController.login)


    router.route('/offers').get(
        OffersController.index)

    router.route('/history').get(
        authMiddleware,
        // isAuthenticated,
        OffersController.history)

    router.route('/historyBidding').get(
        authMiddleware,
        // isAuthenticated,
        OffersController.historyBidding)

    router.route('/offers').post(
        authMiddleware,
        // isAuthenticated,
        OffersController.post)

    router.route('/offers/:offerId').get(
        OffersController.show)

    router.route('/offers/:offerId').put(
        authMiddleware,
        // isAuthenticated,
        OffersController.put)

    router.route('/offers/:offerId/buy').put(
        authMiddleware,
        // isAuthenticated,
        OffersController.buy)

    router.route('/offers/:offerId/start').put(
        authMiddleware,
        // isAuthenticated,
        OffersController.start)

    router.route('/offers/:offerId/finish').put(
        authMiddleware,
        // isAuthenticated,
        OffersController.finish)

    router.route('/offers/:offerId/bid').put(
        authMiddleware,
        // isAuthenticated,
        OffersController.bid)

    router.route('/offers/:offerId/bids').get(
        authMiddleware,
        // isAuthenticated,
        OffersController.indexBids)

    router.route('/chats').get(
        authMiddleware,
        // isAuthenticated,
        ChatsController.index)

    router.route('/chats').post(
        authMiddleware,
        // isAuthenticated,
        ChatsController.post)

    router.route('/notes').get(
        authMiddleware,
        // isAuthenticated,
        ChatsController.getNotes)

    router.route('/chats/:userId').get(
        authMiddleware,
        // isAuthenticated,
        ChatsController.show)

    router.route('/user/:userId').get(
        AuthenticationController.show)

module.exports = router;