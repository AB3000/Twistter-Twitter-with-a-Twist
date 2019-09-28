const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//creating the user schema
let userSchema = new Schema({
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true
    }
});
var user = mongoose.model('user', userSchema);
module.exports = user;
