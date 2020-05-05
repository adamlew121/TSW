const mongoose = require("../mongoose");
var Game = mongoose.model('Game', {
  username: { type: String, required: true, unique: false },
  gameData: { type: [String], required: true },
})

Game.processErrors = (err) => {
    let msg = {};
    for (let key in err.errors) {
        msg[key] = err.errors[key].message;
    }
    return msg;
};

module.exports = Game