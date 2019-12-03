const http = require("http");
const path = require("path");
const express = require("express");
const app = express();
const port = process.env.PORT || "5000";
var router = express.Router();
var cookieParser = require("cookie-parser");
var session = require("express-session");
const util = require("util");
var ejs = require("ejs");
var bodyParser = require("body-parser");

if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require("node-localstorage").LocalStorage;
  localStorage = new LocalStorage("./scratch");
}

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(express.static(path.join(__dirname, "public")));

var AES = require("crypto-js/aes");
var SHA256 = require("crypto-js/sha256");
var CryptoJS = require("crypto-js");
console.log(CryptoJS.HmacSHA1("Message", "Key"));

var nodemailer = require("nodemailer");
var fs = require("fs"); // notice this
const { promisify } = require("util");
const readFile = promisify(fs.readFile);

app.use(cookieParser());
app.use(session({ secret: "Does this work?" }));
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "login.html"));
});

app.get("/signup", function(req, res, html) {
  res.sendFile(path.join(__dirname + "/signup.html"));
});

app.get("/login", function(req, res, html) {
  res.sendFile(path.join(__dirname + "/login.html"));
});

app.get("/redirection", function(req, res, html) {
  res.sendFile(path.join(__dirname + "/redirection.html"));
});



app.get("/verification", function(req, res, html) {

  console.log("id is ", req.query["id"]);
  var hashId = req.query["id"].replace(/ /g, "+");
  console.log("id is ", hashId);

  activation.findOne({ hash: hashId }, (err, hashData) => {
    if (err) {
        throw err;
    } 
    
    if(hashData){ //user visits verification link for the first time
      user.findOneAndUpdate(
        { username: hashData.username},
        { $set: { active: true } },
        { upsert: true },
        function(err, doc) {
          if (err) {
            throw err;
          } else {
            console.log(doc.username + " updated. ");
            //remove from verification collection
            activation.findByIdAndRemove(hashData._id, function(err) {
              if (err) {
                console.log(err);
              }
            });
            res.sendFile(path.join(__dirname + "/verification.html"));
          } 
        }
      );
    } else  { //user already visited link (has been verified)
      res.sendFile(path.join(__dirname + "/verification-expired.html"));
    }
  });
});

app.get('/discover', function (req, res) {
  app.locals.currUser = req.session.username;
  if (Object.keys(req.query).length == 0) {
    user.find(function(err, users) {
      //render all users
      res.render("discovery_page", {
        users: users,
        colorScheme: req.session.colorScheme
      });
    });
  } else {
    //render only users matching what user typed in
    user.find(
      { username: { $regex: "^" + req.query.search + ".*", $options: "i" } },
      function(err, users) {
        if (err) {
          console.log(err);
        } else {
          res.render("discovery_page", {
            users: users,
            colorScheme: req.session.colorScheme
          });
        }
      }
    );
  }
});

app.get("/timeline", function(req, res) {
  post.find(function(err, posts) {
    var filtered_posts = [];

    if (err) {
      console.log(err);
    } else {
      //send the filtered version of posts to ejs
      //go through user's followings, and get user topic combinations
      var filtering_criteria = "";
      var highlighting_criteria = "";
      user.findOne(
        { username: req.session.username },
        "following newUserTopicList",
        (err, userData) => {
          filtering_criteria = userData.following;
          highlighting_criteria = userData.newUserTopicList;
          if (userData.following.length == 0) {
            res.render("display-posts", {
              posts: [],
              colorScheme: req.session.colorScheme
            });
          } else {
            post.find(function(err, posts) {
              var users = filtering_criteria.map(function(value) {
                return value.username;
              });

              var highlight = highlighting_criteria.map(function(value) {
                return value;
              });

              newHighlightedTopics = userData.newUserTopicList;

              for (var i = 0; i < posts.length; i++) {
                //see if posts username matches and one of the topics match for each post

                var index = -1;
                var pConcat = posts[i].user + posts[i].topic;
                if (users.indexOf(posts[i].user) !== -1) {
                  index = users.indexOf(posts[i].user);
                  if (
                    filtering_criteria[index].topics.indexOf(posts[i].topic) !=
                    -1
                  ) {
                    filtered_posts.push({
                      post: posts[i],
                      isHighlighted: false
                    });
                  }
                }
                if (highlight.indexOf(pConcat) !== -1 && pConcat !== null) {
                  filtered_posts.push({
                    post: posts[i],
                    isHighlighted: true
                  });
                }
              }

              userData.newUserTopicList = [];
              userData.save();

              filtered_posts.sort(function(a, b) {
                var keyA = new Date(a.date),
                  keyB = new Date(b.date);
                // Compare the 2 dates
                if (keyA < keyB) return -1;
                if (keyA > keyB) return 1;
                return 0;
              });

              res.render("display-posts", {
                posts: filtered_posts,
                colorScheme: req.session.colorScheme
              });
            });
          }
        }
      );
    }
  });
});

