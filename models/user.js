const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
    email : {
        type : String,
        required : true
    } 
});

userSchema.plugin(passportLocalMongoose);               // username & password fields already create ho jygi (Also create hashing function & salt)

const User = mongoose.model("User" , userSchema);

module.exports = User;