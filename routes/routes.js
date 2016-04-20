var express = require('express');
var todosController = require('../controllers/todos');
var usersController = require('../controllers/users');

var router = express.Router();

router.get('/', function(req, res){
  res.end('hello from todos API');
});

router.get('/users', function(req, res){
  return usersController.getUsers(req, res);
});

router.get('/users/:username', function(req, res){
  return usersController.getUser(req, res);
});

router.post('/users', function(req, res){
  return usersController.createUser(req, res);
});

router.get('/users/:username/todos', function(req, res){
  return todosController.getTodos(req, res);
});

router.get('/users/:username/todos/:id', function(req, res){
  return todosController.getTodo(req, res);
});

router.post('/users/:username/todos', function(req, res){
  return todosController.createTodo(req, res);
});

router.put('/users/:username/todos/:id', function(req, res){
  return todosController.updateTodo(req, res);
});

router.delete('/users/:username/todos/:id', function(req, res){
  return todosController.deleteTodo(req, res);
});

module.exports = router;
