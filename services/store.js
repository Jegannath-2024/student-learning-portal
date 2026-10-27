const Course = require('../models/Course');
const Student = require('../models/Student');
const Enrollment = require('../models/Enrollment');
const User = require('../models/User');

const initialUsers = [
  {
    id: "usr-student-1",
    name: "Alex Sterling",
    email: "alex.sterling@learningportal.edu",
    password: "password123",
    role: "student",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
    departmentOrMajor: "Computer Science & Engineering",
    title: "Undergraduate Scholar",
    bio: "Honors undergraduate student exploring high-throughput web systems, distributed architectures, and interactive digital education.",
    learningGoals: "Complete Full-Stack Architecture certification and deploy scalable cloud microservices.",
    officeHours: "N/A"
  },
  {
    id: "usr-faculty-1",
    name: "Dr. Sarah Mitchell",
    email: "sarah.mitchell@learningportal.edu",
    password: "password123",
    role: "faculty",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80",
    departmentOrMajor: "Computer Science & Engineering",
    title: "Senior Professor of Software Engineering",
    bio: "Leading research in distributed web architectures, enterprise cloud engineering, and interactive pedagogical systems.",
    learningGoals: "Expand advanced curriculum with modern REST APIs and XML schema modeling.",
    officeHours: "Mon/Wed 14:00 - 16:00 UTC"
  }
];

