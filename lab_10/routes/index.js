"use strict";

// Sugestia – funkcję oceniającą ruchy najlepiej
// umieścić w osobnym module, a poniżej jedynie z niej
// skorzystać.

const express = require("express");
const router =  express.Router();
const User = require("../model/index");
const Game = require("../model/game");

// Passport.js i narzędzie do szyfrowania haseł
const passport = require("../passport");
const bcrypt = require("../bcrypt");

// „wyłapywanie”  odwołań nieobsługiwanymi metodami HTTP
const rejectMethod = (_req, res, _next) => {
    // Method Not Allowed
    res.sendStatus(405);
};

var code;
var currentUser;




router.route("/")
    
    .get((req, res) => {
        console.log('get');
        currentUser = req.user;
        res.render("index", {
            isAuthenticated: req.isAuthenticated(),
            user: req.user
        });
    })
    .post((req, res) => {
        let params = req.body;
        console.log(params);
        if (params.size <= 0 || params.size === null || params.size == "") params.size = 5;
        if (params.dim <= 0 || params.dim === null || params.dim == "") params.dim = 9;
        if (params.max <= 0 || params.max === null || params.max == "") params.max = 0;

        code = Array.from({length: params.size}, () => Math.floor(Math.random() * (parseInt(params.dim, 10) + 1)));
        console.log(code);
        const uuid = require("uuidv4").uuid;
        req.session.id = uuid();


        res.json({
            msg: "nowa gra",
            params
        });
    })
    .patch((req, res) => {
        console.log("currentUser: " + currentUser)
        let ruch = req.body;

        var blackCount = 0;
        var whiteCount = 0;

        var codeCopy = [...code];
        var answerCopy = [...ruch];
    
        for (var i = 0; i < code.length; i++) {
            if (codeCopy[i] === answerCopy[i]) {
                blackCount++;
                codeCopy[i] = -1;
                answerCopy[i] = -1;
            }
        }

        for (var i = 0; i < code.length; i++) {
           // console.log("answerCopy: " + answerCopy);
           // console.log("codeCopy: " + codeCopy);
            if (answerCopy[i] != -1) {
                for (var j = 0; j < code.length; j++) {
                   // console.log("code[" + j + "] = " + codeCopy[j] + " ||| answer[" + i + "] = " + answerCopy[i] )
                    if (codeCopy[j] == answerCopy[i]) {
                        whiteCount++;
                        codeCopy[j] = -1;
                        answerCopy[i] = -1;
                        break;
                    }
                }
            }
        }

        const params = {
            "white": whiteCount,
            "black": blackCount
        }
        res.json({
            msg: "ocena ruchu",
            params
        });
    })
    .all(rejectMethod);


router
    .route("/login")
    .get((req, res) => {
        res.render("login");
    })
    .post(passport.authenticate("local"), async (req, res) => {
        //sessionStorage.setItem('userName', req.body.username);
        console.log('login -> current username: ' + req.body.username)
        await res.redirect("/");
    })
    .all(rejectMethod);

router
    .route("/logout")
    .get((req, res) => {
        req.logout();
        res.redirect("/");
    })
    .all(rejectMethod);

router
    .route("/register")
    .get((req, res) => {
        res.render("register");
    })
    // „dla treningu”, inaczej niż w przykładzie z wykładu
    // (tsw-mongo-crud) użyjemy tutaj async/await
    .post(async (req, res) => {
        try {
            let passwordHash = bcrypt.hash(req.body.password);
            let user = new User({
                username: req.body.username,
                password: passwordHash
            });
            user.save();
            await res.redirect("/");
            
        } catch (err) {
            if (!req.body.password) {
                // Unprocessable Entity
                res.status(422).json({
                    password: "Error – password must not be empty!"
                });
            } else {
                res.status(422).json(User.processErrors(err));
            }
        }
    })
    .all(rejectMethod);

router
    .route("/saveGame")
    .post((req,res) => {
        try {        
            let game = new Game({
                username: currentUser.username,
                gameData: req.body
            });
            game.save();
        } catch (err) {
                res.status(422).json(Game.processErrors(err));
        }
    })
    .all(rejectMethod);

// przykładowe „API” – oczwiście musi być serwowane przez HTTPS!
router
    .route("/api/users")
    // tutaj uwierzytelniamy się przez HTTP – metodą Basic
    .get(passport.authenticate("basic", {
        session: false
    }), (req, res) => {
        User.find({}, (err, data) => {
            if (err) {
                res.code(500);
            } else {
                res.json(data);
            }
        });
    })
    .all(rejectMethod);

module.exports = router;
