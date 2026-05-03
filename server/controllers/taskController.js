import Task from '../models/taskModel.js';

export const createTask = async (req, res) => {
  try {
    const { title, description } = req.body;
    const newTask = new Task({
      title,
      description,
      user: req.user.id,
    });
    await newTask.save();
    res.status(201).json({
      message: 'Task created successfully',
      success: true,
      task: newTask,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      success: false,
      error: error.message,
    });
  }
};

export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id });
    res.status(200).json({
      message: 'Tasks retrieved successfully',
      success: true,
      tasks,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      success: false,
      error: error.message,
    });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found', success: false });
    }
    if (task.user.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Forbidden', success: false });
    }
    task.title = title ?? task.title;
    task.description = description ?? task.description;
    task.status = status ?? task.status;
    await task.save();
    res.status(200).json({
      message: 'Task updated successfully',
      success: true,
      task,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      success: false,
      error: error.message,
    });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found', success: false });
    }
    await task.deleteOne();
    res.status(200).json({
      message: 'Task deleted successfully',
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      success: false,
      error: error.message,
    });
  }
};

export const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({
        message: 'Task not found',
        success: false,
      });
    }
    res.status(200).json({
      message: 'Task retrieved successfully',
      success: true,
      task,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      success: false,
      error: error.message,
    });
  }
};

export const getTasksByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const tasks = await Task.find({ user: req.user.id, status });
    res.status(200).json({
      message: 'Tasks retrieved successfully',
      success: true,
      tasks,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      success: false,
      error: error.message,
    });
  }
};
