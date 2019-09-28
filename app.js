const http = require('http');
const path = require("path");
const express = require("express");
const app = express();
const port = process.env.PORT || "5000";

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/login', function (req, res,html) {
 res.sendFile(path.join(__dirname+'/signup.html'));
});

var mongoose = require("mongoose");
var passport = require("passport");
var bodyParser = require("body-parser");  
var user = require("./models/user"); //reference to user schema
var post = require("./models/post"); //reference to post schema

mongoose.connect('mongodb+srv://Twistter:CS30700!@twistter-dcrea.mongodb.net/Twistter307?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true}, function(error){
  if(error){
console.log("Couldn't connect to database");
    } else {
      console.log("Connected To Database");
    }
});


//Login, Logout, Signup
app.use(express.urlencoded())
app.post("/signup", (req, res) => {
  //receiving form information from signup.html 
  const e = req.body.email;
  const p = req.body.password;
  res.status(200).send(e);
  res.end();

  //formatting the email and password info into the user schema
  var newUser = new user({
  	email: e, 
  	password: p
  });

  //saving the new user to the database
  newUser.save(function (err, e) {
  	if (err) return console.error(err);
    console.log("new user successfuly saved");
  })
});

app.listen(port, () => {
  console.log(`Listening to requests on http://localhost:${port}`);
});
