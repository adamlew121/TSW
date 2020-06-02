const express = require('../../client/node_modules/express')
const bodyParser = require('../../client/node_modules/body-parser')
const cors = require('../../client/node_modules/cors')
const morgan = require('../../client/node_modules/morgan')
const config = require('./config/config')
const socketio = require("../../client/node_modules/socket.io");
const fs = eval('require("fs")')
const https = eval('require("https")')


const app = express();

app.use(morgan('combine'))
app.use(bodyParser.json());
app.use(cors())

require('./passport')
const routes = require('./routes')

app.use(routes)

app.use((_, res) => {
    // Not Found
    res.sendStatus(404);
});
var privateKey = fs.readFileSync(__dirname + "\\my.key")
var certificate = fs.readFileSync(__dirname + "\\my.crt")
var credentials = {key: privateKey, cert: certificate}



const server = https.createServer(credentials, app);
const io = socketio(server);


io.on('connection', function(socket) {
    // console.log(socket.id)
    socket.on('SEND_BID', function(data) {
        // console.log(socket)
        io.emit('BID', data)
    });
    socket.on('SEND_MESSAGE', function(data) {
        // console.log(socket)
        io.emit('MESSAGE', data)
    });
});



const port = config.port
server.listen(port, () => console.log(`Server started on port ${port}`));

