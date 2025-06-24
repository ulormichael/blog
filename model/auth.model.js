
const mongoose = require("mongoose");
const authSchema = new mongoose.Schema({
  name: String, // Name field of type String
  email: { 
    type: String, 
    required: true, 
    unique: true 
}, // Required and unique email
  password: {
    type: String,
    required: true,
    minlength: 2 // Password must be six characters
  }
}, {timestamps: true});

const Auth = mongoose.model("Auth", authSchema);
module.exports = Auth;
