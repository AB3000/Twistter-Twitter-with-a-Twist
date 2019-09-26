const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// we create a user schema
let userSchema = new Schema({
  fullname: {
    type: String,
    required: true,
   // trim: true
  },
  email: {
    type: String,
    required: true,
   // trim: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
}); // 'runSettersOnQuery' is used to implement the specifications in our model schema such as the 'trim' option.


var user = mongoose.model('user', userSchema);

module.exports = user;