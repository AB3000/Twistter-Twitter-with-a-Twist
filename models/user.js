const mongoose = require('mongoose');
//added to also make username unique
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

//creating the user schema
let userSchema = new Schema({
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    username: {
      type: String,
      unique: true,
      required: true
    },
    password: {
      type: String,
      required: true
    }
});

userSchema.plugin(uniqueValidator);
var user = mongoose.model('user', userSchema);
module.exports = user;
