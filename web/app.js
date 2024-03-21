const express = require('express');
const path = require('path');
const app = express();
const port = 8080;
const bodyParser = require('body-parser');
const {PubSub} = require('@google-cloud/pubsub');
const { appendFileSync } = require('fs');
const { json } = require('body-parser');


//Middleware
app.use(bodyParser.urlencoded(  { extended: false}));
app.use(bodyParser.json());

//set a varibale pointing to our pubsub topic
const pubsub_topic = "travel_deals_signup";


// ROUTES
app.get('/', (req, res) => {
  //res.status(200).send('Hello, world!');
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.post('/subscribe', async (req, res) => {
  const email = req.body.email_address;
  const regions = req.body.watch_region;


  //Create a PubSub client
  const pubSubClient = new PubSub();

  //Create the "Payload" for our message
  const message_data = JSON.stringify({
    email_address: email,
    watch_region: regions
  });

  //Create a dta buffer that allows us to stream a message to the topic
  const dataBuffer = Buffer.from(message_data);


  //Publish the message to the PubSub topic
  const messageID = await pubSubClient.topic(pubsub_topic).publishMessage({data: dataBuffer});


  console.log(`Message ID: ${messageID}`);

  res.status(200).send(`Thanks for signing up for Travel Deals. <br/>Message ID ${messageID}`)


});

app.listen(port, () => {
  console.log(`TravelDeals Web App listening on port ${port}`);
});