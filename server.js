var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');

var Todo = require('./app/models/todo');
var API_ROOT = require('./web.config');

mongoose.connect(API_ROOT);

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = 8080;

// configure routes
var router = express.Router();

// middleware to use for all requests
router.use(function(req, res, next) {
    console.log('log something');
    next(); // make sure we go to the next routes and don't stop here
});

var todosRoute = router.route('/todos');

todosRoute.post(function(req, res){
  var todo = new Todo();
  todo.title = req.body.title;

  todo.save(function(err) {
    if (err) { res.send(err); }

    res.json({ message: 'todo created!' });
  });
});

todosRoute.get(function(req, res){
  Todo.find(function(err, todos) {
    if (err) { res.send(err); }
    res.json(todos);
  });
});



// more routes
app.use('/api', router);

app.listen(port);
console.log("listening on port: " + port);
