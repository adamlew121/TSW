const mongoose = require("../mongoose");
const Schema = mongoose.Schema;
const Promise = require('../../../client/node_modules/bluebird')
const bcrypt = Promise.promisifyAll(require('../../../client/node_modules/bcrypt-nodejs'))


const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 3
    },
    password: {
        type: String,
        required: true
    },
});

// bez poniższej wtyczki nie dostaniemy sensownego sygnału
// błędu przy naruszeniu „unikatowości” nazwy użytkownika
const uniqueValidator = require("../../../client/node_modules/mongoose-unique-validator");
// ale z nią – już wszystko będzie jak należy
userSchema.plugin(uniqueValidator);

userSchema.methods.isValidPassword = function (password) {
    return bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);


// mały „postprocessing” błędów mongoosowych
User.processErrors = (err) => {
    let msg = {};
    for (let key in err.errors) {
        msg[key] = err.errors[key].message;
    }
    return msg;
};

module.exports = User;