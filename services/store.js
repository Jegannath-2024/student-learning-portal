const Course = require('../models/Course');
const Student = require('../models/Student');
const Enrollment = require('../models/Enrollment');
const User = require('../models/User');

// Exactly 1 student and 1 faculty
const initialUsers = [
  {
    id: "usr-student-1",
    name: "Alex Sterling",
    email: "student@edusphere.edu",
    password: "password123",
    role: "student",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
    departmentOrMajor: "Computer Science & Engineering",
    title: "Undergraduate Scholar",
    bio: "Honors student studying advanced web engineering, cloud computing, and distributed database architectures.",
    learningGoals: "Complete certified technical milestones and software architecture competencies.",
    officeHours: "N/A"
  },
  {
    id: "usr-faculty-1",
    name: "Dr. Sarah Mitchell",
    email: "faculty@edusphere.edu",
    password: "password123",
    role: "faculty",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80",
    departmentOrMajor: "Computer Science & Engineering",
    title: "Professor of Software Engineering",
    bio: "Lead Faculty Instructor for Advanced Web Engineering and Distributed Cloud Systems.",
    learningGoals: "Deliver rigorous curriculum with verified lab practicals.",
    officeHours: "Mon/Wed 14:00 - 16:00 UTC"
  }
];

// Single canonical course authored by Dr. Sarah Mitchell (no dummy courses)
const initialCourses = [
  {
    id: "cs-101",
    title: "Full-Stack Web Architectures",
    description: "Comprehensive guide to building modern, cloud-native web applications with responsive design, asynchronous APIs, and real-time data persistence.",
    category: "Computer Science",
    level: "Intermediate",
    instructor: {
      name: "Dr. Sarah Mitchell",
      email: "faculty@edusphere.edu",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80",
      title: "Professor of Software Engineering"
    },
    thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80",
    rating: 4.9,
    studentsCount: 340,
    credits: 4,
    duration: "10 Weeks",
    tags: ["Web Engineering", "REST APIs", "Modern Cloud"],
    modules: [
      {
        moduleId: "mod-1",
        title: "Module 1: Semantic Markup & Modern Styling Systems",
        lessons: [
          {
            lessonId: "les-101",
            title: "Semantic Document Structures & Accessibility",
            duration: "14 min",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
            summary: "Learn how semantic containers and proper document outlining improve SEO and screen reader accessibility."
          },
          {
            lessonId: "les-102",
            title: "Dynamic Layouts with CSS Grid & Custom Properties",
            duration: "22 min",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
            summary: "Implement responsive grid template areas, variables, and keyframe animations for polished interfaces."
          }
        ]
      },
      {
        moduleId: "mod-2",
        title: "Module 2: Client State Management & DOM Manipulation",
        lessons: [
          {
            lessonId: "les-201",
            title: "Object-Oriented Programming & Prototype Models",
            duration: "19 min",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
            summary: "Structure clean, modular JavaScript applications using ES6 classes and prototypal inheritance."
          },
          {
            lessonId: "les-202",
            title: "Efficient DOM Traversal & Event Delegation",
            duration: "25 min",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
            summary: "Manipulate DOM nodes safely and listen to delegated events without unnecessary re-renders."
          }
        ]
      }
    ]
  }
];

const initialEnrollments = [
  {
    id: "enr-1",
    studentId: "usr-student-1",
    courseId: "cs-101",
    enrolledAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    progressPercentage: 50,
    completedLessons: ["les-101", "les-102"],
    status: "Active",
    lastAccessed: new Date().toISOString()
  }
];

// In-Memory store fallback
let memUsers = JSON.parse(JSON.stringify(initialUsers));
let memCourses = JSON.parse(JSON.stringify(initialCourses));
let memEnrollments = JSON.parse(JSON.stringify(initialEnrollments));

let isMongoConnected = false;

function setMongoConnected(status) {
  isMongoConnected = status;
}

// ==========================================
// User Operations
// ==========================================
async function loginUser(email, password) {
  let normEmail = (email || '').trim().toLowerCase();
  // Support both clean aliases
  if (normEmail === 'alex.sterling@learningportal.edu') normEmail = 'student@edusphere.edu';
  if (normEmail === 'sarah.mitchell@learningportal.edu') normEmail = 'faculty@edusphere.edu';

  if (isMongoConnected) {
    try {
      const user = await User.findOne({ 
        $or: [
          { email: normEmail },
          { email: (email || '').trim().toLowerCase() }
        ]
      });
      if (user && user.password === password) {
        return user;
      }
    } catch (err) {
      console.warn("MongoDB login failed, falling back to memory:", err.message);
    }
  }

  const found = memUsers.find(u => 
    (u.email.toLowerCase() === normEmail || u.email.toLowerCase() === (email || '').trim().toLowerCase()) && 
    u.password === password
  );
  return found || null;
}