app.get("/user-followed", function(req, res) {
  user.findOne(
    { username: req.session.username },
    "following",
    (err, userData) => {
      var userExists = false;
      //check if person is already following user
      userData.following.forEach(function(following_person) {
        if (following_person.username == req.query.user_followed) {
          userExists = true;
          console.log("person already follows user");

          //clears whole user-topic list for specified user and updates with new followed topics
          var j, k, l;
          //loop for finding user in user-topic
          for (j = 0; j < userData.following.length; j++) {
            //once user is found, delete all topics from list
            if (userData.following[j].username == req.query.user_followed) {
              if (req.query.topics == null) {
                
                if (j > -1) {
                  userData.following.splice(j, 1);
                  
                }
              } else {
                var topicSize = userData.following[j].topics.length;
                for (k = 0; k < topicSize; k++) {
                  userData.following[j].topics.pop();
                }
                break;
              } //end else
            }
          }
          /* req.query.topics is a String if only one topic is selected
           for following. Else, it is of type Array */
          if (req.query.topics != null) {
            if (Object.getPrototypeOf(req.query.topics) === String.prototype) {
              userData.following[j].topics.push(req.query.topics);
            } else {
              for (l = 0; l < req.query.topics.length; l++) {
                userData.following[j].topics.push(req.query.topics[l]);
              }
            }
           
          } else {
            //completely unfollowed this user (following[j]) so must also remove userData from following[j]'s followingMeList (for highlighting)
            user.findOne(
              { username: following_person.username },
              "followingMeList",
              (err, unfollowMe) => {
                unfollowMe.followingMeList.forEach(function(
                  personThatUnfollowed
                ) {
                  console.log(personThatUnfollowed._id);
                  if (personThatUnfollowed._id == req.session.userID) {
                    unfollowMe.followingMeList.pull(personThatUnfollowed);
                    unfollowMe.save();
                  }
                });
              }
            );
          }
          userData.save();
        }
      });

      //if person is not following user, add them
      if (!userExists) {
        var newFollowing = {
          username: req.query.user_followed,
          topics: req.query.topics
        };
        userData.following.push(newFollowing);
        userData.save();
        console.log("user added successfully");
        var duplicateUser = false;
        user.findOne(
          { username: req.query.user_followed },
          "username followingMeList",
          (err, posterData) => {
            posterData.followingMeList.forEach(function(other_followers) {
              if (other_followers.username == req.session.username) {
                duplicateUser = true;
                //break;
              }
            });
            if (!duplicateUser) {
              posterData.followingMeList.push(req.session.userID);
              posterData.save();
            }
          }
        );
      }

      //redirect them to the timeline instead
      res.redirect("/timeline");
    }
  );
});

