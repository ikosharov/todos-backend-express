var mongoose = require('mongoose');
var todoSchema = require('../schemas/todo');

module.exports = mongoose.model('Todo', todoSchema);
