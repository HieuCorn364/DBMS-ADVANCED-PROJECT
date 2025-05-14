const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionId: { type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() },
  content: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: Number, required: true }
});

const quizSchema = new mongoose.Schema({
  CourseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  LessonId: { type: mongoose.Schema.Types.ObjectId },
  Title: { type: String, required: true },
  Questions: [questionSchema],
  CreatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Quiz', quizSchema);