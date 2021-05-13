const path = require('path');
const publicPath = path.join(__dirname, '/../public')
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const {generateMessage,generatePrivateMessage,generateLocationMessage,generateIsTyping,generateClearIsTyping} = require('./utils/message');
const {isRealString} = require('./utils/isRealString');
const {Users} = require('./utils/users');
let app = express();
let server = http.createServer(app);
let io = socketIO(server);
let users = new Users();
app.use(express.static(publicPath));
io.on('connection', (socket) => {

    /**
    * Send Message To All Members
    */
    socket.on('createMessage' , (message,callback) => {
        let user = users.getUser(socket.id);
        if(user && isRealString(message.text)){
            io.to(user.room).emit('newMessage', generateMessage(user.name,socket.id, message.text));
        }
        callback('This is the Server: ');
    });

    /**
     * Send Private Message
     */
    socket.on('createPrivateMessage' , (message,callback) => {
        let FromUser = users.getUser(message.from_user);
        if(FromUser && isRealString(message.text)){
            io.to(message.to_user).emit('newPrivateMessage', generatePrivateMessage(FromUser.name,message.from_user, message.text));
        }
        callback('This is the Server: ');
    });


    socket.on('IsTyping' , (message,callback) => {
        let user = users.getUser(socket.id);
        if(user){
            io.to(user.room).emit('sendIsTyping', generateIsTyping(user.name,socket.id));
        }
        callback('This is the Server: ');
    });

    socket.on('ClearIsTyping' , (message,callback) => {
        let user = users.getUser(socket.id);
        if(user){
            io.to(user.room).emit('sendClearIsTyping', generateClearIsTyping(socket.id));
        }
        callback('This is the Server: ');
    });

    socket.on('join', (params, callback) => {
        if(!isRealString(params.name) || !isRealString(params.room)){
            return callback('Name and room are required');
        }
        socket.join(params.room);
        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.room);
        io.to(params.room).emit('updateUsersList', users.getUserList(params.room));
        socket.emit('newMessage', generateMessage('Admin', 'admin',`Welocome to ${params.room}!`));
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', 'admin',"New User Joined!"));
        callback();
    })


    socket.on('createLocationMessage' , (coords) => {
        let user = users.getUser(socket.id);
        if(user){
            io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name,socket.id, coords.lat, coords.lng))
        }
    })

    socket.on('disconnect', () => {
        let user = users.removeUser(socket.id);
        if(user){
            io.to(user.room).emit('updateUsersList', users.getUserList(user.room));
            io.to(user.room).emit('newMessage', generateMessage('Admin', 'admin',`${user.name} has left ${user.room} chat room.`))
        }
    })
})

server.listen(3000, () => {
    console.log('App on port 3000')
})