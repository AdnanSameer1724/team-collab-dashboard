const Task = require('../models/Task');
const asyncHandler = require('express-async-handler');

exports.createTask = asyncHandler(async (req, res) => {
    const { title, description, status, dueDate } = req.body;
    const task = new Task({ title, description, status, dueDate, user: req.userId });
    await task.save();
    res.status(201).json(task);
});

exports.getTasks = asyncHandler(async (req, res) => {
    const { status, sortBy } = req.query;
    const filter = { createdBy: req.user.id };
    const sort = sortBy === "dueDate" ? { dueDate: 1 } : {};

    if(status) filter.status = status;
    if(priority) filter.priority = priority;

    const tasks = await Task.find(filter).sort(sort);
    res.json(tasks);
});

exports.updateTask = asyncHandler(async (req, res) => {
    let task = await Task.findById(req.params.id);

    if(!task){
        res.status(404);
        throw new Error('Task not found');
    }

    if(task.createdBy.toString() !== req.user.id) {
        res.status(401);
        throw new Error('Not authorized');
    }

    task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true});
    res.json(task);
});

exports.deleteTask = asyncHandler(async (req, res) => {
    const task = await Task.findById(req.params.id);

    if(!task){
        res.status(404);
        throw new Error('Task not found');
    }

    if(task.createdBy.toString() !== req.user.id) {
        res.status(401);
        throw new Error('Not Authorized');
    }

    await task.remove();
    res.json({ success: true });
});