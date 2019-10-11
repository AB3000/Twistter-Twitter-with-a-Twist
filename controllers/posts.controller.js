var mongoose = require("mongoose");
var passport = require("passport");
var bodyParser = require("body-parser");  
var user = require("../models/user"); //reference to user schema
var post = require("../models/post");


exports.navigate_to_posts = function (req, res) {
    try {
        post.find( { userid: req.session.userID } );
    } catch(err) {
        console.log(err);
        res.render('./error');
    }
}