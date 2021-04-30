let socket = io();
function scrollToBottom() {
    let messages = document.querySelector('#messages').lastElementChild;
    messages.scrollIntoView();
}
socket.on('connect', function () {
    console.log('Connected to Server.');
})
socket.on('disconnect', function () {
    console.log('Disconnect from Server.')
});
socket.on('newMessage', function (message) {
    /*const formatted = moment(message.createdAt).format('LT');
    let li = document.createElement('li');
    li.innerText = `${message.from} ${formatted} : ${message.text}`;
    document.querySelector('#messages').appendChild(li);*/
    const formattedTime = moment(message.createdAt).format('LT');
    const template = document.querySelector('#message-template').innerHTML;
    const html = Mustache.render(template, {
        from: message.from,
        text: message.text,
        createdAt: formattedTime
    });
    let div = document.createElement('div');
    div.innerHTML = html;
    document.querySelector('#messages').appendChild(div);
    scrollToBottom();
});



socket.on('newLocationMessage', function (message) {
    const formattedTime = moment(message.createdAt).format('LT');
    const template = document.querySelector('#location-message-template').innerHTML;
    const html = Mustache.render(template, {
        from: message.from,
        url: message.url,
        createdAt: formattedTime
    });
    const div = document.createElement('div');
    div.innerHTML = html
    document.querySelector('#messages').appendChild(div);
    scrollToBottom();
   /* const formatted = moment(message.createdAt).format('LT');
    let li = document.createElement('li');
    let a = document.createElement('a');
    a.setAttribute('target','_blank');
    a.setAttribute('href',message.url);
    a.innerText = 'My Location';
    li.innerText = `${message.from} ${formatted} : `;
    li.appendChild(a);
    document.querySelector('#messages').appendChild(li);*/
});


/*socket.emit('createMessage', {
    from: 'John',
    text: 'Hi'
}, function (message) {
    console.log('Got it.', message)
})*/


document.querySelector('#submit-btn').addEventListener('click',function(e){
    e.preventDefault();
    var txt = document.querySelector('input[name="message"]').value;
    if (txt && txt !== '' && txt !== ' '){
        socket.emit('createMessage', {
            from: "User",
            text: txt
        }, function () {
        })
        document.querySelector('input[name="message"]').value = '';
    }
});

document.querySelector('#send-location').addEventListener('click',function(e){
    if (!navigator.geolocation){
       return  alert('Geolocation is not supported by your browser');
    }
    navigator.geolocation.getCurrentPosition(function (position) {
        socket.emit('createLocationMessage',{
            lat: position.coords.latitude,
            lng: position.coords.longitude
        })
    } , function (e) {
        alert('Unable to fetch location.' + e.message)
    })
});