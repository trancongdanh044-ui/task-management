const mongoose = require('mongoose');
const generate = require('../../../helpers/generate');

const userSchema = new mongoose.Schema({
  fullName: String,
  phone: String,
  email: String,
  password: String, 
  token: String,
  deleted: {
    type: Boolean,
    default: false
  },
  deleteAt: Date,
  task: [
    {
      task_id: String,
      status: String
    }
  ]
},{
  timestamp: true
});

const User = mongoose.model("User", userSchema, "users");
module.exports = User;