var Todo = require('../models/todo');

module.exports.getTodos = function(req, res){
  Todo.find(function(err, todos) {
    if (err) { res.send(err); }
    res.json(todos);
  });
};

module.exports.getTodo = function(req, res){
  Todo.findById(req.params.id, function(err, todo) {
    if (err) { res.send(err); }
    res.json(todo);
  });
};

module.exports.createTodo = function(req, res){
  var todo = new Todo();
  todo.title = req.body.title;
  todo.isDone = req.body.isDone;
  todo.dueDate = req.body.dueDate;

  todo.save(function(err) {
    if (err) { res.send(err); }

    res.json(todo);
  });
};

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
