const Task = require("../models/Task");

// CREATE TASK
const createTask = async (req, res) => {
  try {
    const { title, description, priority, status, deadline, tags } = req.body;

    // Validation
    if (!title || !deadline) {
      return res.status(400).json({
        message: "Title and deadline are required",
      });
    }

    const task = await Task.create({
      user: req.user.id,
      title,
      description,
      priority,
      status,
      deadline,
      tags,
    });

    res.status(201).json({
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    console.error("Create task error:", error);
    res.status(500).json({
      message: "Server error",
    });
  }
};

// GET ALL TASKS (with filters)
const getTasks = async (req, res) => {
  try {
    const { status, priority, from, to, tag } = req.query;

    let query = {
      user: req.user.id,
    };

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (tag) query.tags = tag;

    if (from || to) {
      query.deadline = {};
      if (from) query.deadline.$gte = new Date(from);
      if (to) query.deadline.$lte = new Date(to);
    }

    const tasks = await Task.find(query).sort({ deadline: 1 });

    const now = new Date();
    const tasksWithOverdue = tasks.map((task) => ({
      ...task.toObject(),
      isOverdue:
        task.deadline < now && task.status !== "Completed",
    }));

    res.status(200).json(tasksWithOverdue);
  } catch (error) {
    console.error("Get tasks error:", error);
    res.status(500).json({
      message: "Server error",
    });
  }
};

// UPDATE TASK
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    // 1️⃣ Task exists?
    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    // 2️⃣ Ownership check
    if (task.user.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Not authorized to update this task",
      });
    }

    // 3️⃣ Update fields (only if provided)
    task.title = req.body.title || task.title;
    task.description = req.body.description || task.description;
    task.priority = req.body.priority || task.priority;
    task.status = req.body.status || task.status;
    task.deadline = req.body.deadline || task.deadline;
    task.tags = req.body.tags || task.tags;

    const updatedTask = await task.save();

    res.status(200).json({
      message: "Task updated successfully",
      task: updatedTask,
    });
  } catch (error) {
    console.error("Update task error:", error);
    res.status(500).json({
      message: "Server error",
    });
  }
};

// DELETE TASK
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    // 1️⃣ Task exists?
    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    // 2️⃣ Ownership check
    if (task.user.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Not authorized to delete this task",
      });
    }

    // 3️⃣ Delete task
    await task.deleteOne();

    res.status(200).json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("Delete task error:", error);
    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
};