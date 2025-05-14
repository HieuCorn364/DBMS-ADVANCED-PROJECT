const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  Username: { type: String, required: true, unique: true },
  Email: { type: String, required: true, unique: true },
  Password: { type: String, required: true },
  FullName: { type: String, required: true },
  Role: { type: String, enum: ['Student', 'Instructor'], default: 'Student' },
  CreatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);