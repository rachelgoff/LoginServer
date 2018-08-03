var express = require("express");
var passport = require("passport");
var User = require("./models/user");
var Pottery = require("./models/pottery");
var router = express.Router();

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    req.flash("info", "You must be logged in to see this page.");
}

router.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.errors = req.flash("error");
  res.locals.infos = req.flash("info");
  next();
});

router.get("/", function(req, res, next) {
  User.find()
  .sort({ createdAt: "descending" })
  .exec(function(err, users) {
    if (err) { return next(err); }
    res.json({user: users});
  });
});

router.post("/login", passport.authenticate("login"), function(req, res){
    res.json({id: req.user.id, username: req.user.username});
  });

router.get("/logout", function(req, res) {
  req.session = null;
  res.clearCookie("connect.sid");
  res.send('Logout');
});

router.post("/signup", function(req, res, next) {
  var username = req.body.username;
  var password = req.body.password;

User.findOne({ username: username }, function(err, user) {
    if (err) { return next(err); }
    if (user) {
      req.flash("error", "User already exists");
      res.status(500);
      res.send("Duplicate users.");
    }
    var newUser = new User({
      username: username,
      password: password
    });
    newUser.save(next);
  });
}, passport.authenticate("login"), function(req, res){
    res.json({id: req.user.id, username: req.user.username});
  });

function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}

module.exports = router;
