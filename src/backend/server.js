const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

// console.log that your server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`));

// create a GET route
app.get('/express_backend', (req, res) => {
  res.send({ express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT' });
});

var mongoose = require('mongoose');
console.log('HERE WOMEN');



//Set up default mongoose connection
// var mongoDB = 'mongodb://localhost:3000/Twistter';
// mongoose.connect(mongoDB, { useNewUrlParser: true });

// //Get the default connection
// var db = mongoose.connection;

// //Bind connection to error event (to get notification of connection errors)
// db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// var Schema = mongoose.Schema;

// var SomeModelSchema = new Schema({
//     a_string: String,
//     a_date: Date
//   });

//   var Schema = mongoose.Schema;

// var SomeModelSchema = new Schema({
//   a_string: String,
//   a_date: Date
// });

// console.log('SEX FUCK YEAH!'); 

// // Compile model from schema
// var SomeModel = mongoose.model('SomeModel', SomeModelSchema );