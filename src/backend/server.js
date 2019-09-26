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
// var mongoDB = 'mongodb://127.0.0.1/Twistter307';
var mongoDB = 'mongodb+srv://Twistter:CS30700!@twistter-dcrea.mongodb.net/Twistter307?retryWrites=true&w=majority';
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

var PostsModelSchema = new mongoose.Schema({
  shit: String,
  gas: String
});

db.on('open', function (ref) {
  console.log('Connected to mongo server.');
  //trying to get collection names
  mongoose.connection.db.listCollections().toArray(function (err, names) {
      console.log(names); // [{ name: 'dbname.myCollection' }]
      module.exports.Collection = names;
  });
})

// Compile model from schema
var User = mongoose.model('users', UserModelSchema);
var Post = mongoose.model('posts', PostsModelSchema);
var shithead = new User({ username: 'Silence', password: 'hello'});
var passgas = new Post({ shit: 'I farted', gas: 'it smells like dirty or something'});

shithead.save(function (err, shit) {
  if (err) return console.error(err);
  console.log("shithead successfuly saved");
});




// var Schema = mongoose.Schema;

// var SomeModelSchema = new Schema({
//     a_string: String,
//     a_date: Date
//   });

// // Compile model from schema
// var SomeModel = mongoose.model('SomeModel', SomeModelSchema );