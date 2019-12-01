const mongoose = require('mongoose');
//added to also make username unique
const uniqueValidator = require('mongoose-unique-validator');
var ObjectId = mongoose.Schema.Types.ObjectId;
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
    }, 
    topics: {
      type: [String], 
      default: [], 
      required: true
    }, 
    interactions: {
      type: [{
        postID: String, 
        liked: Boolean,
        disliked: Boolean
      }]
    }, 
    following: {
      type: [{
        username: String,
        topics: [String]
      }], 
      default: [] 
    },
    colorScheme:{
      type: String,
      required: true,
      default: "Default"
    },
    followingMeList: {
      type: [ObjectId],
      default:[],
      required: false
    },
    newUserTopicList: {
      type: [String], 
      default: [],
      required: false
    }, 
    active: {
      type: Boolean,
      default: false,
      required: true
    },
    
});

userSchema.plugin(uniqueValidator);
var user = mongoose.model('user', userSchema);
module.exports = user;
