var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');

var API_ROOT = require('./web.config');
var router = require('./routes/routes')

var app = express();

// configure app to allow controllers
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// configure app to use bodyParser(). this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose.connect(API_ROOT);

var port = process.env.PORT || 1337;

// configure routing
app.use('/api', router);

app.listen(port);
console.log("listening on port: " + port);
