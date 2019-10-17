const http = require('http');
const path = require("path");
const express = require("express");
const app = express();
const port = process.env.PORT || "5000";
var router = express.Router();
var cookieParser = require('cookie-parser');
var session = require('express-session');

//app.use(express.static(__dirname + "/views"));
//app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, 'public')));

var AES = require("crypto-js/aes");
var SHA256 = require("crypto-js/sha256");
var CryptoJS = require("crypto-js");
console.log(CryptoJS.HmacSHA1("Message", "Key"));

var nodemailer = require('nodemailer');
var fs = require('fs') // notice this

app.use(cookieParser());
app.use(session({secret: 'Does this work?'}));


app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'login.html'));  
});

app.get('/signup', function (req, res,html) {
 res.sendFile(path.join(__dirname+'/signup.html'));
});

app.get('/login', function (req, res,html) {
 res.sendFile(path.join(__dirname+'/login.html'));
});



app.get('/discover', function(req, res) {
  // console.log("body:", req.body);
  console.log("req search is ", req.param('search'));
  user.find(function(err, users) {
    if (err) {
      console.log(err);
    } else {
      res.render('discovery_page', { users: users });
    }
}); 
  // user.find({ users: { $regex : ".*"+ req.query.search +".*", $options:'i' } }, function(err, result){
  //   return res.status(200).json({result: result})
  // });
});

// app.get('/posts', function (req, res,html) {
//   res.sendFile(path.join(__dirname+'/posts.html'));
//  });

var mongoose = require("mongoose");
var passport = require("passport");
var bodyParser = require("body-parser");  
var user = require("./models/user"); //reference to user schema
var post = require("./models/post"); //reference to post schema
//var Posts = mongoose.model('Posts', postSchema);

//Connection start
mongoose.Promise = global.Promise;
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

//Sending email to new user
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'twistter307@gmail.com',
      pass: 'CS30700!'
    }
  });
  
  var mailOptions = {
    from: 'twistter307@gmail.com',
    to: e,
    subject: 'Thank you for signing up with Twistter',
    text: 'Hello, Hope you enjoy the application :)'
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });

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

    console.log(err);
    var alert = "alert('Yikes! There's been an error. Please try again at a different time.')";
    
  	if (err) {
      if(err.name == 'ValidationError'){
        if(err.message.includes('username')){
          alert = "alert('Username already exists. Please try a different one.')";
        } else if (err.message.includes('email')){
          alert = "alert('Email already registered with account. Please try a different email.')" 
        }
      }
      fs.readFile('./signup.html', 'utf8', function (err,data) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        var result = data.replace(/\<\/script>/g, alert + '</script>');
        res.write(result);
        res.end();
        return;
     });
  	} else {
  		res.sendFile(path.join(__dirname+'/login.html'));
    	console.log("new user successfully saved");
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
  
  user.findOne({email: e}, 'email username password', (err, userData) => {
  	//console.log(userData);
  	if (userData == null) {
      res.sendFile(path.join(__dirname+'/login.html'))
  		//res.status(200).send("UserData is null")
  	} else if (encrypttedP === userData.password) {
      //Redirect here!
      //Redirect to main posts page
      console.log("Login Successful")
      req.session.userID = userData.username;
      console.log(userData.username);
      console.log(req.session.userID);
      post.find(function(err, posts) {
        if (err) {
            console.log(err);
        } else {
            res.render('display-posts', { posts: posts });
            //console.log(posts);
        }
    });
  	} else {
      //res.status(200).send("Failed Login");
      //res.send('Your username/password is incorrect, try again')
      res.sendFile(path.join(__dirname+'/login.html'), 'Error your username/password is incorrect, try again')
  	}
  });
})

app.post("/posted", (req, res) => {
  // console.log("POSTS");
  var newPost = new post({
    title: req.body.title, 
    description: req.body.description,
    topic: req.body.topic
    
  });


  console.log("newPost is", newPost);
  newPost.save(function (err, e) {
    if (err) return console.error(err);
    else return console.log('succesfully saved');
  })
  res.status(204).send();

});

module.exports = router

app.listen(port, () => {
  console.log(`Listening to requests on http://localhost:${port}`);
});
