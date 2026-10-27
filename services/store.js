const Course = require('../models/Course');
const Student = require('../models/Student');
const Enrollment = require('../models/Enrollment');

const initialCourses = [
  {
    id: "cs-101",
    title: "Full-Stack Web Architectures",
    description: "Comprehensive guide to building modern, cloud-native web applications with responsive design, asynchronous APIs, and real-time data persistence.",
    category: "Computer Science",
    level: "Intermediate",
    instructor: {
      name: "Dr. Sarah Mitchell",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80",
      title: "Distinguished Professor of Software Engineering"
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
      name: "Elena Rostova",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80",
      title: "Principal Cloud Engineer"
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

const initialStudent = {
  id: "student-1",
  name: "Alex Sterling",
  email: "alex.sterling@learningportal.edu",
  avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
  bio: "Honors undergraduate student exploring high-throughput web systems, distributed architectures, and interactive digital education.",
  learningGoals: "Complete Full-Stack Architecture certification and deploy scalable cloud microservices.",
  major: "Computer Science & Engineering",
  studentIdNumber: "STU-2026-8941"
};

const initialEnrollments = [
  {
    id: "enr-1",
    studentId: "student-1",
    courseId: "cs-101",
    enrolledAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    progressPercentage: 66,
    completedLessons: ["les-101", "les-102", "les-201", "les-202"],
    status: "Active",
    lastAccessed: new Date().toISOString()
  },
  {
    id: "enr-2",
    studentId: "student-1",
    courseId: "ds-202",
    enrolledAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    progressPercentage: 50,
    completedLessons: ["les-ds101"],
    status: "Active",
    lastAccessed: new Date().toISOString()
  }
];

// In-Memory store fallback
let memCourses = JSON.parse(JSON.stringify(initialCourses));
let memStudent = JSON.parse(JSON.stringify(initialStudent));
let memEnrollments = JSON.parse(JSON.stringify(initialEnrollments));

let isMongoConnected = false;

function setMongoConnected(status) {
  isMongoConnected = status;
}

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
      return newCourse;
    } catch (err) {
      console.warn("MongoDB save failed, persisting in-memory:", err.message);
    }
  }
  memCourses.push(courseData);
  return courseData;
}

async function getStudentProfile() {
  if (isMongoConnected) {
    try {
      const student = await Student.findOne({ id: "student-1" });
      if (student) return student;
    } catch (err) {
      console.warn("MongoDB getStudent failed:", err.message);
    }
  }
  return memStudent;
}

async function updateStudentProfile(updateData) {
  if (isMongoConnected) {
    try {
      const updated = await Student.findOneAndUpdate(
        { id: "student-1" },
        { $set: updateData },
        { new: true, upsert: true }
      );
      return updated;
    } catch (err) {
      console.warn("MongoDB updateStudent failed:", err.message);
    }
  }
  memStudent = { ...memStudent, ...updateData };
  return memStudent;
}

async function getEnrollments() {
  if (isMongoConnected) {
    try {
      const enrs = await Enrollment.find({ studentId: "student-1" });
      if (enrs && enrs.length > 0) return enrs;
    } catch (err) {
      console.warn("MongoDB getEnrollments failed:", err.message);
    }
  }
  return memEnrollments;
}

async function enrollCourse(courseId) {
  const existing = memEnrollments.find(e => e.courseId === courseId && e.studentId === "student-1");
  if (existing) {
    existing.status = "Active";
    existing.lastAccessed = new Date().toISOString();
    return existing;
  }

  const newEnr = {
    id: "enr-" + Date.now(),
    studentId: "student-1",
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

async function updateLessonProgress(courseId, lessonId) {
  let enr = null;
  if (isMongoConnected) {
    try {
      enr = await Enrollment.findOne({ courseId, studentId: "student-1" });
    } catch (e) {}
  }
  if (!enr) {
    enr = memEnrollments.find(e => e.courseId === courseId && e.studentId === "student-1");
  }
  if (!enr) {
    enr = await enrollCourse(courseId);
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

async function seedMongoIfEmpty() {
  if (!isMongoConnected) return;
  try {
    const count = await Course.countDocuments();
    if (count === 0) {
      console.log("Seeding initial course catalog into MongoDB...");
      await Course.insertMany(initialCourses);
      await Student.create(initialStudent);
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
  getCourses,
  getCourseById,
  createCourse,
  getStudentProfile,
  updateStudentProfile,
  getEnrollments,
  enrollCourse,
  updateLessonProgress,
  dropEnrollment
};
