const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");
const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// DB connect
connectDB();

// test route
app.get("/", (req, res) => {
  res.send("Task Manager Backend Running");
});

const Task = require("./models/Task");

app.get("/test-task", async (req, res) => {
  const task = await Task.create({
    title: "First Task",
    description: "Testing task model"
  });
  res.json(task);
});


const taskRoutes = require("./routes/task.routes");

app.use("/api/tasks", taskRoutes);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
