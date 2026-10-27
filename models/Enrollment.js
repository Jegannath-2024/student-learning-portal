const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  studentId: { type: String, required: true },
  courseId: { type: String, required: true },
  enrolledAt: { type: Date, default: Date.now },
  progressPercentage: { type: Number, default: 0, min: 0, max: 100 },
  completedLessons: [{ type: String }],
  status: { type: String, enum: ['Active', 'Completed', 'Dropped'], default: 'Active' },
  lastAccessed: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Enrollment', enrollmentSchema);
