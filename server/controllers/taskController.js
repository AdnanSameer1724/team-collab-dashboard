const Task = require('../models/Task');
const asyncHandler = require('express-async-handler');

exports.createTask = asyncHandler(async (req, res) => {
    const task = await Task.create({
        ...req.body,
        createdBy: req.user.id
    });
    res.status(201).json(task);
});

exports.getTasks = asyncHandler(async (req, res) => {
    const { status, priority } = req.query;
    const filter = { createdBy: req.user.id };

    if(status) filter.status = status;
    if(priority) filter.priority = priority;

    const tasks = await Task.find(filter);
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