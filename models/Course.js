const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  lessonId: { type: String, required: true },
  title: { type: String, required: true },
  duration: { type: String, required: true },
  videoUrl: { type: String, default: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' },
  summary: { type: String }
});

const moduleSchema = new mongoose.Schema({
  moduleId: { type: String, required: true },
  title: { type: String, required: true },
  lessons: [lessonSchema]
});

const courseSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
  instructor: {
    name: { type: String, required: true },
    avatar: { type: String, default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80' },
    title: { type: String, default: 'Senior Instructor' }
  },
  thumbnail: { type: String, required: true },
  rating: { type: Number, default: 4.8 },
  studentsCount: { type: Number, default: 0 },
  credits: { type: Number, default: 3 },
  duration: { type: String, default: '8 Weeks' },
  tags: [{ type: String }],
  modules: [moduleSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Course', courseSchema);
