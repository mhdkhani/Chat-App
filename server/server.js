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
    socket.emit('newMessage' , {
        from: 'Admin' ,
        text: 'Welcome to Chat Application.',
        createdAt: new Date().getTime()
    });
    socket.broadcast.emit('newMessage' , {
        from: 'Admin' ,
        text: 'New User Joined.',
        createdAt: new Date().getTime()
    });
    socket.on('createMessage' , (message) => {
        console.log("message" , message);
         io.emit('newMessage' , {
            from: message.from ,
            text: message.text,
            createdAt: new Date().getTime()
        });
        /*socket.broadcast.emit('newMessage' , {
            from: message.from ,
            text: message.text,
            createdAt: new Date().getTime()
        });*/
    })
    socket.on('disconnect', () => {
        console.log('User Was Disconnected.');
    })
})

server.listen(3000, () => {
    console.log('App on port 3000')
})