const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const config = require('./config/config')
const socketio = require("socket.io");
const fs = eval('require("fs")')
const https = eval('require("https")')
// const isAuthenticated = require('./policies/isAuthenticated')
const passport = require('./passport')
require("dotenv").config();

const app = express();

// require('./passportJWT')

const secret = process.env.SECRET || "$uper $ecret";

const cookieParser = require("cookie-parser");
app.use(cookieParser(secret));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const logger = require("morgan");
const errorHandler = require("errorhandler");


app.use(logger("dev"));
app.use(errorHandler());



const mongoose = require("./mongoose");

// mongoose.connect("mongodb://localhost/appdb", {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
//     .then(() => console.log("Connected to MongoDB"))
//     .catch((err) => console.log(err));

const session = require("express-session");

const MongoStore = require("connect-mongo")(session)
const sessionStore = new MongoStore({mongooseConnection: mongoose.connection})

app.use(session({
    store: sessionStore,
    key: "session.sid-key",
    secret: secret,
    resave: true,
    saveUninitialized: true,
    cookie:{ maxAge : 180 * 60 * 1000}
}))



app.use(passport.initialize())
app.use(passport.session())


const routes = require('./routes')

app.use(routes)

// Handle production

    // Static folder
    app.use(express.static(__dirname + '/../public/'));

    //Handle SPA
    app.get(/.*/, (req, res) => res.sendFile(__dirname + '../public/index.html'));


app.use((_, res) => {
    // Not Found
    res.sendStatus(404);
});
var privateKey = fs.readFileSync(__dirname + "\\my.key")
var certificate = fs.readFileSync(__dirname + "\\my.crt")
var credentials = {key: privateKey, cert: certificate}



const server = https.createServer(credentials, app);

const passportSocketIo = require("passport.socketio")
const io = socketio(server);

io.use(passportSocketIo.authorize({
    cookieParser: cookieParser,
    key: 'session.sid-key',
    secret: secret,
    store: sessionStore
}));

io.on('connection', function(socket) {
    // console.log(socket.id)
    console.log('dziaa')
    socket.on('SEND_BID', function(data) {
        // console.log(socket)
        console.log('bid sent')
        console.log(data)
        io.emit('BID', data)
    });
    socket.on('SEND_MESSAGE', function(data) {
        // console.log(socket)
        console.log('message sent')
        io.emit('MESSAGE', data)
    });
});



const port = config.port
server.listen(port, () => console.log(`Server started on port ${port}`));

