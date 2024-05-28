const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true
    },

    description : String,

    image : {
        type : String,
        default : "https://www.google.com/url?sa=i&url=https%3A%2F%2Funsplash.com%2Fs%2Fphotos%2Fbuying-a-house&psig=AOvVaw2jIZphJ-cLplSguv-EeFcx&ust=1716587275403000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCMiap5TgpIYDFQAAAAAdAAAAABAE",
        set : (v) => v === "" ?
                    "https://www.google.com/url?sa=i&url=https%3A%2F%2Funsplash.com%2Fs%2Fphotos%2Fbuying-a-house&psig=AOvVaw2jIZphJ-cLplSguv-EeFcx&ust=1716587275403000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCMiap5TgpIYDFQAAAAAdAAAAABAE"
                    : v
    },

    price : Number,
    location : String,
    country : String
});

const Listing = mongoose.model("Listing" , listingSchema);

module.exports = Listing;