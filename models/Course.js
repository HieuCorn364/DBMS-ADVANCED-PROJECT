const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  lessonId: { type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() },
  title: { type: String, required: true },
  content: { type: String, required: true },
  order: { type: Number, required: true }
});

const courseSchema = new mongoose.Schema({
  Title: { type: String, required: true },
  Description: { type: String, required: true },
  InstructorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  Lessons: [lessonSchema],
  CreatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Course', courseSchema);