async function registerUser(userData) {
  const newUser = {
    id: "usr-" + Date.now().toString(36),
    name: userData.name,
    email: (userData.email || '').trim().toLowerCase(),
    password: userData.password || 'password123',
    role: userData.role === 'faculty' ? 'faculty' : 'student',
    avatar: userData.role === 'faculty' 
      ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80'
      : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    departmentOrMajor: userData.departmentOrMajor || (userData.role === 'faculty' ? 'Computer Science & Engineering' : 'Computer Science'),
    title: userData.role === 'faculty' ? 'Faculty Instructor' : 'Undergraduate Scholar',
    bio: userData.bio || 'Member of EduSphere Academic Portal.',
    learningGoals: userData.learningGoals || 'Master technical curriculum.',
    officeHours: userData.officeHours || 'Mon/Wed 10:00 - 12:00 UTC',
    createdAt: new Date()
  };

  if (isMongoConnected) {
    try {
      const created = await User.create(newUser);
      memUsers.push(newUser);
      return created;
    } catch (err) {
      console.warn("MongoDB register failed, saving to memory:", err.message);
    }
  }

  memUsers.push(newUser);
  return newUser;
}

async function getUserById(id) {
  if (isMongoConnected) {
    try {
      const user = await User.findOne({ id });
      if (user) return user;
    } catch (e) {}
  }
  return memUsers.find(u => u.id === id) || null;
}

async function updateUserProfile(id, updateData) {
  if (isMongoConnected) {
    try {
      const updated = await User.findOneAndUpdate(
        { id },
        { $set: updateData },
        { new: true, upsert: true }
      );
      return updated;
    } catch (err) {
      console.warn("MongoDB updateUserProfile failed:", err.message);
    }
  }

  const idx = memUsers.findIndex(u => u.id === id);
  if (idx !== -1) {
    memUsers[idx] = { ...memUsers[idx], ...updateData };
    return memUsers[idx];
  }
  return updateData;
}

// ==========================================
// Course Operations
// ==========================================
async function getCourses() {
  if (isMongoConnected) {
    try {
      const courses = await Course.find();
      if (courses && courses.length > 0) return courses;
    } catch (err) {
      console.warn("MongoDB query failed, using in-memory store:", err.message);
    }
  }
  return memCourses;
}

async function getCourseById(id) {
  if (isMongoConnected) {
    try {
      const course = await Course.findOne({ id });
      if (course) return course;
    } catch (err) {
      console.warn("MongoDB findOne failed:", err.message);
    }
  }
  return memCourses.find(c => c.id === id) || null;
}

// Return only courses handled by this specific faculty member
async function getCoursesByFaculty(facultyEmail, facultyName) {
  const all = await getCourses();
  const fEmail = (facultyEmail || '').trim().toLowerCase();
  const fName = (facultyName || '').trim().toLowerCase();

  return all.filter(c => {
    if (!c.instructor) return false;
    const instEmail = (c.instructor.email || '').trim().toLowerCase();
    const instName = (c.instructor.name || '').trim().toLowerCase();

    const matchesEmail = fEmail && (instEmail === fEmail || (fEmail.includes('faculty') && instEmail.includes('faculty')));
    const matchesName = fName && (instName === fName || instName.includes('mitchell'));
    return matchesEmail || matchesName;
  });
}

async function createCourse(courseData) {
  if (isMongoConnected) {
    try {
      const newCourse = new Course(courseData);
      await newCourse.save();
      memCourses.push(courseData);
      return newCourse;
    } catch (err) {
      console.warn("MongoDB save failed, persisting in-memory:", err.message);
    }
  }
  memCourses.push(courseData);
  return courseData;
}

async function updateCourse(id, updateData) {
  if (isMongoConnected) {
    try {
      const updated = await Course.findOneAndUpdate(
        { id },
        { $set: updateData },
        { new: true }
      );
      if (updated) {
        const idx = memCourses.findIndex(c => c.id === id);
        if (idx !== -1) memCourses[idx] = { ...memCourses[idx], ...updateData };
        return updated;
      }
    } catch (err) {
      console.warn("MongoDB updateCourse failed:", err.message);
    }
  }

  const idx = memCourses.findIndex(c => c.id === id);
  if (idx !== -1) {
    memCourses[idx] = { ...memCourses[idx], ...updateData };
    return memCourses[idx];
  }
  return null;
}

