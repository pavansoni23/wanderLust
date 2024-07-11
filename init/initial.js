let listingData = require("./data.js");
const Listing = require("../models/listing.js");


const mongoose = require("mongoose");

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderLust');
}





const initDB = async () => {
    await Listing.deleteMany({});

    // adding owner in each sample-listing
    listingData = listingData.map((obj) => ({
        ...obj,
        owner : '6683bb6cb3ab7bc3421ed92b'
    }));

    await Listing.insertMany(listingData);

    console.log("Data initialised");
}

initDB();

