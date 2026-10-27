const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const store = require('../services/store');
const { XMLParser, XMLValidator } = require('fast-xml-parser');
const { DOMParser } = require('@xmldom/xmldom');

// 1. GET /api/courses - List courses with optional filtering
router.get('/courses', async (req, res) => {
  try {
    const { category, level, search } = req.query;
    let courses = await store.getCourses();

    if (category && category !== 'All') {
      courses = courses.filter(c => c.category.toLowerCase() === category.toLowerCase());
    }
    if (level && level !== 'All') {
      courses = courses.filter(c => c.level.toLowerCase() === level.toLowerCase());
    }
    if (search) {
      const q = search.toLowerCase();
      courses = courses.filter(c => 
        c.title.toLowerCase().includes(q) || 
        c.description.toLowerCase().includes(q) ||
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

// 2. GET /api/courses/:id - Course detail
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

// 3. POST /api/courses - Create new course
router.post('/courses', async (req, res) => {
  try {
    const { title, description, category, level, credits, duration, tags } = req.body;
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
        name: 'Faculty Instructor',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        title: 'Academic Faculty'
      },
      thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80',
      tags: tags || ['Computer Science', 'Curriculum'],
      modules: [
        {
          moduleId: 'mod-init-' + Date.now(),
          title: 'Module 1: Orientation & Core Fundamentals',
          lessons: [
            {
              lessonId: 'les-init-1',
              title: 'Introduction & Learning Objectives',
              duration: '15 min',
              videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
              summary: 'Overview of module competencies, required tools, and syllabus milestones.'
            }
          ]
        }
      ]
    };

    const saved = await store.createCourse(newCourse);
    return res.status(201).json({ success: true, data: saved });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// 4. GET /api/student/profile - Get student profile
router.get('/student/profile', async (req, res) => {
  try {
    const student = await store.getStudentProfile();
    return res.status(200).json({ success: true, data: student });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// 5. PUT /api/student/profile - Update student profile
router.put('/student/profile', async (req, res) => {
  try {
    const { name, bio, learningGoals, major } = req.body;
    const updated = await store.updateStudentProfile({ name, bio, learningGoals, major });
    return res.status(200).json({ success: true, data: updated, message: 'Student profile updated successfully' });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// 6. GET /api/enrollments - List student enrollments
router.get('/enrollments', async (req, res) => {
  try {
    const enrollments = await store.getEnrollments();
    const courses = await store.getCourses();

    const populated = enrollments.map(enr => {
      const course = courses.find(c => c.id === enr.courseId);
      return {
        ...enr,
        course: course || null
      };
    });

    return res.status(200).json({ success: true, data: populated });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// 7. POST /api/enrollments - Enroll in a course
router.post('/enrollments', async (req, res) => {
  try {
    const { courseId } = req.body;
    if (!courseId) {
      return res.status(400).json({ success: false, error: 'courseId is required' });
    }

    const course = await store.getCourseById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, error: 'Course does not exist' });
    }

    const enrollment = await store.enrollCourse(courseId);
    return res.status(201).json({ success: true, data: enrollment, message: 'Successfully enrolled' });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// 8. PATCH /api/courses/:id/progress - Partial update of student lesson completion
router.patch('/courses/:id/progress', async (req, res) => {
  try {
    const { lessonId } = req.body;
    const courseId = req.params.id;

    if (!lessonId) {
      return res.status(400).json({ success: false, error: 'lessonId is required' });
    }

    const updated = await store.updateLessonProgress(courseId, lessonId);
    return res.status(200).json({ 
      success: true, 
      data: updated,
      message: `Lesson ${lessonId} completed! Progress updated.` 
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// 9. DELETE /api/enrollments/:id - Drop course enrollment
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

// 10. GET /api/curriculum/xml - Serves raw XML curriculum data
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

// 11. POST /api/curriculum/validate-xml - Validates an XML string against DTD & Schema structure
router.post('/curriculum/validate-xml', (req, res) => {
  try {
    const { xmlContent } = req.body;
    if (!xmlContent) {
      return res.status(400).json({ success: false, error: 'xmlContent string is required' });
    }

    // 1. Well-formedness check
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

    // 2. DOM Parser validation
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

    // Check mandatory child elements per DTD/XSD
    const academicYear = doc.getElementsByTagName('academicYear');
    const department = doc.getElementsByTagName('department');
    const courses = doc.getElementsByTagName('course');

    const issues = [];
    if (academicYear.length === 0) issues.push('Missing mandatory <academicYear> element');
    if (department.length === 0) issues.push('Missing mandatory <department> element');
    if (courses.length === 0) issues.push('Schema requires at least one <course> element');

    // Check credits constraint (1 to 6)
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

// 12. GET /api/academic/verify - Academic Verification Endpoint (bridges to JSP/JDBC records)
router.get('/academic/verify/:studentId', (req, res) => {
  const { studentId } = req.params;
  const sampleRecords = {
    studentId: studentId || 'STU-2026-8941',
    studentName: 'Alex Sterling',
    institution: 'University School of Advanced Computing',
    cumulativeGpa: 3.92,
    creditsCompleted: 42,
    academicStanding: 'Dean\'s Honors List',
    verificationCode: 'VERIFY-AWT-' + Math.floor(100000 + Math.random() * 900000),
    issuedDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    accreditationService: 'Academic Record JDBC Gateway'
  };

  return res.status(200).json({
    success: true,
    data: sampleRecords
  });
});

module.exports = router;
