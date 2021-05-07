const moment = require('moment');
let generateMessage = (from , text) => {
    return {
        from,
        text,
        createdAt: moment().valueOf()
    }
};


let generateLocationMessage = (from , lat , lng) => {
    return {
        from,
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