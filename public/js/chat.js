let socket = io();

function scrollToBottom() {
    let messages = document.querySelector('#messages').lastElementChild;
    messages.scrollIntoView();
}

socket.on('connect', function () {
    let searchQuery = window.location.search.substring(1);
    let params = JSON.parse('{"' + decodeURI(searchQuery).replace(/&/g, '","').replace(/\+/g, ' ').replace(/=/g, '":"') + '"}');
    socket.emit('join', params, function (err) {
        if (err) {
            alert(err);
            window.location.href = '/';
        } else {
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
        user_id: message.socketId,
        createdAt: formattedTime
    });
    let div = document.createElement('div');
    div.innerHTML = html;
    document.querySelector('#messages').appendChild(div);
    scrollToBottom();
});

socket.on('updateUsersList', function (users) {
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


document.querySelector('#submit-btn').addEventListener('click', function (e) {
    e.preventDefault();
    var txt = document.querySelector('input[name="message"]').value;
    if (txt && txt !== '' && txt !== ' ') {
        socket.emit('createMessage', {
            text: txt
        }, function () {
        })
        document.querySelector('input[name="message"]').value = '';
    }
});

document.querySelector('#send-location').addEventListener('click', function (e) {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser');
    }
    navigator.geolocation.getCurrentPosition(function (position) {
        socket.emit('createLocationMessage', {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        })
    }, function (e) {
        alert('Unable to fetch location.' + e.message)
    })
});

/* Send Is Typing Status */
let timer, timeoutVal = 1000;
const typer = document.getElementById('typer');
typer.addEventListener('keypress', handleKeyPress);
typer.addEventListener('keyup', handleKeyUp);

function handleKeyUp(e) {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => {
        socket.emit('ClearIsTyping', {}, function () {
        });
    }, timeoutVal);
}

function handleKeyPress(e) {
    window.clearTimeout(timer);
    socket.emit('IsTyping', {}, function () {
    });
}

socket.on('sendIsTyping', function (message) {
    var types = document.getElementsByClassName(message.socketId);
    var count = types.length;
    if (count <= 0) {
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


/* Private Message Section */
function OpenPv() {
    var div = document.createElement('div');
    div.classList.add('pv_main_div');
    div.setAttribute('id',makeid(12));
    div.setAttribute('onmousedown','changePvPosition(this,event)');
    document.body.appendChild(div);
}
var mousePosition;
var offset = [0,0];
var isDown = false;
var divChangePosition ;
function changePvPosition(elm,event){
    divChangePosition = elm.id;
    isDown = true;
    offset = [
        elm.offsetLeft - event.clientX,
        elm.offsetTop - event.clientY
    ];
}
document.addEventListener('mouseup', function() {
    isDown = false;
    var div = document.getElementById(divChangePosition);
    div.style.cursor = 'default';
}, true);
document.addEventListener('mousemove', function(event) {
    event.preventDefault();
    if (isDown) {
        var div = document.getElementById(divChangePosition);
        mousePosition = {

            x : event.clientX,
            y : event.clientY

        };
        div.style.left = (mousePosition.x + offset[0]) + 'px';
        div.style.top  = (mousePosition.y + offset[1]) + 'px';
        div.style.cursor = 'move';
    }
}, true);


function makeid(length) {
    var result           = [];
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result.push(characters.charAt(Math.floor(Math.random() *
            charactersLength)));
    }
    return result.join('');
}
