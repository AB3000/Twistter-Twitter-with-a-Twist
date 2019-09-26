var teamdata = require('../models/post');
 exports.GetPost = function(req, res) {
   var strGroup = "D";
   teamdata.teamlist(strGroup, function(err, teamlist) {
     res.render('index', {
       title: 'Test web page on node.js using Express and Mongoose',
       pagetitle: 'Hello there',
       group: strGroup,
       teams: teamlist
     });
   });
 };