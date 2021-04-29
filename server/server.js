const path = require('path');
const publicPath = path.join(__dirname, '/../public')
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
let app = express();
let server = http.createServer(app);
let io = socketIO(server);
app.use(express.static(publicPath));
io.on('connection', (socket) => {
    console.log('A new user just connected.');
    socket.on('disconnect', () => {
        console.log('User Was Disconnected.');
    })
})

server.listen(3000, () => {
    console.log('App on port 3000')
})