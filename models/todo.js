var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TodoSchema = new Schema({
    title: { type: String, required: true},
    isDone: Boolean,
    createdDate: { type: Date, default: Date.now },
    dueDate: { type: Date, required: true }
});

module.exports = mongoose.model('Todo', TodoSchema);