app.get("/id", function(req, res) {
  var user_clicked_id = "";
  var userTopics = "";
  var followedTopics = "";

  //represents the current topics the logged-in user is following from the viewed user
  var checked = [];

  var user_clicked = user.findOne({ username: req.query.username }, function(
    err,
    document
  ) {
    // user_clicked_id = document._id;
    user_clicked_id = document.username;
    app.locals.userlineID = user_clicked_id;
    console.log("user_clicked_id is", app.locals.userlineID);

    //get all the users
    user.findOne(
      { username: req.session.username },
      "following",
      (err, userData) => {
        var following_users = userData.following.map(function(value) {
          return value.username;
        });
        var index = following_users.indexOf(user_clicked_id);

        //get array of topics user follows from viewed user
        var following_topics_user = userData.following.map(function(value) {
          return value.topics;
        });

        console.log("following_topics_user is", following_topics_user);

        topic_followed = [];
        if (index != -1) {
          //logged-in user follows no topics from viewed user

          for (var i = 0; i < document.topics.length; i++) {
            if (
              following_topics_user[index].indexOf(document.topics[i]) != -1
            ) {
              //user follows topic
              topic_followed[i] = true;
            } else {
              //user does not follow topic
              topic_followed[i] = false;
            }
          }
        } else {
          //user follows no topics from viewed user
          console.log("IN HERE, DON'T FOLLOW ANYTHING");
          var arraySize = document.topics.length;
          while (arraySize--) topic_followed.push(false);
        }

        app.locals.topic_followed = topic_followed;
        post.find(function(err, posts) {
          if (err) {
            console.log(err);
          } else {
            //get the user topics
            if (document.topics === null) {
              userTopics = "";
            } else {
              userTopics = document.topics;
              app.locals.userTopics = userTopics;
            }
            //pass in the user's posts and topics
            res.render("display-others-posts", {
              posts: posts,
              colorScheme: req.session.colorScheme
            });
          }
        });
      }
    );
  });
});

app.get("/display_personal", function(req, res) {
  app.locals.userIDejs = req.session.username;
  //THERE IS SOMETIMES AN ISSUE HERE WHERE THE DOCUMENT IS NULL
  //IF IT IS NULL, THEN WE CAN RENDER A PAGE WHERE WE PROMPT THE USER TO LOGIN
  //THIS HAPPENS WHEN I REFRESH THE PAGE
  console.log("THE USER IS", app.locals.userIDejs);
  var userTopics = "";
  user.findOne(
    { username: req.session.username },
    "username topics",
    (err, document) => {
      console.log();
      if (document.topics == null) {
        console.log("THIS IS NULL");
        userTopics = "";
      } else {
        console.log("NOT NULL");
        userTopics = document.topics;
      }
      app.locals.finalUserTopics = userTopics;
      post.find(function(err, posts) {
        if (err) {
          console.log(err);
        } else {
          res.render("display-personal-posts", {
            posts: posts,
            email: req.session.email,
            username: req.session.username,
            colorScheme: req.session.colorScheme,
            bio: req.session.bio
          });
         
        }
      });
    }
  );
});

app.get("/settings", function(req, res) {
  user.find(function(err, users) {
    if (err) {
      console.log(err);
    } else {
      res.render("settings", {
        username: req.session.username,
        email: req.session.email,
        password: req.session.password,
        colorScheme: req.session.colorScheme,
        bio: req.session.bio
      });
      console.log(user);
    }
  });
});

app.get("/deleteUser", function(req, res) {
  post.find(function(err, posts) {
    if (err) {
      console.log(err);
    } else {
      for (var i = 0; i < posts.length; i++) {
        if (posts[i].user == req.session.username) {
          post.findByIdAndRemove(posts[i]._id, function(err) {
            if (err) {
              console.log(err);
            }
          });
        }
      }
    }
  });

  user.findByIdAndRemove(req.session.userID, function(err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/login");
    }
  });
});

app.post("/editName", function(req, res) {
  user.findByIdAndUpdate(
    req.session.userID,
    { $set: { username: req.body.uname } },
    function(err) {
      if (err) {
        console.log(err);
      } else {
        req.session.username = req.body.uname;
        res.redirect("/settings");
      }
    }
  );
});

app.post("/bio", function(req, res) {
  user.findByIdAndUpdate(
    req.session.userID,
    { $set: { bio: req.body.bio } },
    function(err) {
      if (err) {
        console.log(err);
      } else {
        req.session.bio = req.body.bio;
        res.redirect("/settings");
      }
    }
  );
});

app.post("/editcolor", function(req, res) {
  user.findByIdAndUpdate(
    req.session.userID,
    { $set: { colorScheme: req.body.color } },
    function(err) {
      if (err) {
        console.log(err);
      } else {
        req.session.colorScheme = req.body.color;
        res.redirect("/settings");
      }
    }
  );
});

app.post("/editEmail", function(req, res) {
  console.log(req.body.email);
  user.findByIdAndUpdate(
    req.session.userID,
    { $set: { email: req.body.email } },
    function(err) {
      if (err) {
        console.log(err);
      } else {
        req.session.email = req.body.email;
        res.redirect("/settings");
      }
    }
  );
});

