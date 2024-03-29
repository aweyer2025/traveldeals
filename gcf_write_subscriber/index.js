const {FireStore, Firestore} = require ('@google-cloud/firestore');



exports.write_subscriber = (message, context) => {

    const incomingMessage = Buffer.from(message.data, 'base64').toString('utf-8');

    const parsedMessage = JSON.parse(incomingMessage);

    console.log(`Decoded message: ${JSON.stringify(parsedMessage)}`);
    console.log(`Email address: ${parsedMessage.email_address}`);

  async function writeToFs(){
    const FireStore = new Firestore({
        projectId: 'sp24-41200-antweyer-traveldeal',
        databaseId: ''
    });

    let watchObj = {};

    watchObj.email_address = parsedMessage.email_address
    watchObj.phone_number = parsedMessage.phone_number
    watchObj.watch_regions = parsedMessage.watch_region

    //write to firestore
    let collectionRef = FireStore.collection('subscribers');
    let documentRef = collectionRef.add(watchObj);
  }
  writeToFs()
}