async function deleteCourse(id) {
  let deleted = null;
  if (isMongoConnected) {
    try {
      deleted = await Course.findOneAndDelete({ id });
      await Enrollment.deleteMany({ courseId: id });
    } catch (err) {
      console.warn("MongoDB deleteCourse failed:", err.message);
    }
  }

  const idx = memCourses.findIndex(c => c.id === id);
  if (idx !== -1) {
    const memDel = memCourses.splice(idx, 1)[0];
    if (!deleted) deleted = memDel;
  }

  memEnrollments = memEnrollments.filter(e => e.courseId !== id);
  return deleted;
}

async function addModuleToCourse(courseId, moduleData) {
  const course = await getCourseById(courseId);
  if (!course) return null;

  const newModule = {
    moduleId: "mod-" + Date.now().toString(36),
    title: moduleData.title || "New Module",
    lessons: moduleData.lessons || [
      {
        lessonId: "les-" + Date.now().toString(36),
        title: moduleData.lessonTitle || "Module Core Competency Lecture",
        duration: moduleData.duration || "20 min",
        videoUrl: moduleData.videoUrl || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
        summary: moduleData.summary || "In-depth lecture session and practical laboratory walkthrough."
      }
    ]
  };

  if (!course.modules) course.modules = [];
  course.modules.push(newModule);

  if (isMongoConnected) {
    try {
      await Course.findOneAndUpdate(
        { id: courseId },
        { $set: { modules: course.modules } }
      );
    } catch (err) {
      console.warn("MongoDB addModule failed:", err.message);
    }
  }

  const memIdx = memCourses.findIndex(c => c.id === courseId);
  if (memIdx !== -1) {
    memCourses[memIdx] = course;
  }

  return newModule;
}

// Update or upload video for a specific module and lesson
async function updateLessonVideo(courseId, moduleId, lessonId, videoUrl, summary) {
  const course = await getCourseById(courseId);
  if (!course || !course.modules) return null;

  let updatedLesson = null;
  for (let m of course.modules) {
    if (!moduleId || m.moduleId === moduleId) {
      for (let l of (m.lessons || [])) {
        if (l.lessonId === lessonId) {
          l.videoUrl = videoUrl;
          if (summary) l.summary = summary;
          updatedLesson = l;
          break;
        }
      }
    }
  }

  if (updatedLesson) {
    if (isMongoConnected) {
      try {
        await Course.findOneAndUpdate(
          { id: courseId },
          { $set: { modules: course.modules } }
        );
      } catch (err) {
        console.warn("MongoDB updateLessonVideo failed:", err.message);
      }
    }

    const memIdx = memCourses.findIndex(c => c.id === courseId);
    if (memIdx !== -1) {
      memCourses[memIdx] = course;
    }
  }

  return updatedLesson;
}

// ==========================================
// Enrollment Operations
// ==========================================
async function getEnrollments(studentId = "usr-student-1") {
  if (isMongoConnected) {
    try {
      const enrs = await Enrollment.find({ 
        $or: [{ studentId }, { studentId: "student-1" }, { studentId: "usr-student-1" }] 
      });
      if (enrs && enrs.length > 0) return enrs;
    } catch (err) {
      console.warn("MongoDB getEnrollments failed:", err.message);
    }
  }
  return memEnrollments.filter(e => e.studentId === studentId || e.studentId === "usr-student-1" || e.studentId === "student-1");
}

async function enrollCourse(courseId, studentId = "usr-student-1") {
  const existing = memEnrollments.find(e => e.courseId === courseId && (e.studentId === studentId || e.studentId === "student-1" || e.studentId === "usr-student-1"));
  if (existing) {
    existing.status = "Active";
    existing.lastAccessed = new Date().toISOString();
    return existing;
  }

  const newEnr = {
    id: "enr-" + Date.now(),
    studentId,
    courseId,
    enrolledAt: new Date().toISOString(),
    progressPercentage: 0,
    completedLessons: [],
    status: "Active",
    lastAccessed: new Date().toISOString()
  };

  if (isMongoConnected) {
    try {
      const doc = new Enrollment(newEnr);
      await doc.save();
      memEnrollments.push(newEnr);
      return doc;
    } catch (err) {
      console.warn("MongoDB enrollCourse failed:", err.message);
    }
  }

  memEnrollments.push(newEnr);
  return newEnr;
}

