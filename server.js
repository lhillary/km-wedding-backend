"use strict";

const express = require('express');
const cors = require('cors');
const {pool} = require('./config');
const port = 8090;
const client = require('twilio')(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);
const mynumber = process.env.TWILIO_PHONE_NUMBER;
const MessagingResponse = require('twilio').twiml.MessagingResponse;

const jwt = require("express-jwt"); 
const jwksRsa = require("jwks-rsa"); 

const app = express();
const db = require('./queries');
const msg = require('./twilio');

const authConfig = {
  domain: process.env.AUTH_DOMAIN,
  audience: process.env.API_ID
};

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${authConfig.domain}/.well-known/jwks.json`
  }),

  audience: authConfig.audience,
  issuer: `https://${authConfig.domain}/`,
  algorithms: ["RS256"]
});

// disable in development
const origin = {
  origin: ['https://dashboard.katie-mike-wedding.com','http://localhost:8080']
}


// create application/json parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors(origin));

app.get('/', (req, res) => {
  res.json({info: 'KM Wedding API'})
});

//crud
app.get('/contacts', checkJwt, db.getContacts);
app.get('/chase', checkJwt, db.getChaseContacts);
app.get('/attending', checkJwt, db.getAttendingContacts);
app.get('/declined', checkJwt, db.getDeclinedContacts);
app.get('/parents', checkJwt, db.getKatieParents);
app.post('/send', checkJwt, msg.sendMessage);
app.post('/fetch-logs', checkJwt, msg.getMessageLogs);
app.post('/receive', msg.parseMessagesReceived);

// listen on the port
app.listen(process.env.PORT || port, () => {
    console.log(`Server listening on port ${port}`);
});