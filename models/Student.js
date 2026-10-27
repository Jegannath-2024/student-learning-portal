const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  avatar: { type: String, default: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80' },
  bio: { type: String, default: 'Dedicated learner passionate about computer science and modern software engineering.' },
  learningGoals: { type: String, default: 'Master Full-Stack Web Development & Cloud Deployment' },
  major: { type: String, default: 'Computer Science & Engineering' },
  studentIdNumber: { type: String, default: 'STU-2026-8941' },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Student', studentSchema);
