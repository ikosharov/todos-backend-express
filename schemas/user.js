var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var todoSchema = require('./todo');

var usernameValidator = [
  function(val){
    return val.length >= 4;
  },
  "username should be at least 4 characters"
];

var passwordValidator = [
  function(val){
    return val.length >= 4;
  },
  "password should be at least 4 characters"
];

var userSchema = new Schema({
  username: { type: String, required: true, validate: usernameValidator },
  password: { type: String, required: true, validate: passwordValidator },
  todos: [ todoSchema ]
});

module.exports = userSchema;
