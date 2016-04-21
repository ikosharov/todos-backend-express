var Todo = require('../models/todo');

// GET http://host/api/users/:username/todos?access_token={token}&username={username}
// HEADERS: Content-Type: application/json
module.exports.getTodos = function(req, res) {
  Todo.find(function(err, todos) {
    if (err) {
      res.send(err);
    }
    else {
      res.json(todos);
    }
  });
};

// GET http://host/api/users/:username/todos/:id?access_token={token}&username={username}
// HEADERS: Content-Type: application/json
module.exports.getTodo = function(req, res){
  Todo.findById(req.params.id, function(err, todo) {
    if (err) {
      res.send(err);
    }
    else {
      res.json(todo);
    }
  });
};

// POST http://host/api/users/:username/todos?access_token={token}&username={username}
// HEADERS: Content-Type: application/json
// BODY: {"title": "some title", "isDone": false, "dueDate": DateObject}
module.exports.createTodo = function(req, res){
  var todo = new Todo({
    title: req.body.title,
    isDone: req.body.isDone,
    dueDate: req.body.dueDate
  });

  todo.save(function(err) {
    if (err) {
      res.send(err);
    }
    else {
      res.json(todo);
    }
  });
};

// PUT http://host/api/users/:username/todos/:id?access_token={token}&username={username}
// HEADERS: Content-Type: application/json
// BODY: {"title": "some title", "isDone": false, "dueDate": DateObject}
module.exports.updateTodo = function(req, res){
  var condition = {_id: req.params.id};
  var update = {};

  if(typeof(req.body.title) != 'undefined'){
    update.title = req.body.title;
  }

  if(typeof(req.body.isDone) != 'undefined'){
    update.isDone = req.body.isDone;
  }

  if(typeof(req.body.dueDate) != 'undefined'){
    update.dueDate = req.body.dueDate;
  }

  Todo.update(condition, update, function(err, affectedRows, rawResponse){
    if(err) {
      res.send(err);
    } else {
      res.sendStatus(200);
    }
  });
};

// DELETE http://host/api/users/:username/todos/:id?access_token={token}&username={username}
// HEADERS: Content-Type: application/json
module.exports.deleteTodo = function(req, res){
  var condition = {_id: req.params.id};
  Todo.remove(condition, function(err){
    if(err) {
      res.send(err);
    } else {
      res.sendStatus(204);
    }
  });
}
