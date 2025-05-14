const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  lessonId: { type: mongoose.Schema.Types.ObjectId, required: true },
  completed: { type: Boolean, default: false }
});

const enrollmentSchema = new mongoose.Schema({
  UserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  CourseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  EnrolledAt: { type: Date, default: Date.now },
  Progress: [progressSchema]
});

module.exports = mongoose.model('Enrollment', enrollmentSchema);