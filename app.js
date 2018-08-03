var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
var http = require('http');
var flash = require("connect-flash");
var mongoose = require("mongoose");
var passport = require("passport");
var path = require("path");
var session = require("express-session");
var cookieParser = require("cookie-parser");
var MongoStore = require("connect-mongo")(session);
var setUpPassport = require("./setuppassport");
var routes = require("./routes");

var app = express();
//var uri = "mongodb://localhost:27017/pottery";
var uri = "mongodb://username:password@dsxxxxx.mlab.com:xxx/pottery-users"
mongoose.connect(uri, { useNewUrlParser: true });

setUpPassport();

app.set("port", process.env.PORT || 3000);

app.use(logger('dev'));

app.use(bodyParser.urlencoded({extended: false}));

app.use(cookieParser());

app.use(session({
  store: new MongoStore({ mongooseConnection: mongoose.connection, ttl: 2*60}),
  key: "connect.sid",
  secret: "LUp$Dg?,I#i&owP3=9su+OB%`JgL4muLF5YJ~{;t",
  resave: true,
  saveUninitialized: true,
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(routes);

app.listen(app.get("port"), function() {
  console.log("Server started on port " + app.get("port"));
});

