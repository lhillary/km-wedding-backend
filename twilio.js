const client = require('twilio')(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );
const mynumber = process.env.TWILIO_PHONE_NUMBER;
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const {pool} = require('./config');

const sendMessage = (request, response) => {
client.messages
    .create({
        body: request.body.message,
        from: mynumber,
        to: request.body.number
    })
    .then(function(message) {
        console.log(message.sid);
        response.send(JSON.stringify(message, undefined, 2));
        response.end();
    })
    .catch(function(error) {
        console.error(error);
        response.send(JSON.stringify(error, undefined, 2));
        response.end();
    });
}

const getMessageLogs = (request, response) => {
    const data = {
        limit: 100, 
        from: request.body.number || undefined, 
        dateSentAfter: request.body.dateSentAfter || undefined,
    };

    client.messages.list(data)
        .then(function(messages) {
            response.send(JSON.stringify(messages));
            response.end();
        });
}

const parseMessagesReceived = (request, response) => {
    const twiml = new MessagingResponse();
    const MakeTrue = "t";
    const MakeFalse = "f";
    const MakeTwo = 2;
    const Phone = request.body.From;

    let userResponse = request.body.Body;
    userResponse = userResponse.toLowerCase();

    pool.query(
        'UPDATE Contacts SET Responded = $1 WHERE Phone = $2',
        [MakeTrue, Phone],
        (error, results) => {
            if (error) {
                throw error;
            }
        }
    )

    if (userResponse.indexOf('yes') > -1 || userResponse == 'yes' || userResponse == 'y') {

        pool.query(
            'UPDATE Contacts SET Attending = $1, Number = 1 WHERE Phone = $2',
            [MakeTrue, Phone],
            (error, results) => {
                if (error) {
                    throw error;
                }
            }
        )

        twiml.message('Yay! Can\'t wait to see you! \n\nWe\'re gonna party hardy! See you there! \n\nPlease text 1 if you\'re bringing your partner/spouse/guest.');
    } else if (userResponse.indexOf('no') > -1 || userResponse == 'no' || userResponse == 'n') {

        pool.query(
            'UPDATE Contacts SET Attending = $1 WHERE Phone = $2',
            [MakeFalse, Phone],
            (error, results) => {
                if (error) {
                    throw error;
                }
            }
        )

        twiml.message('Sorry to hear you can\'t make it! We\'ll miss your face but know you\'re there in spirit.');
    } else if (userResponse.indexOf('1') > -1 || userResponse.indexOf('one') > -1 || userResponse == '1' || userResponse == 'one') {

        pool.query(
            'UPDATE Contacts SET Number = $1 WHERE Phone = $2',
            [MakeTwo, Phone],
            (error, results) => {
                if (error) {
                    throw error;
                }
            }
        )

        twiml.message('Awesome! Looking forward to seeing y\'all!');
    } else {
        twiml.message('What\'s that? You kiss your mother with that mouth? \n\nIf you meant something else and butt-dialed, email or text Katie at katie.schramm19@gmail.com or 989-297-4007.');
    }

    response.writeHead(200, {'Content-Type': 'text/xml'});
    response.end(twiml.toString());
}

module.exports = {
    sendMessage,
    getMessageLogs,
    parseMessagesReceived
}