const http = require('http');
const path = require("path");
const express = require("express");
const app = express();
const port = process.env.PORT || "5000";

app.get("/", (req, res) => {
  res.status(200).send("Hello World");
});

app.get('/login', function (req, res,html) {
 res.sendFile(path.join(__dirname+'/signup.html'));
});

var mongoose = require("mongoose");
var passport = require("passport");
var bodyParser = require("body-parser");  
var user = require("./models/user"); //reference to user schema
var post = require("./models/post"); //reference to user schema

mongoose.connect('mongodb+srv://Twistter:CS30700!@twistter-dcrea.mongodb.net/Twistter307?retryWrites=true&w=majority',{useNewUrlParser: true},function(error){
  if(error){
console.log("Couldn't connect to database");
    } else {
      console.log("Connected To Database");
    }
});


//Login, Logout, Signup
app.use(express.urlencoded())
app.post("/signup", (req, res) => {
  console.log("SIGNUP");

  const e = req.body.email;
  const p = req.body.password;
  res.status(200).send(e);
  res.end();

  var User = mongoose.model('users.js', userSchema);
  var newUser = new User({
  	email: e, 
  	password: p
  });
  newUser.save(function (err, e) {
  	if (err) return console.error(err);
    console.log("shithead successfuly saved");
  })
});

app.listen(port, () => {
  console.log(`Listening to requests on http://localhost:${port}`);
});
