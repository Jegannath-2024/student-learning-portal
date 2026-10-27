const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'faculty'], default: 'student' },
  avatar: { type: String, default: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80' },
  departmentOrMajor: { type: String, default: 'Computer Science & Engineering' },
  title: { type: String, default: 'Student Scholar' },
  bio: { type: String, default: 'Dedicated to advanced technology and cloud computing.' },
  learningGoals: { type: String, default: 'Master Full-Stack Architectures and Microservices' },
  officeHours: { type: String, default: 'Tue/Thu 14:00 - 16:00 UTC' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
