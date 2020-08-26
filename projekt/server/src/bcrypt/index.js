const bcrypt = require('bcryptjs');

const salt = bcrypt.genSaltSync(10);

// UWAGA! poniżej wykorzystujemy metody synchroniczne bcrypt
const hash = (pswd) => bcrypt.hashSync(pswd, salt);

const compare = (pswd, phash) => bcrypt.compareSync(pswd, phash);

module.exports = {
  hash,
  compare,
};
