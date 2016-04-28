var Todo = require('../models/todo');
var User = require('../models/user');
var jwt = require('jwt-simple');
var config = require('../web.config');
var _ = require('lodash');

extractUserData = function(req) {
  var token = req.query.access_token;
  var decoded = jwt.decode(token, config.SECRET);
  
  return decoded.user;
}

// GET http://host/api/todos?access_token={token}
// HEADERS: Content-Type: application/json
module.exports.getTodos = function(req, res) {
  var user = extractUserData(req);
  
  User.findOne({ username: user.username }, function(err, entry){
    res.json(entry.todos);
  });
};

// GET http://host/api/todos/:id?access_token={token}
// HEADERS: Content-Type: application/json
module.exports.getTodo = function(req, res){
  var user = extractUserData(req);
  
  User.findOne({ username: user.username }, function(err, entry){
    var indexOfTodo = _.findIndex(entry.todos, function(t){
      return t._id == req.query.id;
    });
    
    res.json(entry.todos[indexOfTodo]);
  });
};

// POST http://host/api/todos?access_token={token}
// HEADERS: Content-Type: application/json
// BODY: {"title": "some title", "isDone": false, "dueDate": DateObject}
module.exports.createTodo = function(req, res){
  var user = extractUserData(req);
  
  var todo = new Todo({
    title: req.body.title,
    isDone: req.body.isDone,
    dueDate: req.body.dueDate
  });

  User.findOne({ username: user.username }, function(err, entry){
    entry.todos.push(todo);
    entry.save(function(err){
      if (err) { res.send(err); }
      else { res.json(todo); }  
    });
  });
};

// PUT http://host/api/todos/:id?access_token={token}
// HEADERS: Content-Type: application/json
// BODY: {"title": "some title", "isDone": false, "dueDate": DateObject}
module.exports.updateTodo = function(req, res){
   var user = extractUserData(req);
  
   User.findOne({ username: user.username }, function(err, entry){
     var indexOfTask = _.findIndex(entry.todos, function(t){
       return t._id.toString() == req.query.id;
     });

     // capture previous state     
     var updatedTask = entry.todos[indexOfTask];

     // update with whatever was sent with the request
     if(typeof(req.body.title) != 'undefined'){
        updatedTask.title = req.body.title;
     }

     if(typeof(req.body.isDone) != 'undefined'){
        updatedTask.isDone = req.body.isDone;
     }

     if(typeof(req.body.dueDate) != 'undefined'){
        updatedTask.dueDate = req.body.dueDate;
     }
     
     entry.update(updatedTask, function(err, affectedRows, rawResponse){
       if(err) { res.send(err); }
       else { res.sendStatus(200); }
     });
   });
};

// DELETE http://host/api/todos/:id?access_token={token}
// HEADERS: Content-Type: application/json
module.exports.deleteTodo = function(req, res){
   var user = extractUserData(req);
  
   User.findOne({ username: user.username }, function(err, entry){
     _.remove(entry.todos, function(t){
       return t._id.toString() == req.query.id;
     });
     entry.save(function(err){
       if(err) { res.send(err); }
       else { res.sendStatus(204); }
     });
   });
}
