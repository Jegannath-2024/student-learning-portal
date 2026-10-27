const fs = require('fs');

async function runTests() {
  const BASE = process.env.TEST_URL || process.argv[2] || 'http://localhost:3000';
  console.log(`Running tests against target: ${BASE}`);
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

  // 2. GET /api/courses
  await test('GET /api/courses (HTTP GET Course Catalog)', async () => {
    const res = await fetch(`${BASE}/api/courses`);
    const data = await res.json();
    if (!data.success || data.count < 1) throw new Error('Courses fetch failed');
  });

  // 3. GET /api/courses/:id
  await test('GET /api/courses/cs-101 (HTTP GET Single Course)', async () => {
    const res = await fetch(`${BASE}/api/courses/cs-101`);
    const data = await res.json();
    if (!data.success || data.data.id !== 'cs-101') throw new Error('Course detail failed');
  });

  // 4. POST /api/courses
  let createdCourseId = null;
  await test('POST /api/courses (HTTP POST Course Creation)', async () => {
    const res = await fetch(`${BASE}/api/courses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Distributed Systems & Microservices',
        description: 'Advanced patterns for resilient cloud services.',
        category: 'Computer Science',
        level: 'Advanced',
        credits: 4,
        duration: '8 Weeks'
      })
    });
    const data = await res.json();
    if (!data.success || !data.data.id) throw new Error('Course creation failed');
    createdCourseId = data.data.id;
  });

  // 5. GET /api/student/profile
  await test('GET /api/student/profile (HTTP GET Student Profile)', async () => {
    const res = await fetch(`${BASE}/api/student/profile`);
    const data = await res.json();
    if (!data.success || !data.data.name) throw new Error('Student profile fetch failed');
  });

  // 6. PUT /api/student/profile
  await test('PUT /api/student/profile (HTTP PUT Update Profile)', async () => {
    const res = await fetch(`${BASE}/api/student/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Alex Sterling',
        bio: 'Updated bio via RESTful PUT API test',
        major: 'Computer Science & Engineering',
        learningGoals: 'Full-Stack Mastery'
      })
    });
    const data = await res.json();
    if (!data.success || data.data.bio !== 'Updated bio via RESTful PUT API test') {
      throw new Error('Student profile update failed');
    }
  });

  // 7. POST /api/enrollments
  let newEnrollmentId = null;
  await test('POST /api/enrollments (HTTP POST Course Enrollment)', async () => {
    const res = await fetch(`${BASE}/api/enrollments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ courseId: 'se-303' })
    });
    const data = await res.json();
    if (!data.success || !data.data.id) throw new Error('Enrollment failed');
    newEnrollmentId = data.data.id;
  });

  // 8. PATCH /api/courses/:id/progress
  await test('PATCH /api/courses/cs-101/progress (HTTP PATCH Lesson Completion)', async () => {
    const res = await fetch(`${BASE}/api/courses/cs-101/progress`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lessonId: 'les-101' })
    });
    const data = await res.json();
    if (!data.success || !data.data.completedLessons.includes('les-101')) {
      throw new Error('Lesson progress PATCH failed');
    }
  });

  // 9. DELETE /api/enrollments/:id
  await test('DELETE /api/enrollments/:id (HTTP DELETE Drop Course)', async () => {
    if (!newEnrollmentId) throw new Error('No enrollment ID to delete');
    const res = await fetch(`${BASE}/api/enrollments/${newEnrollmentId}`, {
      method: 'DELETE'
    });
    const data = await res.json();
    if (!data.success) throw new Error('Enrollment DELETE failed');
  });

  // 10. GET /api/curriculum/xml
  await test('GET /api/curriculum/xml (XML Curriculum Delivery)', async () => {
    const res = await fetch(`${BASE}/api/curriculum/xml`);
    const xml = await res.text();
    if (!xml.includes('<curriculum') || !xml.includes('curriculum.dtd')) {
      throw new Error('Curriculum XML retrieval failed');
    }
  });

  // 11. POST /api/curriculum/validate-xml
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

  // 12. GET /academic-service/web/transcript.jsp
  await test('GET /academic-service/web/transcript.jsp (JSP Academic Records)', async () => {
    const res = await fetch(`${BASE}/academic-service/web/transcript.jsp?studentId=STU-2026-8941`);
    const html = await res.text();
    if (!html.includes('Official Academic Transcript') || !html.includes('Alex Sterling')) {
      throw new Error('JSP transcript rendering failed');
    }
  });

  // 13. GET /academic-service/web/certificate.jsp
  await test('GET /academic-service/web/certificate.jsp (JSP Certificate Generation)', async () => {
    const res = await fetch(`${BASE}/academic-service/web/certificate.jsp?name=Alex+Sterling`);
    const html = await res.text();
    if (!html.includes('Certificate of Mastery') || !html.includes('Alex Sterling')) {
      throw new Error('JSP certificate rendering failed');
    }
  });

  console.log(`\n========================================`);
  console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log(`========================================`);

  if (failed > 0) process.exit(1);
}

runTests();