app.post("/editPw", function(req, res) {
  console.log(req.body.pw);
  //encrypting the password for storing in DB
  encrypttedP = CryptoJS.SHA1(req.body.pw);
  console.log(encrypttedP);
  encrypttedP = encrypttedP.toString(CryptoJS.enc.Base64);
  user.findByIdAndUpdate(
    req.session.userID,
    { $set: { password: encrypttedP } },
    function(err) {
      if (err) {
        console.log(err);
      } else {
        req.session.password = req.body.pw; //displaying unencrypted password
        res.redirect("/settings");
      }
    }
  );
});

var mongoose = require("mongoose");
var passport = require("passport");
var bodyParser = require("body-parser");
var user = require("./models/user"); //reference to user schema
var post = require("./models/post"); //reference to post schema
var activation = require("./models/activation"); //reference to activation schema

//Connection start
mongoose.Promise = global.Promise;
mongoose.connect(
  "mongodb+srv://Twistter:CS30700!@twistter-dcrea.mongodb.net/Twistter307?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true },
  function(error) {
    if (error) {
      console.log("Couldn't connect to database");
    } else {
      console.log("Connected To Database");
    }
  }
);
mongoose.set("useFindAndModify", false);

//Login, Logout, Signup
app.use(express.urlencoded());
app.post("/signup", (req, res) => {
  //receiving form information from signup.html
  const e = req.body.email;
  const u = req.body.username;
  const p = req.body.password;

  //formatting the email and password info into the user schema

  //using CryptoJS to encrypt password
  encrypttedP = CryptoJS.SHA1(p);
  encrypttedP = encrypttedP.toString(CryptoJS.enc.Base64);

  var newUser = new user({
    email: e,
    username: u,
    password: encrypttedP,
    topics: [],
    colorScheme: "Default",
    newtopics: []
  });

  //Sending email to new user
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "twistter307@gmail.com",
      pass: "CS30700!"
    }
  });

  
  //saving the new user to the database

  newUser.save(function(err, e) {
    console.log(err);
    var alert =
      "alert('Yikes! There's been an error. Please try again at a different time.')";

    if (err) {
      if (err.name == "ValidationError") {
        if (err.message.includes("username")) {
          alert =
            "alert('Username already exists. Please try a different one.')";
        } else if (err.message.includes("email")) {
          alert =
            "alert('Email already registered with account. Please try a different email.')";
        }
      }
      fs.readFile("./signup-error.html", "utf8", function(err, data) {
        res.writeHead(200, { "Content-Type": "text/html" });
        var result = data.replace(/\<\/script>/g, alert + "</script>");
        res.write(result);
        res.end();
        return;
      });
    } else {
      //send email only if meets signup criteria (unique username, unique email)

      //hashing the user
      hashedUser = CryptoJS.SHA1(u);
      hashedUser = hashedUser.toString(CryptoJS.enc.Base64);

      host = req.get("host");
      link = "http://" + req.get("host") + "/verification?id=" + hashedUser;

      var mailOptions = {
        from: "twistter307@gmail.com",
        to: e.email,
        subject: "Thank you for signing up with Twistter",
        text:
          "Hello, hope you enjoy the application :)\n" +
          "Please click on the following link to activate your account: " +
          link
      };

      transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });

      var newActivation = new activation({
        hash: hashedUser,
        username: u
      });

      //save hash and username
      newActivation.save();

      res.redirect("/redirection");
      console.log("new user successfully saved");
    }
  });
});

