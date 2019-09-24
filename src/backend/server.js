const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

//allows any orgin to access the express_backend at port 5000
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

// console.log that your server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`));


// create a GET route
app.get('/express_backend', (req, res) => {
  res.send({ express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT' });
});

var mongoose = require('mongoose');


//Set up default mongoose connection
var mongoDB = 'mongodb://127.0.0.1/Twistter307';
  mongoose.connect(mongoDB, function (err) {
      if (err) throw err;
      console.log('Successfully connected');
  });

// //Get the default connection
var db = mongoose.connection;
console.log("DATABSE IS", db);

// //Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var UserModelSchema = new mongoose.Schema({
  username: String,
  password: String
});

// Compile model from schema
var User = mongoose.model('Users', UserModelSchema );
var shithead = new User({ name: 'Silence', password: 'hello'});

shithead.save(function (err, shithead) {
  if (err) return console.error(err);
  // shithead.speak();
});

// var Schema = mongoose.Schema;

// var SomeModelSchema = new Schema({
//     a_string: String,
//     a_date: Date
//   });

// // Compile model from schema
// var SomeModel = mongoose.model('SomeModel', SomeModelSchema );