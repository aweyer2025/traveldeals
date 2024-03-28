
const {Firestore} = require('@google-cloud/firestore');

exports.sendDeal = (event, context) => {
    const triggerResource = context.resource;

    console.log(`Function triggered by event on: ${triggerResource}`);
    console.log(`Event type: ${context.eventType}`);

    // Print the entire document object as a JavaScript object
    console.log("Event value as a JavaScript object:");
    console.log(event.value);

    // Print the entire document object as a JSON string
    console.log("Event value as a JSON string:");
    console.log(JSON.stringify(event.value));

    // Print just the field named "student_name" in the document
    console.log(`\n\nDeal name:`);
    console.log(`${event.value.fields.deal.stringValue}`); // corrected typo: stringValue instead of stringVlaue

    // Print the first region in the "Regions" field in the document
    console.log(`\n\nFirst Region in deal:`);
    console.log(`${event.value.fields.Regions.arrayValue.values[0].stringValue}`); // corrected typo: stringValue instead of stringVlaue

    // Print all of the regions as strings
    console.log(`All regions in deal:`);
    event.value.fields.Regions.arrayValue.values.forEach((region) => {
        console.log(region.stringValue); // corrected typo: stringValue instead of stringVlaue
    });

    // Concatenate all regions into a single string
    const regions = event.value.fields.Regions.arrayValue.values.map((region) => region.stringValue).join(", ");
    console.log(`The regions include: ${regions}`);

    





}

