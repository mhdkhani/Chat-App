const path = require('path');
const publicPath = path.join(__dirname, '/../public')
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const {generateMessage,generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/isRealString');
let app = express();
let server = http.createServer(app);
let io = socketIO(server);
app.use(express.static(publicPath));
io.on('connection', (socket) => {
    socket.on('createMessage' , (message,callback) => {
        console.log("message" , message);
         io.emit('newMessage' , generateMessage(message.from,message.text));
        /*socket.broadcast.emit('newMessage' , {
            from: message.from ,
            text: message.text,
            createdAt: new Date().getTime()
        });*/
        callback('This is the Server: ');
    })
    socket.on('join', (params, callback) => {
        if(!isRealString(params.name) || !isRealString(params.room)){
            return callback('Name and room are required');
        }
        socket.join(params.room);
        socket.emit('newMessage', generateMessage('Admin', `Welocome to ${params.room}!`));
        socket.broadcast.emit('newMessage' , generateMessage('Admin','New User Joined.'));
        callback();
    })


    socket.on('createLocationMessage' , (coords) => {
        io.emit('newLocationMessage' , generateLocationMessage('Admin',coords.lat , coords.lng ));
    })

    socket.on('disconnect', () => {
        console.log('User Was Disconnected.');
    })
})

server.listen(3000, () => {
    console.log('App on port 3000')
})