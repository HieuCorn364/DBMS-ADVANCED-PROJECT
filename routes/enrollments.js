const express = require('express');
const router = express.Router();
const Enrollment = require('../models/Enrollment');
const authMiddleware = require('../middleware/auth');

// Đăng ký khóa học
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { CourseId } = req.body;
    const enrollment = new Enrollment({
      UserId: req.user.userId,
      CourseId,
      Progress: []
    });
    await enrollment.save();
    res.status(201).json({ message: 'Enrolled successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Cập nhật tiến độ học
router.put('/progress', authMiddleware, async (req, res) => {
  try {
    const { CourseId, lessonId, completed } = req.body;
    const enrollment = await Enrollment.findOne({ UserId: req.user.userId, CourseId });
    if (!enrollment) return res.status(404).json({ error: 'Enrollment not found' });

    const progress = enrollment.Progress.find(p => p.lessonId.toString() === lessonId);
    if (progress) {
      progress.completed = completed;
    } else {
      enrollment.Progress.push({ lessonId, completed });
    }
    await enrollment.save();
    res.json({ message: 'Progress updated' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Lấy tiến độ học
router.get('/my-courses', authMiddleware, async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ UserId: req.user.userId }).populate('CourseId');
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;