//Login
app.post("/login", (req, res) => {
  //receiving form information from signup.html
  const e = req.body.email;
  const p = req.body.password;
  encrypttedP = CryptoJS.SHA1(p);
  encrypttedP = encrypttedP.toString(CryptoJS.enc.Base64);

  //looks for a user in the database with the same email

  user.findOne(
    { email: e },
    "email username password colorScheme bio",
    (err, userData) => {
      console.log(userData);
      if (userData == null) {
        res.sendFile(path.join(__dirname, "/login_incorrect.html"));
      }  else if(userData.active == false){
        //CASE WHERE USER EXISTS BUT HAS NOT VERIFIED ACCOUNT YET
        res.sendFile(path.join(__dirname, "/login_verify.html"));

        console.log("user is not active");
      } else if (encrypttedP === userData.password) {
        //Redirect here!
        //Redirect to main posts page
        console.log("Login Successful");
        req.session.email = req.body.email;
        req.session.userID = userData._id;
        req.session.username = userData.username;
        req.session.posts = userData.posts;
        req.session.password = p;
        req.session.colorScheme = userData.colorScheme;
        req.session.bio = userData.bio;
       
        res.redirect("/timeline");
      } else {
        res.sendFile(path.join(__dirname, "/login_incorrect.html"));
      }
    }
  );
});

app.post("/timeline", (req, res) => {
  var currDate = new Date();
  var newPost = new post({
    title: req.body.title,
    description: req.body.description,
    topic: req.body.topic,
    date: currDate,
    user: req.session.username,
    likes: 0,
    dislikes: 0,
    quote: false,
    isRemoved: false
  });

  user.findOne(
    { username: req.session.username },
    "username topics followingMeList",
    (err, userData) => {
      if (!userData.topics.includes(req.body.topic)) {
        //Save this to the topics list and remove it once it is done.
        userData.topics.push(req.body.topic);
        userData.save();
        var i;
        var newCombo = req.session.username + req.body.topic;
        for (i = 0; i < userData.followingMeList.length; i++) {
          user.findOne(
            { _id: userData.followingMeList[i] },
            "newUserTopicList",
            (err, followerData) => {
              followerData.newUserTopicList.push(newCombo);
              followerData.save();
            }
          );
        }
      }
    }
  );

  newPost.save(function(err, e) {
    if (err) return console.error(err);
    else return console.log("succesfully saved");
  });
  res.redirect("/timeline");
});


/**
 * Goes through different database items to delete user's post
 */

app.post("/deletePost", function (req, res) {
console.log("DELETE POST");
//first have to loop through all user's posts to see if there are any post sw that topic left
  //if yes, then just delete post
  //if no, then need to loop through user's topic list, delete topic
    //then loop through all users following list and delete topic
//need to work with quotes regardless

console.log("USER LENGTH", user.length )
var count = 0;
var removedFlag = 0;
post.find(function (err, posts) { 

  for (var i = 0; i < posts.length; i++) {
    //need to gather count of posts with that topic
    if (posts[i].user === req.session.username.toString() && posts[i].topic === req.body.topicCheck.toString()) {
        count++;
    }

    //find any quoted posts
      if (posts[i].quoted_id === req.body.post_to_delete.toString() ) {
        post.findOne({ _id: posts[i]._id }, 'description isRemoved', (err, postData) => {
          //console.log(postData);
          removedFlag = 1;
          postData.description = "";
          postData.isRemoved = true;  
          postData.save();
      });
    }
  }

    //delete post
     post.findByIdAndDelete(req.body.post_to_delete, function (err){
      if (err) {
         console.log(err);
      } 
    });

     //if count is greater than 1, then just refresh page after deletion
     if (count==1) {
      //if count is 1, then need to handle deletion of topics-followings
      user.findOne({ username: req.session.username }, 'topics', (err, userData) => {
        //this will delete the topic from the author's topic list
        var index = userData.topics.indexOf(req.body.topicCheck);
        if (index > -1) {
          userData.topics.splice(index, 1);
          userData.save();
        }
      });
      //now we have to delete the topic from all users who follow the topic
      user.find((err, users) => {
            for (var userSize = 0; userSize < users.length; userSize++) {
              for (var folSize = 0; folSize < users[userSize].following.length; folSize++) {
                  if (users[userSize].following[folSize].username === req.session.username.toString() ) {
                    user.findOne({ username: users[userSize].username}, 'following', (err, userData) => {
                    var topicIndex = userData.following[folSize].topics.indexOf(req.body.topicCheck);
                    if (topicIndex > -1) {
                      userData.following[folSize].topics.splice(topicIndex, 1);
                      userData.save();
                  }
                  });
                }
              }
            }

      });
    }
    res.redirect('/display_personal');
});

});

/*
 * Saves new posts when someone quotes another user
 */
