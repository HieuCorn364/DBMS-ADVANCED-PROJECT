const express = require('express');
const router = express.Router();
const Course = require('../models/Course');

// Lấy danh sách khóa học
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find().populate('InstructorId', 'FullName');
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Lấy chi tiết khóa học
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('InstructorId', 'FullName');
    if (!course) return res.status(404).json({ error: 'Course not found' });
    res.json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;