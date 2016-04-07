var express = require('express');
var todosController = require('../controllers/todos');

var router = express.Router();

router.get('/', function(req, res){
  res.end('hello from todos API');
})

router.get('/todos', function(req, res){
  return todosController.getTodos(req, res);
});

router.get('/todos/:id', function(req, res){
  return todosController.getTodo(req, res);
});

router.post('/todos', function(req, res){
  return todosController.createTodo(req, res);
});

router.put('/todos/:id', function(req, res){
  return todosController.updateTodo(req, res);
});

router.delete('/todos/:id', function(req, res){
  return todosController.deleteTodo(req, res);
});

module.exports = router;
