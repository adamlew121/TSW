const express = require("express");
const app = express();
const serveStatic = require("serve-static");
const httpServer = require("./https")(app);

const socketio = require("socket.io");
const io = socketio.listen(httpServer);

app.use(serveStatic("public"));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// io.set('heartbeat timeout', 10);
// io.set('heartbeat interval', 10);
const cookieSession = require("cookie-session");

const logger = require("morgan");
const errorHandler = require("errorhandler");

const port = process.env.PORT || 3001;
const secret = process.env.SECRET || "$uper $ecret";
const env = process.env.NODE_ENV || "development";

app.use(cookieSession({secret: secret}));

const path = require("path");
app.use("/sock", express.static(path.normalize("./node_modules/socket.io-client/dist")))
app.use("/lib", express.static(path.normalize("./node_modules/axios/dist")));
app.use("/jss", express.static(path.normalize("./views")))

const sass = require("node-sass-middleware");
app.use(sass({
    src: path.join(__dirname, "/src"),
    dest: path.join(__dirname, "/public"),
    debug: true,
    outputStyle: "compressed",
}));

app.use(express.static(path.join(__dirname, "public")));

// w zależności od trybu działania wybieramy odpowiedni poziom logowania
if ("development" === env) {
    app.use(logger("dev"));
    app.use(errorHandler());
} else {
    app.use(logger("short"));
}

app.set("view engine", "ejs");

require("dotenv").config();

const cookieParser = require("cookie-parser");
app.use(cookieParser());
const expressSession = require("express-session");
app.use(expressSession({
    secret: process.env.APP_SECRET,
    resave: false,
    saveUninitialized: false
}));
console.log(' XXX => ' + process.env.APP_SECRET);

// do obsługi autoryzacji używamy Passport.js
const passport = require("./passport");
app.use(passport.initialize());
app.use(passport.session());

const routes = require("./routes");
app.use(routes);

// wyłapujemy odwołania do nieobsługiwanych adresów
app.use((_, res) => {
    // Not Found
    res.sendStatus(404);
});

// Serwer HTTPS
// openssl req -x509 -nodes -days 365 -newkey rsa:1024 -out my.crt -keyout my.key


io
    .of("/chat")
    .on("connect", (socket) => {
        console.log("Uruchomiłem kanał „/chat”");
        socket.on("message", (data) => {
            console.log(`/chat: ${data}`);
            socket.emit("message", `/chat: ${data}`);
        });
    });

io
    .of("/news")
    .on("connect", (socket) => {
        console.log("Uruchomiłem kanał „/news”");
        socket.on("message", (data) => {
            console.log(`/news: ${data}`);
            socket.emit("message", `/news: ${data}`);
        });
    });

httpServer.listen(3001, () => {
    console.log(`Serwer działa pod adresem: https://localhost:${port}`);
});
