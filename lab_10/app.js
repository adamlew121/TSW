
// ładujemy wykorzystywane moduły:

// express – jako „podstawa aplikacji”
const express = require("express");
// tworzymy i konfigurujemy obiekt aplikacji
const app = express();
// obsługa danych typu application/json
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// cookie-session – w sesji zapamiętamy identyfikator rozgrywki
const cookieSession = require("cookie-session");
// drobiazgi do sprawnego i czytelnego logowania
const logger = require("morgan");
const errorHandler = require("errorhandler");

// parametry – ewentualnie przekazywane poprzez zmienne środowiskowe
const port = process.env.PORT || 3001;
const secret = process.env.SECRET || "$uper $ecret";
const env = process.env.NODE_ENV || "development";


// obsługa sesji za pomocą ciasteczek
app.use(cookieSession({secret: secret}));

const path = require("path");
app.use("/lib", express.static(path.normalize("./node_modules/axios/dist")));
app.use("/jss", express.static(path.normalize("./views")))

// middleware do kompilacji SCSS -> CSS
const sass = require("node-sass-middleware");
app.use(sass({
    src: path.join(__dirname, "/src"),
    dest: path.join(__dirname, "/public"),
    debug: true,
    outputStyle: "compressed",
}));

// główny „serwer statyczny”
app.use(express.static(path.join(__dirname, "public")));

// w zależności od trybu działania wybieramy odpowiedni poziom logowania
if ("development" === env) {
    app.use(logger("dev"));
    app.use(errorHandler());
} else {
    app.use(logger("short"));
}



// i „podłączamy” ją pod adres „/mmind”
//app.use("/mmind", routes);
//app.use(routes);

// przechwytujemy niepoprawne odwołania do serwera

app.set("view engine", "ejs");
// uruchamiamy serwer z aplikacją
// app.listen(port, () => {
//     console.log(`Serwer gry dostępny na porcie ${port}`);
// });


//



// konfiguracja aplikacji – dostęp przez zmienne środowiskowe
require("dotenv").config();

// jako „bazy” używamy Express.js


// wszelkie dane przesyłamy w formacie JSON

// machnaizm sesji – z wykorzystaniem ciasteczek
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

// routing aplikacji

// importujemy obsługę zapytań
const routes = require("./routes");
app.use(routes);

// wyłapujemy odwołania do nieobsługiwanych adresów
app.use((_, res) => {
    // Not Found
    res.sendStatus(404);
});

// Serwer HTTPS
// openssl req -x509 -nodes -days 365 -newkey rsa:1024 -out my.crt -keyout my.key
const server = require("./https")(app);
//const port = process.env.port;

server.listen(port, () => {
    console.log(`Serwer działa pod adresem: https://localhost:${port}`);
});


