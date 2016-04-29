var Todo = require('../models/todo');
var User = require('../models/user');
var jwt = require('jwt-simple');
var config = require('../web.config');

extractUserData = function(req) {
  var token = req.headers["access_token"];
  var decoded = jwt.decode(token, config.SECRET);
  
  return decoded.user;
}

// GET http://host/api/todos
// HEADERS: Content-Type: application/json
// HEADERS: access_token: {token}
module.exports.getTodos = function(req, res) {
  var user = extractUserData(req);
  
  User.findOne({ username: user.username }, function(err, userEntry){
    res.json(userEntry.todos);
  });
};

// GET http://host/api/todos/:id
// HEADERS: Content-Type: application/json
// HEADERS: access_token: {token}
module.exports.getTodo = function(req, res){
  var user = extractUserData(req);
  
  User.findOne({ username: user.username }, function(err, userEntry){
    var todo = userEntry.todos.id(req.params.id);
    res.json(todo);
  });
};

// POST http://host/api/todos
// HEADERS: Content-Type: application/json
// HEADERS: access_token: {token}
// BODY: {"title": "some title", "isDone": false, "dueDate": "date string"}
module.exports.createTodo = function(req, res){
  var user = extractUserData(req);
  
  var todo = new Todo({
    title: req.body.title,
    isDone: req.body.isDone,
    dueDate: req.body.dueDate
  });

  User.findOne({ username: user.username }, function(err, userEntry){
    userEntry.todos.push(todo);
    userEntry.save(function(err){
      if (err) { res.send(err); }
      else { res.json(todo); }  
    });
  });
};

// PUT http://host/api/todos/:id
// HEADERS: Content-Type: application/json
// HEADERS: access_token: {token}
// BODY: {"title": "some title", "isDone": false, "dueDate": "date string"}
module.exports.updateTodo = function(req, res){
   var user = extractUserData(req);
  
   User.findOne({ username: user.username }, function(err, entry){
     // capture previous state     
     var updatedTask = entry.todos.id(req.params.id);

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
     
     entry.save(function(err){
       if(err) { res.send(err); }
       else { res.sendStatus(200); }
     });
   });
};

// DELETE http://host/api/todos/:id
// HEADERS: Content-Type: application/json
// HEADERS: access_token: {token}
module.exports.deleteTodo = function(req, res){
   var user = extractUserData(req);
  
   User.findOne({ username: user.username }, function(err, userEntry){
     var todo = userEntry.todos.id(req.params.id);
     todo.remove();
     
     userEntry.save(function(err){
       if(err) { res.send(err); }
       else { res.sendStatus(204); }
     });
   });
}
