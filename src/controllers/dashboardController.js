const Task = require("../models/Task");

const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const now = new Date();

    const totalTasks = await Task.countDocuments({ user: userId });

    const completedTasks = await Task.countDocuments({
      user: userId,
      status: "Completed",
    });

    const pendingTasks = await Task.countDocuments({
      user: userId,
      status: { $ne: "Completed" },
    });

    const overdueTasks = await Task.countDocuments({
      user: userId,
      status: { $ne: "Completed" },
      deadline: { $lt: now },
    });

    const completionRate =
      totalTasks === 0
        ? 0
        : Math.round((completedTasks / totalTasks) * 100);

    res.status(200).json({
      totalTasks,
      completedTasks,
      pendingTasks,
      overdueTasks,
      completionRate: `${completionRate}%`,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  getDashboardStats,
};