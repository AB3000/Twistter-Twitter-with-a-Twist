const http = require('http');
const path = require("path");
const express = require("express");
const app = express();
const port = process.env.PORT || "5000";

var AES = require("crypto-js/aes");
var SHA256 = require("crypto-js/sha256");
var CryptoJS = require("crypto-js");
console.log(CryptoJS.HmacSHA1("Message", "Key"));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/signup', function (req, res,html) {
 res.sendFile(path.join(__dirname+'/signup.html'));
});

app.get('/login', function (req, res,html) {
 res.sendFile(path.join(__dirname+'/login.html'));
});

app.get('/posts', function (req, res,html) {
  res.sendFile(path.join(__dirname+'/posts.html'));
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
  const u = req.body.username;
  const p = req.body.password;

  //using CryptoJS to encrypt password
  encrypttedP = CryptoJS.SHA1(p);
  encrypttedP = encrypttedP.toString(CryptoJS.enc.Base64);
  //res.status(204).send();
  //res.end();

  //formatting the email and password info into the user schema
  var newUser = new user({
  	email: e,
  	username: u,  
  	password: encrypttedP
  });

  //saving the new user to the database
  newUser.save(function (err, e) {
  	if (err) {
  		res.status(200).send("Failed to Sign Up")
  		return console.error(err);
  	} else {
  		res.sendFile(path.join(__dirname+'/login.html'));
    	console.log("new user successfuly saved");
	}
  })
});

//Login
app.post("/login", (req, res) => {
  //receiving form information from signup.html 
  const e = req.body.email;
  const p = req.body.password;
  encrypttedP = CryptoJS.SHA1(p);
  encrypttedP = encrypttedP.toString(CryptoJS.enc.Base64);

  //looks for a user in the database with the same email
  user.findOne({email: e}, 'email password', (err, userData) => {
  	console.log(userData);
  	if (userData == null) {
  		res.status(200).send("UserData is null")
  	} else if (encrypttedP === userData.password) {
  		res.status(200).send("Successful Login");
  	} else {
  		res.status(200).send("Failed Login");
  	}
  });
})

app.post("/posted", (req, res) => {
  // console.log("POSTS");
  var newPost = new post({
    title: req.body.title, 
    topic: req.body.topic,
    description: req.body.description
  });

  console.log("newPost is", newPost);
  newPost.save(function (err, e) {
    if (err) return console.error(err);
    else return console.log('succesfully saved');
  })
  res.status(204).send();
});

app.listen(port, () => {
  console.log(`Listening to requests on http://localhost:${port}`);
});
