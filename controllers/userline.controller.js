var mongoose = require("mongoose");
var passport = require("passport");
var bodyParser = require("body-parser");  
var user = require("../models/user"); //reference to user schema
var post = require("../models/post");

/*exports.userline = function (req, res) {
    try {
	   res.render('');
    } catch(err) {
        console.log(err);
        res.render('./error');
    }
};*/

