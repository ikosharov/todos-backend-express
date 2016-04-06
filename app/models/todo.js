var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TodoSchema = new Schema({
    title: String
});

module.exports = mongoose.model('Todo', TodoSchema);
