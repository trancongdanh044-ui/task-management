const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: String,
  content: String,
  status: String,
  createdBy: String,
  listUser: Array,
  taskParentId: String,
  deleted: {
    type: Boolean,
    default: false
  },
  timeStart: Date,
  timeFinish: Date
},{
  timestamps: true
});

const Task = mongoose.model("Task", taskSchema, "tasks");
module.exports = Task;