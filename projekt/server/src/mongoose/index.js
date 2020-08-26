const mongoose = require('mongoose');

(async () => {
  try {
    await mongoose.connect('mongodb://localhost/appdb', {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
    });
  } catch (err) {
    process.exit(1);
  }
})();

const db = mongoose.connection;

db.on('open', () => {
  // eslint-disable-next-line no-console
  console.log('Połączono z MongoDB!');
});

// eslint-disable-next-line no-console
db.on('error', console.error.bind(console, 'Błąd połączenia z MongoDb: '));

module.exports = mongoose;
