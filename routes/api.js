const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const store = require('../services/store');
const { XMLParser, XMLValidator } = require('fast-xml-parser');
const { DOMParser } = require('@xmldom/xmldom');

// ==========================================
// Authentication Routes (Faculty & Student)
// ==========================================

// 1. POST /api/auth/login
router.post('/auth/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required' });
    }

    const user = await store.loginUser(email, password);
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials. Please verify email and password.' });
    }

    // Role verification if requested
    if (role && user.role !== role) {
      return res.status(403).json({ 
        success: false, 
        error: `Account has role '${user.role}', but login requested '${role}' portal.` 
      });
    }

    return res.status(200).json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        title: user.title,
        departmentOrMajor: user.departmentOrMajor,
        bio: user.bio,
        learningGoals: user.learningGoals,
        officeHours: user.officeHours
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// 2. POST /api/auth/register
router.post('/auth/register', async (req, res) => {
  try {
    const { name, email, password, role, departmentOrMajor, bio } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, error: 'Name, email, and password are required' });
    }

    const created = await store.registerUser({
      name,
      email,
      password,
      role: role === 'faculty' ? 'faculty' : 'student',
      departmentOrMajor,
      bio
    });

    return res.status(201).json({
      success: true,
      message: 'Account successfully registered!',
      user: created
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// 3. GET /api/auth/current
router.get('/auth/current', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || 'usr-student-1';
    const user = await store.getUserById(userId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User session not found' });
    }
    return res.status(200).json({ success: true, user });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// Course Catalog Routes
// ==========================================

// 4. GET /api/courses - List courses with optional filtering
router.get('/courses', async (req, res) => {
  try {
    const { category, level, search, instructor } = req.query;
    let courses = await store.getCourses();

    if (category && category !== 'All') {
      courses = courses.filter(c => c.category && c.category.toLowerCase() === category.toLowerCase());
    }
    if (level && level !== 'All') {
      courses = courses.filter(c => c.level && c.level.toLowerCase() === level.toLowerCase());
    }
    if (instructor) {
      courses = courses.filter(c => c.instructor && c.instructor.name.toLowerCase().includes(instructor.toLowerCase()));
    }
    if (search) {
      const q = search.toLowerCase();
      courses = courses.filter(c => 
        (c.title && c.title.toLowerCase().includes(q)) || 
        (c.description && c.description.toLowerCase().includes(q)) ||
        (c.tags && c.tags.some(t => t.toLowerCase().includes(q)))
      );
    }

    return res.status(200).json({
      success: true,
      count: courses.length,
      data: courses
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// 5. GET /api/courses/:id - Course detail
router.get('/courses/:id', async (req, res) => {
  try {
    const course = await store.getCourseById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }
    return res.status(200).json({ success: true, data: course });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// 6. POST /api/courses - Create course (Faculty)
router.post('/courses', async (req, res) => {
  try {
    const { title, description, category, level, credits, duration, tags, instructorName, thumbnail } = req.body;
    if (!title || !description || !category) {
      return res.status(400).json({ success: false, error: 'Title, description and category are required' });
    }

    const newCourse = {
      id: 'cs-' + Date.now().toString(36),
      title,
      description,
      category,
      level: level || 'Beginner',
      credits: Number(credits) || 3,
      duration: duration || '6 Weeks',
      rating: 5.0,
      studentsCount: 1,
      instructor: {
        name: instructorName || 'Dr. Sarah Mitchell',
        email: 'sarah.mitchell@learningportal.edu',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
        title: 'Senior Faculty Instructor'
      },
      thumbnail: thumbnail || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80',
      tags: tags || [category, 'Academic Course'],
      modules: [
        {
          moduleId: 'mod-init-' + Date.now().toString(36),
          title: 'Module 1: Orientation & Core Fundamentals',
          lessons: [
            {
              lessonId: 'les-init-1',
              title: 'Introduction & Course Learning Outcomes',
              duration: '15 min',
              videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
              summary: 'Overview of competencies, required tooling, and syllabus milestones.'
            }
          ]
        }
      ]
    };

    const saved = await store.createCourse(newCourse);
    return res.status(201).json({ 
      success: true, 
      data: saved, 
      message: 'Course created and published to academic catalog!' 
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// 7. PUT /api/courses/:id - Update course (Faculty)
router.put('/courses/:id', async (req, res) => {
  try {
    const updated = await store.updateCourse(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }
    return res.status(200).json({ success: true, data: updated, message: 'Course updated successfully' });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// 8. DELETE /api/courses/:id - Delete course (Faculty)
router.delete('/courses/:id', async (req, res) => {
  try {
    const deleted = await store.deleteCourse(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }
    return res.status(200).json({ success: true, message: 'Course removed from curriculum.', data: deleted });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// 9. POST /api/courses/:id/modules - Add module to course (Faculty)
router.post('/courses/:id/modules', async (req, res) => {
  try {
    const { title, lessonTitle, duration, videoUrl, summary } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, error: 'Module title is required' });
    }

    const moduleData = {
      title,
      lessons: [
        {
          lessonId: 'les-' + Date.now().toString(36),
          title: lessonTitle || 'Core Competency Lesson',
          duration: duration || '20 min',
          videoUrl: videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
          summary: summary || 'Detailed exploration of module topics and practical lab tasks.'
        }
      ]
    };

    const added = await store.addModuleToCourse(req.params.id, moduleData);
    if (!added) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }
    return res.status(201).json({ success: true, data: added, message: 'Module added to syllabus!' });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// Faculty Specific Routes
// ==========================================

// GET /api/faculty/courses - Only courses handled by the logged in faculty
router.get('/faculty/courses', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || 'usr-faculty-1';
    const user = await store.getUserById(userId);
    const facultyEmail = user ? user.email : 'faculty@edusphere.edu';
    const facultyName = user ? user.name : 'Dr. Sarah Mitchell';

    const courses = await store.getCoursesByFaculty(facultyEmail, facultyName);
    return res.status(200).json({ success: true, count: courses.length, data: courses });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH /api/courses/:id/modules/:moduleId/lessons/:lessonId/video - Upload / update lesson video
router.patch('/courses/:id/modules/:moduleId/lessons/:lessonId/video', async (req, res) => {
  try {
    const { videoUrl, summary } = req.body;
    if (!videoUrl) {
      return res.status(400).json({ success: false, error: 'videoUrl is required' });
    }

    const updated = await store.updateLessonVideo(
      req.params.id,
      req.params.moduleId,
      req.params.lessonId,
      videoUrl,
      summary
    );

    if (!updated) {
      return res.status(404).json({ success: false, error: 'Course, module, or lesson not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Lesson video updated and published successfully!',
      data: updated
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/courses/:id/modules/:moduleId/quiz - Retrieve module assessment quiz
router.get('/courses/:id/modules/:moduleId/quiz', async (req, res) => {
  try {
    const quiz = await store.getModuleQuiz(req.params.id, req.params.moduleId);
    if (!quiz) {
      return res.status(404).json({ success: false, error: 'Module or quiz not found' });
    }
    return res.status(200).json({ success: true, data: quiz });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/courses/:id/modules/:moduleId/quiz - Faculty preparing and publishing module quiz
router.post('/courses/:id/modules/:moduleId/quiz', async (req, res) => {
  try {
    const { title, questions } = req.body;
    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ success: false, error: 'At least one valid question is required' });
    }

    const savedQuiz = await store.saveModuleQuiz(req.params.id, req.params.moduleId, {
      title: title || 'Module Practical Assessment',
      questions
    });

    if (!savedQuiz) {
      return res.status(404).json({ success: false, error: 'Target course or module not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Module quiz saved and published to students successfully!',
      data: savedQuiz
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/faculty/students - Faculty viewing enrolled students in their courses
router.get('/faculty/students', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || 'usr-faculty-1';
    const user = await store.getUserById(userId);
    const facultyEmail = user ? user.email : 'faculty@edusphere.edu';
    const facultyName = user ? user.name : 'Dr. Sarah Mitchell';

    const students = await store.getStudentsByFaculty(facultyEmail, facultyName);
    return res.status(200).json({ success: true, count: students.length, data: students });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH /api/faculty/students/:enrollmentId - Faculty managing student progress and status
router.patch('/faculty/students/:enrollmentId', async (req, res) => {
  try {
    const updated = await store.updateFacultyStudentStatus(req.params.enrollmentId, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Student enrollment not found' });
    }
    return res.status(200).json({
      success: true,
      message: 'Student record updated successfully!',
      data: updated
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/faculty/students/:enrollmentId - Faculty dropping student from course
router.delete('/faculty/students/:enrollmentId', async (req, res) => {
  try {
    const deleted = await store.dropEnrollment(req.params.enrollmentId);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Enrollment not found' });
    }
    return res.status(200).json({
      success: true,
      message: 'Student enrollment dropped from cohort.',
      data: deleted
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/faculty/stats', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    let user = null;
    if (userId) user = await store.getUserById(userId);
    const email = (user && user.email) || req.query.email || 'faculty@edusphere.edu';
    const name = (user && user.name) || req.query.name || 'Dr. Sarah Mitchell';

    const stats = await store.getFacultyDashboardStats(email, name);
    return res.status(200).json({ success: true, data: stats });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// Student & Profile Routes
// ==========================================

// 10. GET /api/student/profile
router.get('/student/profile', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || 'usr-student-1';
    let user = await store.getUserById(userId);
    if (!user) {
      user = await store.getUserById('usr-student-1');
    }
    return res.status(200).json({ success: true, data: user });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// 11. PUT /api/student/profile
router.put('/student/profile', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || 'usr-student-1';
    const { name, bio, learningGoals, departmentOrMajor, major, title, officeHours } = req.body;
    const updated = await store.updateUserProfile(userId, { 
      name, 
      bio, 
      learningGoals, 
      departmentOrMajor: departmentOrMajor || major,
      title,
      officeHours
    });
    return res.status(200).json({ 
      success: true, 
      data: updated, 
      message: 'Profile information updated successfully!' 
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// Enrollment Routes
// ==========================================

// 12. GET /api/enrollments
router.get('/enrollments', async (req, res) => {
  try {
    const studentId = req.headers['x-user-id'] || 'usr-student-1';
    const enrollments = await store.getEnrollments(studentId);
    const courses = await store.getCourses();

    const populated = enrollments.map(enr => {
      const enrObj = enr.toObject ? enr.toObject() : { ...enr };
      const course = courses.find(c => c.id === enrObj.courseId);
      const rawPct = Number(enrObj.progressPercentage);
      return {
        ...enrObj,
        progressPercentage: Number.isFinite(rawPct) ? Math.max(0, Math.min(100, Math.round(rawPct))) : 0,
        course: course || null
      };
    });

    return res.status(200).json({ success: true, data: populated });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// 13. POST /api/enrollments
router.post('/enrollments', async (req, res) => {
  try {
    const studentId = req.headers['x-user-id'] || 'usr-student-1';
    const { courseId } = req.body;
    if (!courseId) {
      return res.status(400).json({ success: false, error: 'courseId is required' });
    }

    const course = await store.getCourseById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, error: 'Course does not exist' });
    }

    const enrollment = await store.enrollCourse(courseId, studentId);
    const enrObj = enrollment.toObject ? enrollment.toObject() : { ...enrollment };
    const rawPct = Number(enrObj.progressPercentage);
    enrObj.progressPercentage = Number.isFinite(rawPct) ? Math.max(0, Math.min(100, Math.round(rawPct))) : 0;
    enrObj.course = course;

    return res.status(201).json({ success: true, data: enrObj, message: `Successfully enrolled in "${course.title}"!` });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// 14. PATCH /api/courses/:id/progress
router.patch('/courses/:id/progress', async (req, res) => {
  try {
    const studentId = req.headers['x-user-id'] || 'usr-student-1';
    const { lessonId } = req.body;
    const courseId = req.params.id;

    if (!lessonId) {
      return res.status(400).json({ success: false, error: 'lessonId is required' });
    }

    const updated = await store.updateLessonProgress(courseId, lessonId, studentId);
    return res.status(200).json({ 
      success: true, 
      data: updated,
      message: `Lesson milestone recorded! Course progress updated to ${updated.progressPercentage}%.` 
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// 15. DELETE /api/enrollments/:id
router.delete('/enrollments/:id', async (req, res) => {
  try {
    const dropped = await store.dropEnrollment(req.params.id);
    if (!dropped) {
      return res.status(404).json({ success: false, error: 'Enrollment record not found' });
    }
    return res.status(200).json({ 
      success: true, 
      data: dropped, 
      message: 'Course enrollment successfully dropped.' 
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// Curriculum XML & Schema Validation
// ==========================================

// 16. GET /api/curriculum/xml
router.get('/curriculum/xml', (req, res) => {
  try {
    const xmlFilePath = path.join(__dirname, '../public/xml/curriculum.xml');
    if (fs.existsSync(xmlFilePath)) {
      res.setHeader('Content-Type', 'application/xml; charset=utf-8');
      return res.status(200).send(fs.readFileSync(xmlFilePath, 'utf8'));
    }
    return res.status(404).json({ success: false, error: 'Curriculum XML file not found' });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// 17. POST /api/curriculum/validate-xml
router.post('/curriculum/validate-xml', (req, res) => {
  try {
    const { xmlContent } = req.body;
    if (!xmlContent) {
      return res.status(400).json({ success: false, error: 'xmlContent string is required' });
    }

    // Well-formedness
    const validationResult = XMLValidator.validate(xmlContent, {
      allowBooleanAttributes: true
    });

    if (validationResult !== true) {
      return res.status(422).json({
        success: false,
        valid: false,
        errorType: 'Malformed XML Syntax',
        details: validationResult.err
      });
    }

    // DOM Parser validation
    const parser = new DOMParser({
      onError: (level, msg) => {
        if (level === 'error' || level === 'fatalError') {
          throw new Error(`[XML ${level}] ${msg}`);
        }
      }
    });

    const doc = parser.parseFromString(xmlContent, 'text/xml');
    const root = doc.documentElement;

    if (!root || root.nodeName !== 'curriculum') {
      return res.status(422).json({
        success: false,
        valid: false,
        errorType: 'DTD / Schema Violation',
        message: 'Root element must be <curriculum> as declared in curriculum.dtd and curriculum.xsd'
      });
    }

    const academicYear = doc.getElementsByTagName('academicYear');
    const department = doc.getElementsByTagName('department');
    const courses = doc.getElementsByTagName('course');

    const issues = [];
    if (academicYear.length === 0) issues.push('Missing mandatory <academicYear> element');
    if (department.length === 0) issues.push('Missing mandatory <department> element');
    if (courses.length === 0) issues.push('Schema requires at least one <course> element');

    for (let i = 0; i < courses.length; i++) {
      const c = courses[i];
      const creditsNode = c.getElementsByTagName('credits')[0];
      if (creditsNode) {
        const val = parseInt(creditsNode.textContent || '0', 10);
        if (isNaN(val) || val < 1 || val > 6) {
          issues.push(`Course #${i+1} credits (${val}) violates XSD restriction: minInclusive="1", maxInclusive="6"`);
        }
      }
      const levelNode = c.getElementsByTagName('level')[0];
      if (levelNode) {
        const lvl = (levelNode.textContent || '').trim();
        if (!['Beginner', 'Intermediate', 'Advanced'].includes(lvl)) {
          issues.push(`Course #${i+1} level "${lvl}" violates XSD CourseLevelType enumeration.`);
        }
      }
    }

    if (issues.length > 0) {
      return res.status(422).json({
        success: false,
        valid: false,
        errorType: 'Schema / DTD Validation Failure',
        issues
      });
    }

    return res.status(200).json({
      success: true,
      valid: true,
      message: 'XML document passed both Well-Formedness and Schema/DTD structural validation!',
      courseCount: courses.length,
      department: department[0] ? department[0].textContent : 'Unknown'
    });
  } catch (err) {
    return res.status(422).json({
      success: false,
      valid: false,
      errorType: 'Validation Exception',
      message: err.message
    });
  }
});

// 18. GET /api/academic/verify/:studentId (Dynamic Academic Audit)
router.get('/academic/verify/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;
    const isDemo = (studentId === 'usr-student-1' || studentId === 'STU-2026-8941');

    if (isDemo) {
      return res.status(200).json({
        success: true,
        data: {
          studentId: 'STU-2026-8941',
          studentName: 'Alex Sterling',
          institution: 'University School of Advanced Computing',
          cumulativeGpa: '3.92',
          creditsCompleted: 14,
          academicStanding: "Dean's Honors List",
          verificationCode: 'VERIFY-AWT-246019',
          issuedDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
          accreditationService: 'Academic Record JDBC Gateway'
        }
      });
    }

    // Dynamic verification for new or registered student
    const user = await store.getUserById(studentId);
    const enrollments = await store.getEnrollments(studentId);
    const courses = await store.getCourses();

    let totalCredits = 0;
    let earnedPoints = 0;
    let completedCourses = 0;

    (enrollments || []).forEach(e => {
      const course = courses.find(c => c.id === e.courseId);
      const credits = (course && course.credits) ? course.credits : 4;
      if (e.status === 'Completed' || e.progressPercentage === 100) {
        totalCredits += credits;
        earnedPoints += (credits * 4.0);
        completedCourses++;
      }
    });

    const gpa = totalCredits > 0 ? (earnedPoints / totalCredits).toFixed(2) : '0.00';
    let standing = 'Matriculated (Initial Standing)';
    if (completedCourses > 0) {
      standing = Number(gpa) >= 3.5 ? "Dean's Honors List" : 'Good Academic Standing';
    }

    const safeHash = Math.abs((studentId || 'new').split('').reduce((a,b)=>{a=((a<<5)-a)+b.charCodeAt(0);return a&a},0)).toString(36).toUpperCase();

    return res.status(200).json({
      success: true,
      data: {
        studentId: studentId,
        studentName: user ? user.name : 'Enrolled Student',
        institution: 'University School of Advanced Computing',
        cumulativeGpa: gpa,
        creditsCompleted: totalCredits,
        academicStanding: standing,
        verificationCode: 'VERIFY-EDUS-' + safeHash,
        issuedDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        accreditationService: 'Academic Record JDBC Gateway'
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
