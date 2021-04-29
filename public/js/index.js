let socket = io();
socket.on('connect', function () {
    console.log('Connected to Server.');
})
socket.on('disconnect', function () {
    console.log('Disconnect from Server.')
});
socket.on('newMessage', function (message) {
    console.log('new message: ', message);
});
socket.emit('createMessage' , {
    from: 'John',
    text: 'Hi'
}, function (message) {
    console.log('Got it.' , message)
});