require('dotenv').config()
const client = require('twilio')(process.env.accountSid, process.env.authToken)

exports.sendWelcomeSMS = (message, context) => {
  console.log(`Encoded message: ${message.data}`);

  const incomingMessage = Buffer.from(message.data, 'base64').toString('utf-8');

  const parsedMessage = JSON.parse(incomingMessage);

  console.log(`Decoded message: ${JSON.stringify(parsedMessage)}`);
  console.log(`Email address: ${parsedMessage.phone_number}`);

  // CREATE A SMS messge
  client.messages
    .create({
      body: 'antweyer Welcome to TravelDeals',
      to: parsedMessage.phone_number,
      from: +18447910548,
    })
    .then((message) => console.log(message.sid));


}