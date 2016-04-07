var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');

var API_ROOT = require('./web.config');
var router = require('./routes/routes')

var app = express();
// configure app to use bodyParser(). this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose.connect(API_ROOT);

var port = 8080;

// configure routing
app.use('/api', router);

app.listen(port);
console.log("listening on port: " + port);
