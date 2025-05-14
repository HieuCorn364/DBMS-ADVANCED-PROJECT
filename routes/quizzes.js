const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz');
const QuizResult = require('../models/QuizResult');
const authMiddleware = require('../middleware/auth');

// Lấy bài kiểm tra
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Nộp bài kiểm tra
router.post('/results', authMiddleware, async (req, res) => {
  try {
    const { QuizId, Answers } = req.body;
    const quiz = await Quiz.findById(QuizId);
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });

    let score = 0;
    Answers.forEach(answer => {
      const question = quiz.Questions.find(q => q.questionId.toString() === answer.questionId);
      if (question && question.correctAnswer === answer.selectedAnswer) {
        score++;
      }
    });

    const quizResult = new QuizResult({
      UserId: req.user.userId,
      QuizId,
      Score: score,
      Answers
    });
    await quizResult.save();
    res.status(201).json({ message: 'Quiz submitted', score });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Lấy kết quả bài kiểm tra
router.get('/results/:quizId', authMiddleware, async (req, res) => {
  try {
    const result = await QuizResult.findOne({ UserId: req.user.userId, QuizId: req.params.quizId });
    if (!result) return res.status(404).json({ error: 'Result not found' });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;