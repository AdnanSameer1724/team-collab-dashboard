const { default: mongoose } = require("mongoose");

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    status: { type: String, enum: ['todo', 'in-progress', 'done'],  default: 'todo'},
    priority: { type: String, enum: ['low', 'medium', 'high']},
    dueDate: Date,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});