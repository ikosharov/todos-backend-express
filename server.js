var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');
var cors = require('cors');

var config = require('./web.config');
var router = require('./routes/routes');
var validateReqeust = require('./middlewares/validateRequest');

var app = express();

// configure app to allow controllers
app.use(cors());

// configure app to use bodyParser(). this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose.connect(config.API_ROOT);

var port = process.env.PORT || 3000;

app.all('/api/*', validateReqeust);

// configure routing
app.use('/', router);

app.listen(port, function(){
  console.log("listening on port: " + port);
});
