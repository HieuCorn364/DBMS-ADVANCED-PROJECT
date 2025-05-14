const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  questionId: { type: mongoose.Schema.Types.ObjectId, required: true },
  selectedAnswer: { type: Number, required: true }
});

const quizResultSchema = new mongoose.Schema({
  UserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  QuizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  Score: { type: Number, required: true },
  Answers: [answerSchema],
  SubmittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('QuizResult', quizResultSchema);