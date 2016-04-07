var Todo = require('../models/todo');

module.exports.getTodos = function(req, res){
  Todo.find(function(err, todos) {
    if (err) { res.send(err); }
    res.json(todos);
  });
}

module.exports.createTodo = function(req, res){
  var todo = new Todo();
  todo.title = req.body.title;

  todo.save(function(err) {
    if (err) { res.send(err); }

    res.json({ message: 'todo created!' });
  });
}