app.post("/quote", (req, res) => {
  console.log("QUOTES");
  console.log("req body is ", req.body);

  console.log("comment is ", req.body.comment);

  text = "";
  if (req.body.comment != undefined) {
    text = req.body.comment;
  }

  //console.log("hereisreq ", req.body.id.toString());
  post.findOne({ _id: req.body.id }, 'title description topic date user likes dislikes', (err, postData) => {
    console.log(postData);

    var currDate = new Date();
    var newPost = new post({
    title: postData.title,
    description: postData.description,
    topic: postData.topic,
    date: currDate,
    user: req.session.username,
    likes: 0,
    dislikes: 0,
    quote: true,
    isRemoved: false,
    quoted_id: req.body.id,
    originalAuthor: postData.user,
    comment: text, 
  });

  //NEED TO SEE IF WE SHOULD SAVE RETWEETED TOPICS TO QUOTERS??
  user.findOne({ username: req.session.username }, 'username topics', (err, userData) => {
    console.log("TESTING TOPICS ", userData.topics)
    if (!userData.topics.includes(postData.topic)) {
      userData.topics.push(postData.topic);
      userData.save();
    }
  });

  newPost.save(function (err, e) {
    if (err) return console.error(err);
    else return console.log('succesfully saved');
  })

      //NEED TO SEE IF WE SHOULD SAVE RETWEETED TOPICS TO QUOTERS??
      user.findOne(
        { username: req.session.username },
        "username topics",
        (err, userData) => {
          console.log("TESTING TOPICS ", userData.topics);
          if (!userData.topics.includes(postData.topic)) {
            userData.topics.push(postData.topic);
            userData.save();
          }
        }
      );

      newPost.save(function(err, e) {
        if (err) return console.error(err);
        else return console.log("succesfully saved");
      });
    }
  );

  res.redirect("/timeline");
}); //end of quote

app.post("/like", (req, res) => {
  user.findOne(
    { username: req.session.username },
    "interactions",
    (err, userData) => {
      var newInteraction = {
        postID: req.body.id.toString(),
        liked: true,
        disliked: false
      };
      //check to see if user has already liked this post
      var alreadyInteracted = false;
      var beenDisliked = false;
      userData.interactions.forEach(function(post) {
        if (post.postID === req.body.id.toString()) {
          if (!post.disliked) {
            
            beenDisliked = post.disliked;
            alreadyInteracted = true;
          } else {
            //undo a dislike and like instead
            beenDisliked = post.disliked;
            alreadyInteracted = false;
            
          }
        }
      });

      if (!alreadyInteracted) {
        //update user's liked posts
        userData.interactions.push(newInteraction);
        userData.save();
        //update the like count on the post
        post.findOne(
          { _id: req.body.id },
          "likes dislikes",
          (err, postData) => {
            postData.likes += 1;
            //if has been disliked, switch to a like
            if (beenDisliked) {
              postData.dislikes -= 1;
            }
            postData.save();
            
          }
        );
      }
      res.redirect("/timeline");
    }
  );
});

app.post("/dislike", (req, res) => {
  user.findOne(
    { username: req.session.username },
    "interactions",
    (err, userData) => {
      var newInteraction = {
        postID: req.body.id.toString(),
        liked: false,
        disliked: true
      };
      //check to see if user has already liked this post
      var alreadyInteracted = false;
      var beenLiked = false;
      userData.interactions.forEach(function(post) {
        if (post.postID === req.body.id.toString()) {
          if (!post.liked) {
           
            alreadyInteracted = true;
          } else {
            //undo a dislike and like instead
            beenLiked = post.liked;
            alreadyInteracted = false;
           
          }
        }
      });

      if (!alreadyInteracted) {
        //update user's liked posts
        userData.interactions.push(newInteraction);
        userData.save();

        //update the like count on the post
        post.findOne(
          { _id: req.body.id },
          "likes dislikes",
          (err, postData) => {
            postData.dislikes += 1;
            //if has been disliked, switch to a like
            if (beenLiked) {
              postData.likes -= 1;
            }

            postData.save();
           
          }
        );
      }
      res.redirect("/timeline");
    }
  );
});

module.exports = router;

app.listen(port, () => {
  console.log(`Listening to requests on http://localhost:${port}`);
});
