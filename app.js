const http = require('http');
const path = require("path");
const express = require("express");

const app = express();
const port = process.env.PORT || "5000";

app.get("/", (req, res) => {
  res.status(200).send("Hello World");
});

//Login, Logout, Signup
app.get('/signup', function (req, res,html) {
 res.sendFile(path.join(__dirname+'/signup.html'));
});

app.listen(port, () => {
  console.log(`Listening to requests on http://localhost:${port}`);
});
