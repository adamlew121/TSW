"use strict";

// Sugestia – funkcję oceniającą ruchy najlepiej
// umieścić w osobnym module, a poniżej jedynie z niej
// skorzystać.

const express = require("express");
const router = express.Router();

var code;


router.route("/")
    .post((req, res) => {
        let params = req.body;
        if (params.size <= 0 || params.size === null || params.size == "") params.size = 5;
        if (params.dim <= 0 || params.dim === null || params.dim == "") params.dim = 9;
        if (params.max <= 0 || params.max === null || params.max == "") params.max = 0;

        code = Array.from({length: params.size}, () => Math.floor(Math.random() * (params.dim + 1)));
        console.log(code);
        const uuid = require("uuidv4").uuid;
        req.session.id = uuid();


        res.json({
            msg: "nowa gra",
            params
        });
    })
    .patch((req, res) => {
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
    });

module.exports = router;