const initialCourses = [
  {
    id: "cs-101",
    title: "Full-Stack Web Architectures",
    description: "Comprehensive guide to building modern, cloud-native web applications with responsive design, asynchronous APIs, and real-time data persistence.",
    category: "Computer Science",
    level: "Intermediate",
    instructor: {
      name: "Dr. Sarah Mitchell",
      email: "sarah.mitchell@learningportal.edu",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80",
      title: "Senior Professor of Software Engineering"
    },
    thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80",
    rating: 4.9,
    studentsCount: 1420,
    credits: 4,
    duration: "10 Weeks",
    tags: ["Web Dev", "REST APIs", "Modern Cloud"],
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
      },
      {
        moduleId: "mod-3",
        title: "Module 3: Asynchronous RESTful Integration & Structured Payloads",
        lessons: [
          {
            lessonId: "les-301",
            title: "Asynchronous Data Fetching with AJAX & JSON",
            duration: "28 min",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
            summary: "Build decoupled frontend-backend communication using HTTP methods and structured JSON."
          },
          {
            lessonId: "les-302",
            title: "Curriculum Schema Modeling & XML Validation",
            duration: "18 min",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4",
            summary: "Validate enterprise data exchange formats using DTD declarations and XML Schema definitions."
          }
        ]
      }
    ]
  },
  {
    id: "ds-202",
    title: "Database Systems: Document & Relational Modeling",
    description: "Deep dive into relational database design, indexing, JDBC transaction handling, and document-oriented MongoDB persistence.",
    category: "Data Science",
    level: "Advanced",
    instructor: {
      name: "Prof. Arvind Ramanathan",
      email: "arvind.ramanathan@learningportal.edu",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
      title: "Senior Database Architect"
    },
    thumbnail: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=600&q=80",
    rating: 4.8,
    studentsCount: 980,
    credits: 3,
    duration: "8 Weeks",
    tags: ["Databases", "Document Stores", "SQL & NoSQL"],
    modules: [
      {
        moduleId: "mod-ds1",
        title: "Module 1: Relational Algebra & JDBC Architecture",
        lessons: [
          {
            lessonId: "les-ds101",
            title: "Connection Pools & Prepared Statements",
            duration: "20 min",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
            summary: "Optimize database throughput and prevent SQL injection with parameterized JDBC drivers."
          }
        ]
      },
      {
        moduleId: "mod-ds2",
        title: "Module 2: Document Hierarchies with MongoDB",
        lessons: [
          {
            lessonId: "les-ds201",
            title: "Flexible Schemas & BSON Document Storage",
            duration: "30 min",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
            summary: "Model nested documents, aggregate pipelines, and atomic updates for high-scale applications."
          }
        ]
      }
    ]
  },
  {
    id: "se-303",
    title: "Cloud Deployment & Serverless Microservices",
    description: "Master modern continuous deployment workflows across Vercel and Render with production monitoring, environment pipelines, and microservice decoupling.",
    category: "DevOps & Cloud",
    level: "Beginner",
    instructor: {
      name: "Dr. Sarah Mitchell",
      email: "sarah.mitchell@learningportal.edu",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80",
      title: "Senior Professor of Software Engineering"
    },
    thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    rating: 4.7,
    studentsCount: 1650,
    credits: 3,
    duration: "6 Weeks",
    tags: ["DevOps", "Cloud", "Serverless"],
    modules: [
      {
        moduleId: "mod-se1",
        title: "Module 1: Cloud Runtimes & Container Foundations",
        lessons: [
          {
            lessonId: "les-se101",
            title: "Deploying Web Services to Render and Edge CDNs to Vercel",
            duration: "24 min",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
            summary: "Configure environment variables, automated git deploys, and custom domain routings."
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
    progressPercentage: 66,
    completedLessons: ["les-101", "les-102", "les-201", "les-202"],
    status: "Active",
    lastAccessed: new Date().toISOString()
  },
  {
    id: "enr-2",
    studentId: "usr-student-1",
    courseId: "ds-202",
    enrolledAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    progressPercentage: 50,
    completedLessons: ["les-ds101"],
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
// Authentication & User Operations
// ==========================================
async function loginUser(email, password) {
  const normEmail = (email || '').trim().toLowerCase();
  if (isMongoConnected) {
    try {
      const user = await User.findOne({ email: normEmail });
      if (user && user.password === password) {
        return user;
      }
    } catch (err) {
      console.warn("MongoDB login failed, falling back to memory:", err.message);
    }
  }

  const found = memUsers.find(u => u.email.toLowerCase() === normEmail && u.password === password);
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
// Course Operations (Student & Faculty)
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
        title: "Introduction to Module",
        duration: "15 min",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        summary: "Overview of competencies and lab practicals."
      }
    ]
  };

  if (!course.modules) course.modules = [];
  course.modules.push(newModule);

  if (isMongoConnected) {
    try {
      await Course.findOneAndUpdate(
        { id: courseId },
        { $push: { modules: newModule } }
      );
    } catch (err) {
      console.warn("MongoDB addModule failed:", err.message);
    }
  }

  const memIdx = memCourses.findIndex(c => c.id === courseId);
  if (memIdx !== -1) {
    if (!memCourses[memIdx].modules) memCourses[memIdx].modules = [];
    memCourses[memIdx].modules.push(newModule);
  }

  return newModule;
}

// ==========================================
// Enrollment Operations
// ==========================================
async function getEnrollments(studentId = "usr-student-1") {
  if (isMongoConnected) {
    try {
      const enrs = await Enrollment.find({ 
        $or: [{ studentId }, { studentId: "student-1" }] 
      });
      if (enrs && enrs.length > 0) return enrs;
    } catch (err) {
      console.warn("MongoDB getEnrollments failed:", err.message);
    }
  }
  return memEnrollments.filter(e => e.studentId === studentId || e.studentId === "usr-student-1" || e.studentId === "student-1");
}

async function enrollCourse(courseId, studentId = "usr-student-1") {
  const existing = memEnrollments.find(e => e.courseId === courseId && (e.studentId === studentId || e.studentId === "student-1"));
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
        $or: [{ studentId }, { studentId: "student-1" }] 
      });
    } catch (e) {}
  }
  if (!enr) {
    enr = memEnrollments.find(e => e.courseId === courseId && (e.studentId === studentId || e.studentId === "student-1"));
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

async function getFacultyDashboardStats(facultyEmail) {
  const courses = await getCourses();
  const allEnrollments = isMongoConnected ? await Enrollment.find() : memEnrollments;

  const facultyCourses = courses.filter(c => 
    !facultyEmail || (c.instructor && (c.instructor.email === facultyEmail || c.instructor.name.includes("Sarah")))
  );

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
    certificationsIssued: completedCount + 18,
    courses: facultyCourses
  };
}

async function seedMongoIfEmpty() {
  if (!isMongoConnected) return;
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log("Seeding initial student and faculty user records...");
      await User.insertMany(initialUsers);
    }

    const count = await Course.countDocuments();
    if (count === 0) {
      console.log("Seeding initial course catalog into MongoDB...");
      await Course.insertMany(initialCourses);
      await Enrollment.insertMany(initialEnrollments);
      console.log("Database successfully seeded.");
    }
  } catch (err) {
    console.warn("MongoDB seed check skipped:", err.message);
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
  createCourse,
  updateCourse,
  deleteCourse,
  addModuleToCourse,
  getEnrollments,
  enrollCourse,
  updateLessonProgress,
  dropEnrollment,
  getFacultyDashboardStats
};