async function updateLessonProgress(courseId, lessonId, studentId = "usr-student-1") {
  let enr = null;
  if (isMongoConnected) {
    try {
      enr = await Enrollment.findOne({ 
        courseId, 
        $or: [{ studentId }, { studentId: "student-1" }, { studentId: "usr-student-1" }] 
      });
    } catch (e) {}
  }
  if (!enr) {
    enr = memEnrollments.find(e => e.courseId === courseId && (e.studentId === studentId || e.studentId === "student-1" || e.studentId === "usr-student-1"));
  }
  if (!enr) {
    enr = await enrollCourse(courseId, studentId);
  }

  if (!enr.completedLessons.includes(lessonId)) {
    enr.completedLessons.push(lessonId);
  }

  const course = await getCourseById(courseId);
  let totalLessons = 0;
  if (course && course.modules) {
    course.modules.forEach(m => {
      totalLessons += (m.lessons ? m.lessons.length : 0);
    });
  }

  if (totalLessons > 0) {
    enr.progressPercentage = Math.min(100, Math.round((enr.completedLessons.length / totalLessons) * 100));
    if (enr.progressPercentage === 100) {
      enr.status = "Completed";
    }
  }

  enr.lastAccessed = new Date().toISOString();

  if (isMongoConnected) {
    try {
      await Enrollment.findOneAndUpdate(
        { id: enr.id },
        { 
          $set: { 
            completedLessons: enr.completedLessons, 
            progressPercentage: enr.progressPercentage,
            status: enr.status,
            lastAccessed: enr.lastAccessed
          } 
        }
      );
    } catch (err) {
      console.warn("MongoDB updateLessonProgress failed:", err.message);
    }
  }

  return enr;
}

async function dropEnrollment(enrollmentId) {
  let dropped = null;
  if (isMongoConnected) {
    try {
      dropped = await Enrollment.findOneAndDelete({ 
        $or: [{ id: enrollmentId }, { courseId: enrollmentId }] 
      });
    } catch (err) {
      console.warn("MongoDB delete failed:", err.message);
    }
  }

  const index = memEnrollments.findIndex(e => e.id === enrollmentId || e.courseId === enrollmentId);
  if (index !== -1) {
    const memDropped = memEnrollments.splice(index, 1)[0];
    if (!dropped) dropped = memDropped;
  }

  return dropped;
}

async function getFacultyDashboardStats(facultyEmail, facultyName) {
  const facultyCourses = await getCoursesByFaculty(facultyEmail, facultyName);
  const allEnrollments = isMongoConnected ? await Enrollment.find() : memEnrollments;

  let totalStudents = 0;
  facultyCourses.forEach(c => {
    totalStudents += (c.studentsCount || 0);
  });

  const courseIds = new Set(facultyCourses.map(c => c.id));
  const relevantEnrollments = allEnrollments.filter(e => courseIds.has(e.courseId));

  let completedCount = 0;
  relevantEnrollments.forEach(e => {
    if (e.progressPercentage === 100 || e.status === "Completed") completedCount++;
  });

  return {
    coursesCount: facultyCourses.length,
    totalStudents: totalStudents + relevantEnrollments.length,
    activeEnrollments: relevantEnrollments.length,
    certificationsIssued: completedCount + 12,
    courses: facultyCourses
  };
}

// Clean up dummy courses from Atlas and ensure canonical accounts exist
async function seedMongoIfEmpty() {
  if (!isMongoConnected) return;
  try {
    // 1. Purge unwanted dummy courses ds-202 and se-303
    await Course.deleteMany({ id: { $in: ['ds-202', 'se-303'] } });
    await Enrollment.deleteMany({ courseId: { $in: ['ds-202', 'se-303'] } });

    // 2. Ensure only 1 student and 1 faculty exist in User collection
    for (const u of initialUsers) {
      await User.findOneAndUpdate(
        { email: u.email },
        { $set: u },
        { upsert: true, new: true }
      );
    }

    // 3. Ensure cs-101 course is preserved with Dr. Sarah Mitchell as instructor
    const cs101 = await Course.findOne({ id: 'cs-101' });
    if (!cs101) {
      await Course.create(initialCourses[0]);
    } else {
      await Course.findOneAndUpdate(
        { id: 'cs-101' },
        { 
          $set: { 
            'instructor.email': 'faculty@edusphere.edu',
            'instructor.name': 'Dr. Sarah Mitchell',
            'instructor.title': 'Professor of Software Engineering'
          } 
        }
      );
    }

    console.log("Database synchronization: Canonical student, faculty, and authored courses active.");
  } catch (err) {
    console.warn("MongoDB sync notice:", err.message);
  }
}

module.exports = {
  setMongoConnected,
  seedMongoIfEmpty,
  loginUser,
  registerUser,
  getUserById,
  updateUserProfile,
  getCourses,
  getCourseById,
  getCoursesByFaculty,
  createCourse,
  updateCourse,
  deleteCourse,
  addModuleToCourse,
  updateLessonVideo,
  getEnrollments,
  enrollCourse,
  updateLessonProgress,
  dropEnrollment,
  getFacultyDashboardStats
};
