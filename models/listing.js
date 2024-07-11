const mongoose = require("mongoose");
const Review = require("./review.js");

const listingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    image: {
        url : String,
        filename : String,
    },

    price: {
        type: Number,
        required: true

    },

    location: {
        type: String,
        required: true
    },

    country: {
        type: String,
        required: true
    },

    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review"
        }
    ],

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
});


// mongoose-post middleware for deletion handling (listing k delete hote hi usse associated sare reviews bhi delete hone chahiye)
listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
});

const Listing = mongoose.model("Listing", listingSchema);  // collection -> listings

module.exports = Listing;