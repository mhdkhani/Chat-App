let expect = require('expect');
var {generateMessage} = require('./message');
describe('Generate Message' , () => {
    it('should generate correct message object', function () {
        let from = 'Omid' ,
            text = 'Some Text' ,
            message = generateMessage(from,text);


        expect(typeof message.createdAt).toBe('number');
        expect(message).toMatchObject({from,text});

    });
})