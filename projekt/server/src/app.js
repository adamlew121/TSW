const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const config = require('./config/config')
const socketio = require("socket.io");
// const formatMessage = require('./utils/messages');
// const {
//   userJoin,
//   getCurrentUser,
//   userLeave,
//   getRoomUsers
// } = require('./utils/users');

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
// require('./routes')(app)
const server = require("../https")(app);
const io = socketio(server);

// const botName = 'ChatCord Bot';

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

// app.uszanowanko = io


const port = config.port
server.listen(port, () => console.log(`Server started on port ${port}`));

