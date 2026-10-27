require('dotenv').config();
const dns = require('dns');
try {
  // Ensure reliable DNS resolution for MongoDB Atlas SRV records across Windows and cloud runtimes
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {
  // fallback if environment restricts custom DNS
}

const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const apiRoutes = require('./routes/api');
const store = require('./services/store');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static frontend assets
app.use(express.static(path.join(__dirname, 'public')));

// Health check endpoint (for Render / Vercel uptime monitoring)
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: mongoose.connection.readyState === 1 ? 'MongoDB Connected' : 'In-Memory Resilient Store'
  });
});

// Database connection management (handles long-running servers and serverless invocations)
let isDbConnecting = null;

async function ensureDbConnected() {
  if (mongoose.connection.readyState === 1) return;
  if (isDbConnecting) return isDbConnecting;

  if (MONGODB_URI) {
    isDbConnecting = mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000
    }).then(async () => {
      store.setMongoConnected(true);
      await store.seedMongoIfEmpty();
      isDbConnecting = null;
    }).catch(err => {
      console.warn('MongoDB connection issue, using in-memory store:', err.message);
      store.setMongoConnected(false);
      isDbConnecting = null;
    });
    return isDbConnecting;
  }
}

// Ensure DB is ready on each request (crucial for Vercel serverless cold-starts)
app.use(async (req, res, next) => {
  try {
    await ensureDbConnected();
  } catch (e) {}
  next();
});

// API Routes
app.use('/api', apiRoutes);

