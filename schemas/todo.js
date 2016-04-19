var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var todoSchema = new Schema({
    title: { type: String, required: true},
    isDone: Boolean,
    createdDate: { type: Date, default: Date.now },
    dueDate: { type: Date, required: true }
});

module.exports = todoSchema;
