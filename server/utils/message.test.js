let expect = require('expect');
var {generateMessage,generateLocationMessage} = require('./message');
describe('Generate Message' , () => {
    it('should generate correct message object', function () {
        let from = 'Omid' ,
            text = 'Some Text' ,
            message = generateMessage(from,text);


        expect(typeof message.createdAt).toBe('number');
        expect(message).toMatchObject({from,text});

    });
});


describe('Generate Location Message' , () => {
    it('should generate correct location object', function () {
        let from = 'Omid' ,
            lat = 15 ,
            lng = 56 ,
            url = `https://google.com/maps?q=${lat},${lng}`,
            message = generateLocationMessage(from,lat,lng);


        expect(typeof message.createdAt).toBe('number');
        expect(message).toMatchObject({from,url});

    });
});