-- ====================================================================
-- Academic Database Schema (JDBC & JSP Academic Records Service)
-- ====================================================================

-- 1. Students Table
CREATE TABLE IF NOT EXISTS students (
    student_id VARCHAR(32) PRIMARY KEY,
    full_name VARCHAR(120) NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    major VARCHAR(100) NOT NULL,
    admission_year INT NOT NULL,
    academic_standing VARCHAR(50) DEFAULT 'Good Standing'
);

-- 2. Academic Records Table (Grades & Credits)
CREATE TABLE IF NOT EXISTS academic_records (
    record_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id VARCHAR(32) NOT NULL,
    course_code VARCHAR(32) NOT NULL,
    course_title VARCHAR(200) NOT NULL,
    semester VARCHAR(30) NOT NULL,
    credits INT NOT NULL,
    grade VARCHAR(5) NOT NULL,
    grade_points DOUBLE NOT NULL,
    FOREIGN KEY (student_id) REFERENCES students(student_id)
);

-- 3. Issued Certificates Table
CREATE TABLE IF NOT EXISTS certificates (
    certificate_id VARCHAR(64) PRIMARY KEY,
    student_id VARCHAR(32) NOT NULL,
    course_code VARCHAR(32) NOT NULL,
    course_title VARCHAR(200) NOT NULL,
    issue_date DATE NOT NULL,
    digital_signature VARCHAR(128) NOT NULL,
    status VARCHAR(20) DEFAULT 'VERIFIED',
    FOREIGN KEY (student_id) REFERENCES students(student_id)
);

-- Initial Academic Seed Records
INSERT INTO students (student_id, full_name, email, major, admission_year, academic_standing)
VALUES ('STU-2026-8941', 'Alex Sterling', 'alex.sterling@learningportal.edu', 'Computer Science & Engineering', 2024, 'Dean''s Honors List')
ON DUPLICATE KEY UPDATE full_name = VALUES(full_name);

INSERT INTO academic_records (student_id, course_code, course_title, semester, credits, grade, grade_points)
VALUES 
('STU-2026-8941', 'CS-101', 'Full-Stack Web Architectures', 'Fall 2025', 4, 'A', 4.0),
('STU-2026-8941', 'DS-202', 'Database Systems: Document & Relational Modeling', 'Fall 2025', 3, 'A-', 3.7),
('STU-2026-8941', 'SE-303', 'Cloud Deployment & Serverless Microservices', 'Spring 2026', 3, 'A', 4.0),
('STU-2026-8941', 'MATH-201', 'Discrete Mathematics & Automata', 'Spring 2026', 4, 'B+', 3.3);

INSERT INTO certificates (certificate_id, student_id, course_code, course_title, issue_date, digital_signature)
VALUES 
('CERT-2026-78912', 'STU-2026-8941', 'CS-101', 'Full-Stack Web Architectures', '2026-05-15', 'SHA256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069');
