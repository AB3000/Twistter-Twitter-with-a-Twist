const http = require('http');
const path = require("path");
const express = require("express");


const app = express();
const port = process.env.PORT || "5000";

app.get("/", (req, res) => {
  res.status(200).send("Hello World");
});

app.listen(port, () => {
  console.log(`Listening to requests on http://localhost:${port}`);
});



var mongoose = require("mongoose");
var passport = require("passport");
var bodyParser = require("body-parser");  

mongoose.connect('mongodb+srv://Twistter:CS30700!@twistter-dcrea.mongodb.net/Twistter307?retryWrites=true&w=majority',{useNewUrlParser: true},function(error){
  if(error){
console.log("Couldn't connect to database");
    } else {
      console.log("Connected To Database");
    }
});