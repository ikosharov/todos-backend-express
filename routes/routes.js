var express = require('express');
var todosController = require('../controllers/todos');
var usersController = require('../controllers/users');
var authController = require('../controllers/auth');

var router = express.Router();

router.get('/', function(req, res){
  res.end('hello from todos API');
});

router.post('/login', function(req, res){
  authController.login(req, res);
});

router.get('/api/users', function(req, res){
  return usersController.getUsers(req, res);
});

router.get('/api/users/:username', function(req, res){
  return usersController.getUser(req, res);
});

router.post('/api/users', function(req, res){
  return usersController.createUser(req, res);
});

router.get('/api/todos', function(req, res){
  return todosController.getTodos(req, res);
});

router.get('/api/todos/:id', function(req, res){
  return todosController.getTodo(req, res);
});

router.post('/api/todos', function(req, res){
  return todosController.createTodo(req, res);
});

router.put('/api/todos/:id', function(req, res){
  return todosController.updateTodo(req, res);
});

router.delete('/api/todos/:id', function(req, res){
  return todosController.deleteTodo(req, res);
});

module.exports = router;
