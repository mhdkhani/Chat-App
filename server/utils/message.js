const moment = require('moment');
let generateMessage = (from ,socketId, text) => {
    return {
        from,
        socketId,
        text,
        createdAt: moment().valueOf()
    }
};


let generateLocationMessage = (from ,socketId, lat , lng) => {
    return {
        from,
        socketId,
        url: `https://google.com/maps?q=${lat},${lng}`,
        createdAt: moment().valueOf()
    }
};


let generateIsTyping = (from , socketId) => {
    return {
        from,
        socketId
    }
}

let generateClearIsTyping = (socketId) => {
    return {
        socketId
    }
}

module.exports = {generateMessage,generateLocationMessage,generateIsTyping,generateClearIsTyping}