const express = require('express');
const socketio = require('socket.io');
const fs = require('fs');
const https = require('https');
// const isAuthenticated = require('./policies/isAuthenticated')
const passportSocketIo = require('passport.socketio');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const errorHandler = require('errorhandler');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('./passport');
require('dotenv').config();
const config = require('./config/config');

const app = express();
// require('./passportJWT')

const secret = process.env.SECRET || '$uper $ecret';

app.use(cookieParser(secret));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(logger('dev'));
app.use(errorHandler());

const mongoose = require('./mongoose');

// mongoose.connect("mongodb://localhost/appdb", {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
//     .then(() => console.log("Connected to MongoDB"))
//     .catch((err) => console.log(err));

const sessionStore = new MongoStore({ mongooseConnection: mongoose.connection });

app.use(session({
  store: sessionStore,
  key: 'session.sid-key',
  secret,
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 180 * 60 * 1000 },
}));

app.use(passport.initialize());
app.use(passport.session());

const routes = require('./routes');

app.use(routes);

// Handle production

app.use(express.static(`${__dirname}/../public/`));

app.get(/.*/, (req, res) => res.sendFile(`${__dirname}../public/index.html`));

app.use((_, res) => {
  res.sendStatus(404);
});

const privateKey = fs.readFileSync(`${__dirname}\\my.key`);
const certificate = fs.readFileSync(`${__dirname}\\my.crt`);
const credentials = { key: privateKey, cert: certificate };

const server = https.createServer(credentials, app);

const io = socketio(server);

io.use(passportSocketIo.authorize({
  cookieParser,
  key: 'session.sid-key',
  secret,
  store: sessionStore,
}));

io.on('connection', (socket) => {
  socket.on('SEND_BID', (data) => {
    io.emit('BID', data);
  });
  socket.on('SEND_MESSAGE', (data) => {
    io.emit('MESSAGE', data);
  });
});

const { port } = config;
// eslint-disable-next-line no-console
server.listen(port, () => console.log(`Server started on port ${port}`));