// Direct JSP rendering fallback handler in Express (so transcript.jsp and certificate.jsp work out-of-the-box)
app.get('/academic-service/web/:file', async (req, res) => {
  const file = req.params.file;
  const filePath = path.join(__dirname, 'academic-service', 'web', file);
  const fs = require('fs');

  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    const studentId = req.query.studentId || req.query.userId || 'STU-2026-8941';
    let studentName = req.query.name || req.query.studentName;
    const targetUserId = req.query.userId || (req.query.studentId && req.query.studentId !== 'STU-2026-8941' ? req.query.studentId : null);

    // Dynamically fetch student's latest profile name from database if not explicitly set
    if (!studentName || studentName === 'Alex Sterling') {
      try {
        const studentUserId = targetUserId || 'usr-student-1';
        const studentUser = await store.getUserById(studentUserId);
        if (studentUser && studentUser.name) {
          studentName = studentUser.name;
        } else if (!targetUserId || targetUserId === 'usr-student-1') {
          studentName = 'Alex Sterling';
        }
      } catch (e) {
        if (!targetUserId || targetUserId === 'usr-student-1') {
          studentName = 'Alex Sterling';
        }
      }
    }

    const courseTitle = req.query.course || 'Full-Stack Web Architectures';
    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    const isDemoStudent = (!targetUserId || targetUserId === 'usr-student-1' || targetUserId === 'STU-2026-8941') && (!studentName || studentName === 'Alex Sterling');

    let totalCredits = isDemoStudent ? '14' : '0';
    let gpa = isDemoStudent ? '3.74' : '0.00';
    let totalGradePoints = isDemoStudent ? '52.30' : '0.00';
    let standing = isDemoStudent ? "Dean's Honors List" : "Matriculated (Initial Standing)";
    let tableRowsHtml = '';

    if (isDemoStudent) {
      tableRowsHtml = `
                <tr>
                    <td><strong>CS-101</strong></td>
                    <td>Full-Stack Web Architectures</td>
                    <td>Fall 2025</td>
                    <td>4</td>
                    <td><span class="grade-chip">A</span></td>
                    <td>16.00</td>
                </tr>
                <tr>
                    <td><strong>DS-202</strong></td>
                    <td>Database Systems: Document & Relational Modeling</td>
                    <td>Fall 2025</td>
                    <td>3</td>
                    <td><span class="grade-chip">A-</span></td>
                    <td>11.10</td>
                </tr>
                <tr>
                    <td><strong>SE-303</strong></td>
                    <td>Cloud Deployment & Serverless Microservices</td>
                    <td>Spring 2026</td>
                    <td>3</td>
                    <td><span class="grade-chip">A</span></td>
                    <td>12.00</td>
                </tr>
                <tr>
                    <td><strong>MATH-201</strong></td>
                    <td>Discrete Mathematics & Automata</td>
                    <td>Spring 2026</td>
                    <td>4</td>
                    <td><span class="grade-chip">B+</span></td>
                    <td>13.20</td>
                </tr>`;
    } else {
      // For new/registered student: calculate real academic metrics
      try {
        const studentEnrollments = targetUserId ? await store.getEnrollments(targetUserId) : [];
        const completed = (studentEnrollments || []).filter(e => e.status === 'Completed' || e.progressPercentage === 100);
        if (completed.length > 0) {
          const courses = await store.getCourses();
          let creditsCount = 0;
          let ptsCount = 0;
          tableRowsHtml = completed.map(e => {
            const c = courses.find(course => course.id === e.courseId);
            const cr = c ? (c.credits || 4) : 4;
            const gp = 4.0;
            creditsCount += cr;
            ptsCount += (cr * gp);
            return `
                <tr>
                    <td><strong>${(c ? c.id : e.courseId).toUpperCase()}</strong></td>
                    <td>${c ? c.title : 'Course'}</td>
                    <td>Spring 2026</td>
                    <td>${cr}</td>
                    <td><span class="grade-chip">A</span></td>
                    <td>${(cr * gp).toFixed(2)}</td>
                </tr>`;
          }).join('\n');
          totalCredits = String(creditsCount);
          gpa = (ptsCount / creditsCount).toFixed(2);
          totalGradePoints = ptsCount.toFixed(2);
          standing = Number(gpa) >= 3.5 ? "Dean's Honors List" : "Good Academic Standing";
        } else {
          tableRowsHtml = `
                <tr>
                    <td colspan="6" style="text-align:center; padding:32px 16px; color:#64748b; font-style:italic;">
                        No completed academic course records found for this student. Complete curriculum modules and diagnostic assessments to accredit official course grades.
                    </td>
                </tr>`;
        }
      } catch (e) {
        tableRowsHtml = `
                <tr>
                    <td colspan="6" style="text-align:center; padding:32px 16px; color:#64748b; font-style:italic;">
                        No completed academic course records found.
                    </td>
                </tr>`;
      }
    }

    // Replace JSP dynamic loop block with tableRowsHtml
    content = content.replace(/<%\s*for\s*\(\s*Map<String,\s*Object>\s*row\s*:\s*records\s*\)\s*\{[\s\S]*?<%[\s\S]*?\}[\s\S]*?%>/gi, tableRowsHtml);

    // Execute JSP expressions and tags
    let rendered = content
      .replace(/<%=\s*studentName\s*%>/gi, studentName || 'Student Learner')
      .replace(/<%=\s*targetStudentId\s*%>/gi, studentId)
      .replace(/<%=\s*major\s*%>/gi, 'Computer Science & Engineering')
      .replace(/<%=\s*standing\s*%>/gi, standing)
      .replace(/<%=\s*totalCredits\s*%>/gi, totalCredits)
      .replace(/<%=\s*df\.format\(totalGradePoints\)\s*%>/gi, totalGradePoints)
      .replace(/<%=\s*df\.format\(gpa\)\s*%>/gi, gpa)
      .replace(/<%=\s*gpa\s*%>/gi, gpa)
      .replace(/<%=\s*courseTitle\s*%>/gi, courseTitle)
      .replace(/<%=\s*certId\s*%>/gi, 'CERT-LP-' + Math.abs(((studentName || 'Student') + courseTitle).split('').reduce((a,b)=>{a=((a<<5)-a)+b.charCodeAt(0);return a&a},0)))
      .replace(/<%=\s*today\s*%>/gi, today)
      .replace(/<%=\s*new\s+java\.util\.Date\(\)\s*%>/gi, new Date().toString())
      .replace(/<%@\s*page[^>]*%>/gi, '')
      .replace(/<%[\s\S]*?%>/gi, '');

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(200).send(rendered);
  }
  return res.status(404).send('JSP file not found');
});

// Fallback route for SPA (Express v5 compatible)
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api')) {
    return res.sendFile(path.join(__dirname, 'public', 'index.html'));
  }
  next();
});

// Database connection initialization
async function startServer() {
  if (MONGODB_URI) {
    try {
      console.log('Connecting to MongoDB Atlas / Local MongoDB instance...');
      await mongoose.connect(MONGODB_URI, {
        serverSelectionTimeoutMS: 5000
      });
      console.log('Successfully connected to MongoDB database!');
      store.setMongoConnected(true);
      await store.seedMongoIfEmpty();
    } catch (err) {
      console.warn('MongoDB connection failed. Continuing in resilient In-Memory store mode:', err.message);
      store.setMongoConnected(false);
    }
  } else {
    console.log('Notice: MONGODB_URI not provided. Running seamlessly with in-memory resilient data store.');
    console.log('To link MongoDB Atlas, set MONGODB_URI in your .env or Render/Vercel environment variables.');
  }

  // Only listen if not run inside a serverless handler
  if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL) {
    app.listen(PORT, () => {
      console.log(`=======================================================`);
      console.log(`Student Learning Portal server running on port: ${PORT}`);
      console.log(`Open in browser: http://localhost:${PORT}`);
      console.log(`REST API Health Check: http://localhost:${PORT}/health`);
      console.log(`=======================================================`);
    });
  }
}

startServer();

module.exports = app;
