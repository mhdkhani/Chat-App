let socket = io();
function scrollToBottom() {
    let messages = document.querySelector('#messages').lastElementChild;
    messages.scrollIntoView();
}
socket.on('connect', function () {
    let searchQuery = window.location.search.substring(1);
    let params = JSON.parse('{"' + decodeURI(searchQuery).replace(/&/g, '","').replace(/\+/g, ' ').replace(/=/g,'":"') + '"}');
    socket.emit('join', params, function(err) {
        if(err){
            alert(err);
            window.location.href = '/';
        }else {
            console.log('No Error');
        }
    })
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

socket.on('updateUsersList' , function (users) {
    let ol = document.createElement('ol');
    users.forEach(function (user) {
        let li = document.createElement('li');
        li.innerHTML = user;
        ol.appendChild(li);
    });
    let usersList = document.querySelector('#users');
    usersList.innerHTML = "";
    usersList.appendChild(ol);
})

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


let timer, timeoutVal = 1000;
const typer = document.getElementById('typer');
typer.addEventListener('keypress', handleKeyPress);
typer.addEventListener('keyup', handleKeyUp);
function handleKeyUp(e) {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => {
        socket.emit('ClearIsTyping', {}, function () {});
    }, timeoutVal);
}
function handleKeyPress(e) {
    window.clearTimeout(timer);
    socket.emit('IsTyping', {}, function () {});
}


socket.on('sendIsTyping', function (message) {
    var types = document.getElementsByClassName(message.socketId);
    var count = types.length;
    if (count <= 0){
        const template = document.querySelector('#is-typing-template').innerHTML;
        const html = Mustache.render(template, {
            from: message.from
        });
        let div = document.createElement('div');
        div.classList.add(message.socketId)
        div.innerHTML = html;
        document.querySelector('#is_typings').appendChild(div);
    }
});

socket.on('sendClearIsTyping', function (message) {
    var types = document.getElementsByClassName(message.socketId);
    for (var i = 0; i < types.length; i++) {
       types[i].remove()
    }
});