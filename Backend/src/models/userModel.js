const mongoose = require('mongoose');

const userSchema = new mongoose.Schema ({
    userName: {
        type: String,
        unique: [true, "username already taken"],
        required: true,

    },
    email: {
        type: String,
        unique: [true, "email already existed"],
        required: true,
        
    },
    password: {
        type: String,
        required: true,
    },


})
const userModel = mongoose.model("users",userSchema);
module.exports = userModel;