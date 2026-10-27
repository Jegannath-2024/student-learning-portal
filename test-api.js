const fs = require('fs');

async function runTests() {
  const BASE = process.env.TEST_URL || process.argv[2] || 'http://localhost:3000';
  console.log(`Running comprehensive test suite against: ${BASE}`);
  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`[PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`[FAIL] ${name}: ${err.message}`);
      failed++;
    }
  }

  // 1. GET /health
  await test('GET /health (Uptime Monitoring)', async () => {
    const res = await fetch(`${BASE}/health`);
    const data = await res.json();
    if (data.status !== 'online') throw new Error('Health status is not online');
  });

  // 2. POST /api/auth/login (Student Login)
  let studentTokenId = null;
  await test('POST /api/auth/login (Student Authentication - student@edusphere.edu)', async () => {
    const res = await fetch(`${BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'student@edusphere.edu',
        password: 'password123',
        role: 'student'
      })
    });
    const data = await res.json();
    if (!data.success || data.user.role !== 'student') {
      throw new Error(data.error || 'Student login failed');
    }
    studentTokenId = data.user.id;
  });

  // 3. POST /api/auth/login (Faculty Login)
  let facultyTokenId = null;
  await test('POST /api/auth/login (Faculty Authentication - faculty@edusphere.edu)', async () => {
    const res = await fetch(`${BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'faculty@edusphere.edu',
        password: 'password123',
        role: 'faculty'
      })
    });
    const data = await res.json();
    if (!data.success || data.user.role !== 'faculty') {
      throw new Error(data.error || 'Faculty login failed');
    }
    facultyTokenId = data.user.id;
  });

  // 4. GET /api/faculty/stats
  await test('GET /api/faculty/stats (Faculty Analytics & Handled Courses Metrics)', async () => {
    const res = await fetch(`${BASE}/api/faculty/stats?email=faculty@edusphere.edu`, {
      headers: { 'x-user-id': facultyTokenId || 'usr-faculty-1' }
    });
    const data = await res.json();
    if (!data.success || typeof data.data.coursesCount !== 'number') {
      throw new Error('Faculty stats retrieval failed');
    }
  });

  // 5. GET /api/faculty/courses (Faculty Handled Courses Only)
  await test('GET /api/faculty/courses (Handled Courses Isolation)', async () => {
    const res = await fetch(`${BASE}/api/faculty/courses`, {
      headers: { 'x-user-id': facultyTokenId || 'usr-faculty-1' }
    });
    const data = await res.json();
    if (!data.success || !Array.isArray(data.data)) {
      throw new Error('Faculty courses fetch failed');
    }
  });

  // 6. GET /api/courses
  await test('GET /api/courses (HTTP GET Course Catalog)', async () => {
    const res = await fetch(`${BASE}/api/courses`);
    const data = await res.json();
    if (!data.success || data.count < 1) throw new Error('Courses fetch failed');
  });

  // 7. GET /api/courses/:id
  await test('GET /api/courses/cs-101 (HTTP GET Single Course Details)', async () => {
    const res = await fetch(`${BASE}/api/courses/cs-101`);
    const data = await res.json();
    if (!data.success || data.data.id !== 'cs-101') throw new Error('Course detail failed');
  });

  // 8. POST /api/courses (Faculty Course Creation)
  let createdCourseId = null;
  await test('POST /api/courses (Faculty Authoring Course)', async () => {
    const res = await fetch(`${BASE}/api/courses`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'x-user-id': facultyTokenId || 'usr-faculty-1'
      },
      body: JSON.stringify({
        title: 'Distributed Systems & Cloud Microservices',
        description: 'Advanced patterns for resilient cloud services.',
        category: 'Computer Science',
        level: 'Advanced',
        credits: 4,
        duration: '8 Weeks',
        instructorName: 'Dr. Sarah Mitchell'
      })
    });
    const data = await res.json();
    if (!data.success || !data.data.id) throw new Error('Course creation failed');
    createdCourseId = data.data.id;
  });

  // 9. POST /api/courses/:id/modules (Faculty Adding Module)
  let createdModuleId = null;
  let createdLessonId = null;
  await test('POST /api/courses/:id/modules (Faculty Adding Module & Lesson)', async () => {
    if (!createdCourseId) throw new Error('No created course ID');
    const res = await fetch(`${BASE}/api/courses/${createdCourseId}/modules`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'x-user-id': facultyTokenId || 'usr-faculty-1'
      },
      body: JSON.stringify({
        title: 'Module 2: Container Orchestration & Docker',
        lessonTitle: 'Microservice Container Lifecycle',
        duration: '22 min',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        summary: 'Hands-on exploration of container isolation.'
      })
    });
    const data = await res.json();
    if (!data.success || !data.data.moduleId) throw new Error('Module addition failed');
    createdModuleId = data.data.moduleId;
    createdLessonId = data.data.lessons && data.data.lessons[0] ? data.data.lessons[0].lessonId : null;
  });

  // 10. PATCH /api/courses/:id/modules/:moduleId/lessons/:lessonId/video (Upload / Update Video with Live Preview)
  await test('PATCH /api/courses/:id/modules/:moduleId/lessons/:lessonId/video (Video Upload & Link)', async () => {
    if (!createdCourseId || !createdModuleId || !createdLessonId) {
      throw new Error('Course/Module/Lesson IDs missing for video update test');
    }
    const res = await fetch(`${BASE}/api/courses/${createdCourseId}/modules/${createdModuleId}/lessons/${createdLessonId}/video`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': facultyTokenId || 'usr-faculty-1'
      },
      body: JSON.stringify({
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        summary: 'Verified lecture video on container lifecycle with live interactive preview.'
      })
    });
    const data = await res.json();
    if (!data.success) throw new Error('Lesson video PATCH update failed');
  });

  // 11. POST & GET Module Quiz (Faculty Quiz Builder & Student Diagnostic)
  await test('POST & GET Module Quiz (Faculty Preparing Quiz for Module)', async () => {
    if (!createdCourseId || !createdModuleId) throw new Error('Missing course/module ID for quiz preparation');
    
    // Save quiz
    const saveRes = await fetch(`${BASE}/api/courses/${createdCourseId}/modules/${createdModuleId}/quiz`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': facultyTokenId || 'usr-faculty-1'
      },
      body: JSON.stringify({
        title: 'Microservices & Containerization Mastery Assessment',
        questions: [
          {
            questionId: 'q-test-1',
            questionText: 'Which Linux kernel primitive provides process namespace isolation?',
            options: ['cgroups', 'namespaces', 'systemd', 'iptables'],
            correctIndex: 1,
            explanation: 'Namespaces isolate system resources such as mount points, PIDs, and networks.'
          }
        ]
      })
    });
    const saveData = await saveRes.json();
    if (!saveData.success) throw new Error('Module quiz save failed: ' + saveData.error);

    // Retrieve quiz
    const getRes = await fetch(`${BASE}/api/courses/${createdCourseId}/modules/${createdModuleId}/quiz`);
    const getData = await getRes.json();
    if (!getData.success || !getData.data.questions || getData.data.questions.length === 0) {
      throw new Error('Module quiz retrieval failed');
    }
  });

  // 12. GET /api/student/profile
  await test('GET /api/student/profile (HTTP GET Student Profile)', async () => {
    const res = await fetch(`${BASE}/api/student/profile`, {
      headers: { 'x-user-id': studentTokenId || 'usr-student-1' }
    });
    const data = await res.json();
    if (!data.success || !data.data.name) throw new Error('Student profile fetch failed');
  });

  // 13. PUT /api/student/profile
  const updatedStudentName = 'Alex Sterling';
  await test('PUT /api/student/profile (HTTP PUT Update Profile Name & Bio)', async () => {
    const res = await fetch(`${BASE}/api/student/profile`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'x-user-id': studentTokenId || 'usr-student-1'
      },
      body: JSON.stringify({
        name: updatedStudentName,
        bio: 'Updated bio via RESTful PUT API test',
        major: 'Computer Science & Engineering',
        learningGoals: 'Master Cloud Native Architecture'
      })
    });
    const data = await res.json();
    if (!data.success) throw new Error('Student profile update failed');
  });

  // 14. POST /api/enrollments
  let newEnrollmentId = null;
  await test('POST /api/enrollments (HTTP POST Course Enrollment)', async () => {
    if (!createdCourseId) throw new Error('No target course for enrollment');
    const res = await fetch(`${BASE}/api/enrollments`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'x-user-id': studentTokenId || 'usr-student-1'
      },
      body: JSON.stringify({ courseId: createdCourseId })
    });
    const data = await res.json();
    if (!data.success || !data.data.id) throw new Error('Enrollment failed');
    newEnrollmentId = data.data.id;
  });

  // 15. GET & PATCH /api/faculty/students (Faculty Student Roster Management)
  await test('GET & PATCH /api/faculty/students (Faculty Cohort Management)', async () => {
    if (!newEnrollmentId) throw new Error('No enrollment ID for student roster check');
    const rosterRes = await fetch(`${BASE}/api/faculty/students`, {
      headers: { 'x-user-id': facultyTokenId || 'usr-faculty-1' }
    });
    const rosterData = await rosterRes.json();
    if (!rosterData.success || !Array.isArray(rosterData.data)) {
      throw new Error('Faculty students roster retrieval failed');
    }

    // Faculty updates student status / progress
    const patchRes = await fetch(`${BASE}/api/faculty/students/${newEnrollmentId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': facultyTokenId || 'usr-faculty-1'
      },
      body: JSON.stringify({
        progressPercentage: 100,
        status: 'Completed'
      })
    });
    const patchData = await patchRes.json();
    if (!patchData.success) throw new Error('Faculty updating student status failed');
  });

  // 14. PATCH /api/courses/cs-101/progress
  await test('PATCH /api/courses/cs-101/progress (HTTP PATCH Lesson Progress)', async () => {
    const res = await fetch(`${BASE}/api/courses/cs-101/progress`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        'x-user-id': studentTokenId || 'usr-student-1'
      },
      body: JSON.stringify({ lessonId: 'les-101' })
    });
    const data = await res.json();
    if (!data.success) throw new Error('Lesson progress PATCH failed');
  });

  // 15. DELETE /api/enrollments/:id
  await test('DELETE /api/enrollments/:id (HTTP DELETE Drop Course)', async () => {
    if (!newEnrollmentId) throw new Error('No enrollment ID to delete');
    const res = await fetch(`${BASE}/api/enrollments/${newEnrollmentId}`, {
      method: 'DELETE',
      headers: { 'x-user-id': studentTokenId || 'usr-student-1' }
    });
    const data = await res.json();
    if (!data.success) throw new Error('Enrollment DELETE failed');
  });

  // 16. DELETE /api/courses/:id (Faculty Deleting Course)
  await test('DELETE /api/courses/:id (Faculty Retiring Course)', async () => {
    if (!createdCourseId) throw new Error('No created course ID');
    const res = await fetch(`${BASE}/api/courses/${createdCourseId}`, {
      method: 'DELETE',
      headers: {
        'x-user-id': facultyTokenId || 'usr-faculty-1'
      }
    });
    const data = await res.json();
    if (!data.success) throw new Error('Course deletion failed');
  });

  // 15. GET /api/curriculum/xml
  await test('GET /api/curriculum/xml (XML Curriculum Delivery)', async () => {
    const res = await fetch(`${BASE}/api/curriculum/xml`);
    const xml = await res.text();
    if (!xml.includes('<curriculum') || !xml.includes('curriculum.dtd')) {
      throw new Error('Curriculum XML retrieval failed');
    }
  });

  // 16. POST /api/curriculum/validate-xml
  await test('POST /api/curriculum/validate-xml (XML Schema & DTD Validation)', async () => {
    const xml = fs.readFileSync('public/xml/curriculum.xml', 'utf8');
    const res = await fetch(`${BASE}/api/curriculum/validate-xml`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ xmlContent: xml })
    });
    const data = await res.json();
    if (!data.success || !data.valid) throw new Error('XML Schema validation failed');
  });

  // 17. GET /academic-service/web/transcript.jsp
  await test('GET /academic-service/web/transcript.jsp (JSP Academic Records)', async () => {
    const res = await fetch(`${BASE}/academic-service/web/transcript.jsp?studentId=STU-2026-8941`);
    const html = await res.text();
    if (!html.includes('Official Academic Transcript')) {
      throw new Error('JSP transcript rendering failed');
    }
  });

  // 20. GET /academic-service/web/certificate.jsp
  await test('GET /academic-service/web/certificate.jsp (JSP Certificate Dynamic Name Resolution)', async () => {
    const testName = 'Jordan Sterling Reed';
    const res = await fetch(`${BASE}/academic-service/web/certificate.jsp?name=${encodeURIComponent(testName)}`);
    const html = await res.text();
    if (!html.includes('Certificate of Mastery') || !html.includes(testName)) {
      throw new Error('JSP certificate failed to reflect updated student name');
    }
  });

  // 21. Fresh Student Registration & Zero-State Verification
  await test('POST /api/auth/register & Verification of Clean Zero-State for Fresh Student', async () => {
    const freshEmail = `teststudent_${Date.now()}@edusphere.edu`;
    const regRes = await fetch(`${BASE}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Fresh Learner',
        email: freshEmail,
        password: 'password123',
        role: 'student'
      })
    });
    const regData = await regRes.json();
    if (!regData.success || !regData.user || !regData.user.id) {
      throw new Error('Failed to register fresh student: ' + (regData.error || 'Unknown error'));
    }
    const freshStudentId = regData.user.id;

    // Check Enrollments: Must be strictly empty (0 courses)
    const enrRes = await fetch(`${BASE}/api/enrollments`, {
      headers: { 'x-user-id': freshStudentId }
    });
    const enrData = await enrRes.json();
    if (!enrData.success || !Array.isArray(enrData.data) || enrData.data.length !== 0) {
      throw new Error(`Expected 0 enrollments for new student, but got ${enrData.data ? enrData.data.length : 'invalid data'}`);
    }

    // Check Academic Standing: Must be 0 credits and 0.00 GPA
    const verifyRes = await fetch(`${BASE}/api/academic/verify/${freshStudentId}`);
    const verifyData = await verifyRes.json();
    if (!verifyData.success || verifyData.data.creditsCompleted !== 0 || verifyData.data.cumulativeGpa !== '0.00') {
      throw new Error(`Expected 0 credits and 0.00 GPA, but got credits=${verifyData.data?.creditsCompleted}, gpa=${verifyData.data?.cumulativeGpa}`);
    }

    // Check JSP Transcript for new student
    const transcriptRes = await fetch(`${BASE}/academic-service/web/transcript.jsp?studentId=${freshStudentId}&studentName=Fresh+Learner`);
    const transcriptHtml = await transcriptRes.text();
    if (!transcriptHtml.includes('0.00') || !transcriptHtml.includes('Matriculated (Initial Standing)')) {
      throw new Error('JSP transcript failed to reflect initial 0.00 GPA / Matriculated standing for fresh student');
    }
  });

  // 22. Fresh Faculty Registration & Zero-State Clean Isolation Verification
  await test('POST /api/auth/register & Verification of Clean Zero-State for Fresh Faculty', async () => {
    const freshFacultyEmail = `testfaculty_${Date.now()}@edusphere.edu`;
    const regRes = await fetch(`${BASE}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Dr. New Instructor',
        email: freshFacultyEmail,
        password: 'password123',
        role: 'faculty',
        departmentOrMajor: 'Computer Science & Engineering'
      })
    });
    const regData = await regRes.json();
    if (!regData.success || !regData.user || !regData.user.id) {
      throw new Error('Failed to register fresh faculty: ' + (regData.error || 'Unknown error'));
    }
    const freshFacultyId = regData.user.id;

    // Check Handled Courses: Must start at strictly 0 courses
    const coursesRes = await fetch(`${BASE}/api/faculty/courses`, {
      headers: { 'x-user-id': freshFacultyId }
    });
    const coursesData = await coursesRes.json();
    if (!coursesData.success || !Array.isArray(coursesData.data) || coursesData.data.length !== 0) {
      throw new Error(`Expected 0 handled courses for new faculty, but got ${coursesData.data?.length}`);
    }

    // Check Stats: Must strictly be 0 courses, 0 students, 0 certifications
    const statsRes = await fetch(`${BASE}/api/faculty/stats`, {
      headers: { 'x-user-id': freshFacultyId }
    });
    const statsData = await statsRes.json();
    if (!statsData.success || statsData.data.coursesCount !== 0 || statsData.data.totalStudents !== 0 || statsData.data.certificationsIssued !== 0) {
      throw new Error(`Expected clean zero-state for new faculty, but got courses=${statsData.data?.coursesCount}, students=${statsData.data?.totalStudents}, certs=${statsData.data?.certificationsIssued}`);
    }

    // Check Student Cohort Roster: Must be strictly empty
    const rosterRes = await fetch(`${BASE}/api/faculty/students`, {
      headers: { 'x-user-id': freshFacultyId }
    });
    const rosterData = await rosterRes.json();
    if (!rosterData.success || !Array.isArray(rosterData.data) || rosterData.data.length !== 0) {
      throw new Error(`Expected 0 roster students for new faculty, but got ${rosterData.data?.length}`);
    }

    // Author a new course with this faculty
    const createRes = await fetch(`${BASE}/api/courses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': freshFacultyId
      },
      body: JSON.stringify({
        title: 'Distributed Systems & Microservices',
        description: 'Advanced course on event-driven microservices.',
        category: 'Computer Science',
        level: 'Advanced',
        credits: 4
      })
    });
    const createData = await createRes.json();
    if (!createData.success || !createData.data.id) {
      throw new Error('Failed to create course for new faculty');
    }
    const newCourseId = createData.data.id;

    // Verify handled courses now has exactly 1 course
    const updatedCoursesRes = await fetch(`${BASE}/api/faculty/courses`, {
      headers: { 'x-user-id': freshFacultyId }
    });
    const updatedCoursesData = await updatedCoursesRes.json();
    if (!updatedCoursesData.success || updatedCoursesData.data.length !== 1) {
      throw new Error(`Expected 1 course for new faculty after authoring, got ${updatedCoursesData.data?.length}`);
    }

    // Delete the course and verify it cleanly returns to 0
    const delRes = await fetch(`${BASE}/api/courses/${newCourseId}`, {
      method: 'DELETE',
      headers: { 'x-user-id': freshFacultyId }
    });
    const delData = await delRes.json();
    if (!delData.success) throw new Error('Failed to delete course');

    const finalCoursesRes = await fetch(`${BASE}/api/faculty/courses`, {
      headers: { 'x-user-id': freshFacultyId }
    });
    const finalCoursesData = await finalCoursesRes.json();
    if (!finalCoursesData.success || finalCoursesData.data.length !== 0) {
      throw new Error(`Expected 0 courses after deletion, got ${finalCoursesData.data?.length}`);
    }
  });

  // 23. Full Lifecycle Database Persistence: Faculty Authoring -> Student Enrollment & Progress -> Faculty Grant Mastery
  await test('Full Lifecycle DB Persistence: Faculty Authoring -> Student Progress -> Faculty Management', async () => {
    // 1. Create a specialized course by faculty
    const courseRes = await fetch(`${BASE}/api/courses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': facultyTokenId || 'usr-faculty-1'
      },
      body: JSON.stringify({
        title: 'Full-Stack Distributed Systems Engineering',
        description: 'Microservices, message queues, and distributed consensus.',
        category: 'Computer Science',
        level: 'Advanced',
        credits: 4
      })
    });
    const courseData = await courseRes.json();
    if (!courseData.success || !courseData.data.id) throw new Error('Lifecycle course authoring failed');
    const lifecycleCourseId = courseData.data.id;

    // 2. Add an assessment quiz to Module 1 of this course
    const targetModuleId = courseData.data.modules[0].moduleId;
    const quizRes = await fetch(`${BASE}/api/courses/${lifecycleCourseId}/modules/${targetModuleId}/quiz`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': facultyTokenId || 'usr-faculty-1'
      },
      body: JSON.stringify({
        title: 'Distributed Consensus Assessment',
        questions: [
          {
            questionId: 'q-1',
            questionText: 'What is the primary objective of the Raft consensus protocol?',
            options: ['Leader election and log replication', 'Data compression', 'Memory allocation', 'Network routing'],
            correctIndex: 0,
            explanation: 'Raft manages state machine replication through leader election and log synchronization.'
          }
        ]
      })
    });
    const quizData = await quizRes.json();
    if (!quizData.success) throw new Error('Lifecycle quiz authoring failed');

    // 3. Register a new student who will enroll in this course
    const studentEmail = `lifecycle_student_${Date.now()}@edusphere.edu`;
    const regStudentRes = await fetch(`${BASE}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Alexandre Dumas',
        email: studentEmail,
        password: 'password123',
        role: 'student'
      })
    });
    const regStudentData = await regStudentRes.json();
    const studentId = regStudentData.user.id;

    // 4. Student enrolls in the course
    const enrollRes = await fetch(`${BASE}/api/enrollments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': studentId
      },
      body: JSON.stringify({ courseId: lifecycleCourseId })
    });
    const enrollData = await enrollRes.json();
    if (!enrollData.success || !enrollData.data.id) throw new Error('Lifecycle enrollment failed');
    const enrollmentId = enrollData.data.id;

    // 5. Verify the faculty's student cohort now contains Alexandre Dumas
    const cohortRes = await fetch(`${BASE}/api/faculty/students`, {
      headers: { 'x-user-id': facultyTokenId || 'usr-faculty-1' }
    });
    const cohortData = await cohortRes.json();
    const enrolledRecord = cohortData.data.find(st => st.studentId === studentId && st.courseId === lifecycleCourseId);
    if (!enrolledRecord || enrolledRecord.studentName !== 'Alexandre Dumas') {
      throw new Error('Faculty student cohort roster failed to reflect enrolled student: ' + JSON.stringify(cohortData.data));
    }

    // 6. Faculty grants 100% mastery to Alexandre Dumas
    const grantRes = await fetch(`${BASE}/api/faculty/students/${enrollmentId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': facultyTokenId || 'usr-faculty-1'
      },
      body: JSON.stringify({ progressPercentage: 100, status: 'Completed' })
    });
    const grantData = await grantRes.json();
    if (!grantData.success || grantData.data.progressPercentage !== 100) {
      throw new Error('Granting 100% mastery failed');
    }

    // 7. Verify the student's academic verification now reflects 4 accredited credits and 4.00 GPA
    const verifyRes = await fetch(`${BASE}/api/academic/verify/${studentId}`);
    const verifyData = await verifyRes.json();
    if (!verifyData.success || verifyData.data.creditsCompleted !== 4 || verifyData.data.cumulativeGpa !== '4.00') {
      throw new Error(`Academic records mismatch after completion: credits=${verifyData.data?.creditsCompleted}, gpa=${verifyData.data?.cumulativeGpa}`);
    }

    // 8. Clean up lifecycle course
    await fetch(`${BASE}/api/courses/${lifecycleCourseId}`, {
      method: 'DELETE',
      headers: { 'x-user-id': facultyTokenId || 'usr-faculty-1' }
    });
  });

  console.log(`\n========================================`);
  console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log(`========================================`);

  if (failed > 0) process.exit(1);
}

runTests();
