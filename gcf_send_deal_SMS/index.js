
const {Firestore} = require('@google-cloud/firestore');
require('dotenv').config()
const client = require('twilio')(process.env.accountSid, process.env.authToken)



exports.sendDealSMS = async (event, context) => {
    const triggerResource = context.resource;

    console.log(`Function triggered by event on: ${triggerResource}`);
    console.log(`Event type: ${context.eventType}`);


    // Prints deal headliner
    console.log(`\n\nDeal name:`);
    console.log(`${event.value.fields.deal.stringValue}`);
    let deal = event.value.fields.deal.stringValue

    // Print all of the regions as strings
    console.log(`All regions in deal:`);
    event.value.fields.Regions.arrayValue.values.forEach((region) => {
        console.log(region.stringValue);
    });

    // Concatenate all regions into a single string
    const regions = event.value.fields.Regions.arrayValue.values.map((region) => region.stringValue).join(", ");
    console.log(`The regions include: ${regions}`);

    const phone_array = [];
    
    //Entry point function
    try {
        // Connect to the database
        const db = new Firestore({
            projectId: "sp24-41200-antweyer-traveldeal"
        });

        // Create a "subscribers" collection reference
        const subscribersRef = db.collection('subscribers');

        // Query documents where 'watch_regions' array contains the region tht is defined in the new deal
        const querySnapshot = await subscribersRef.where('watch_regions', 'array-contains', regions).get();

        // Log the number of documents matching the query
        console.log(`Number of subsribers for that region ${querySnapshot.size}`);

        // Loop through each document in snapshot
        querySnapshot.forEach((doc) => {
            // Get email address from the document and push into email_array
            const phoneNumber = doc.data().phone_number;
            if (phoneNumber) { // Check if email address exists 
                phone_array.push(phoneNumber);
            }
        });

        // Log and return phone_arrary
        console.log("Retrieved phone numbers:", phone_array);
        
         // CREATE A SMS messge
        await client.messages
        .create({
            body: `antweyer ${deal}`,
            to: phone_array,
            from: +18447910548,
        })
        .then((message) => console.log(message.sid));
    } catch (error) {
        console.log(`Error querying Firestore or sending email via Sendgrid: ${error}`);
        throw error;
    }
}

