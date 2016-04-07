var express = require('express');
var todosController = require('../controllers/todos.Controller');

var router = express.Router();

router.get('/', function(req, res){
  res.end('hello from todos API');
})

router.get('/todos', function(req, res){
  return todosController.getTodos(req, res);
});

router.post('/todos', function(req, res){
  return todosController.createTodo(req, res);
});

module.exports = router;
