
const {Firestore} = require('@google-cloud/firestore');
const sgMail = require('@sendgrid/mail');
require('dotenv').config()


exports.sendDeal = async (event, context) => {
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

    const email_array = [];
    
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
            const emailAddress = doc.data().email_address;
            if (emailAddress) { // Check if email address exists 
                email_array.push(emailAddress);
            }
        });



        // Log and return email_array
        console.log("Retrieved email addresses:", email_array);
        
        
        // get sendgrid API key through env file
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);

        //declare message
        const msg ={
            to: email_array,
            from: process.env.SENDGRID_SENDER,
            subject: `antweyer ${deal} is a new travel deal`,
            text: `${regions} is a location you signed up to watch and has a new travel deal`
        }
        //send message though sendgrid
        await sgMail
        .send(msg)
        
          

    } catch (error) {
        console.log(`Error querying Firestore or sending email via Sendgrid: ${error}`);
        throw error;
    }
}

