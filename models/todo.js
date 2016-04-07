var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TodoSchema = new Schema({
    title: String,
    isDone: Boolean,
    createdDate: { type: Date, default: Date.now },
    dueDate: Date
});

module.exports = mongoose.model('Todo', TodoSchema);
