# EduSphere • Advanced Student Learning Portal

EduSphere is a full-stack, enterprise-grade Student Learning Portal featuring modular curriculum management, interactive lesson classrooms with HTML5 video streaming, live learning analytics, XML schema validation, and authenticated academic credential verification.

---

## 🏛️ System Architecture & Technology Mapping

Every requested component has been implemented under the hood in real application architecture without academic labels on the UI:

| Technical Requirement | Implementation in Architecture | File / Module Reference |
| :--- | :--- | :--- |
| **HTML5** | Semantic tags (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<figure>`, `<canvas>`, `<video>`, `<progress>`, `<dialog>`), form input types, data attributes. | [`public/index.html`](file:///public/index.html) |
| **CSS3 & Animations** | CSS custom variables (light/dark theme), CSS Grid, Flexbox, hardware-accelerated keyframe animations (`@keyframes fadeIn`, `slideUp`, `pulseGlow`, `shimmer`). | [`public/css/styles.css`](file:///public/css/styles.css) |
| **JavaScript Objects** | ES6 modular classes (`CourseService`, `StudentPortalApp`, `LearningAnalyticsEngine`, `DomRenderer`, `XmlCurriculumManager`). | [`public/js/app.js`](file:///public/js/app.js) |
| **HTML DOM & DOM Methods** | `document.createElement`, `replaceChildren`, `querySelector`, `classList.toggle`, `createDocumentFragment`, `dataset`, event delegation. | [`public/js/app.js`](file:///public/js/app.js) |
| **XML, XML DTD, XML Schema** | Accredited course curriculum specification with Document Type Definition (`curriculum.dtd`) and XML Schema Definition (`curriculum.xsd`), DOM parsing and validation endpoint. | [`public/xml/curriculum.dtd`](file:///public/xml/curriculum.dtd), [`public/xml/curriculum.xsd`](file:///public/xml/curriculum.xsd), [`public/xml/curriculum.xml`](file:///public/xml/curriculum.xml) |
| **JSON** | Course catalogs, student profiles, quiz submissions, and REST API payloads formatted in structured JSON. | [`services/store.js`](file:///services/store.js), [`routes/api.js`](file:///routes/api.js) |
| **jQuery** | jQuery DOM animations (`slideToggle`, `fadeIn`), debounced live search, accordion expand/collapse, and jQuery event handlers. | [`public/js/jquery-interactions.js`](file:///public/js/jquery-interactions.js) |
| **HTTP Methods & RESTful APIs** | Full RESTful operations: **GET** (catalog/profile), **POST** (enrollments/validation), **PUT** (profile update), **PATCH** (lesson progress), **DELETE** (drop enrollment). | [`routes/api.js`](file:///routes/api.js) |
| **AJAX & AJAX with JSON** | Asynchronous JSON exchange using both Fetch API and jQuery `$.ajax`, `$.getJSON`, `$.post` without full-page reloads. | [`public/js/app.js`](file:///public/js/app.js), [`public/js/jquery-interactions.js`](file:///public/js/jquery-interactions.js) |
| **Node.js & NPM** | Express.js runtime, NPM script automation, modular REST controllers, CORS middleware, static asset pipeline. | [`server.js`](file:///server.js), [`package.json`](file:///package.json) |
| **MongoDB** | Mongoose schemas (`Course`, `Student`, `Enrollment`) with Atlas connection support and automatic fallback in-memory store for instant zero-config startup. | [`models/`](file:///models/), [`services/store.js`](file:///services/store.js) |
| **JSP (Java Server Pages)** | Official academic transcripts (`transcript.jsp`) and degree certificates (`certificate.jsp`) utilizing JSP directives, expressions, and scriptlets. | [`academic-service/web/`](file:///academic-service/web/) |
| **JDBC** | `AcademicJdbcDao.java` featuring `DriverManager.getConnection()`, parameterized `PreparedStatement`, `ResultSet`, and transactional commits. | [`academic-service/src/`](file:///academic-service/src/) |

---

## 📋 Prerequisites & System Requirements

To run, develop, and deploy this website, ensure you have:

1. **Node.js & NPM**: Node.js v18+ (tested on Node.js v24.16.0 & npm v11.13.0).
2. **Java JDK** *(Optional for standalone JSP/JDBC runner)*: OpenJDK 17+ or 21 (tested on OpenJDK 21.0.11).
3. **Git**: Version control installed for Render & Vercel deployments.
4. **Cloud Accounts**:
   - **Render**: Free account at [render.com](https://render.com).
   - **Vercel**: Free account at [vercel.com](https://vercel.com).
   - **MongoDB Atlas** *(Optional for production cloud DB)*: Free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas).

---

## 🚀 Running Locally in 3 Steps

### 1. Install Dependencies
```bash
npm install
```
*(On Windows PowerShell if scripts are restricted, use `npm.cmd install`)*

### 2. Start the Server
```bash
npm start
```

### 3. Open in Browser
Open your browser and navigate to:
```
http://localhost:3000
```

> **Note on MongoDB**: If `MONGODB_URI` is not set in `.env`, the server automatically operates in **Resilient In-Memory Mode** with pre-seeded courses, lessons, and student records. To connect to real MongoDB Atlas, simply create `.env` and provide your connection string:
> ```env
> MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/edusphere?retryWrites=true&w=majority
> ```

---

## ☕ Running the Standalone JSP & JDBC Subsystem (Optional)

To test the Java JSP & JDBC service natively on port `8080`:

1. Compile the Java classes:
   ```bash
   javac -d "academic-service/bin" "academic-service/src/com/learningportal/academic/AcademicJdbcDao.java" "academic-service/src/com/learningportal/academic/AcademicServiceRunner.java"
   ```

2. Run the service:
   ```bash
   npm run academic
   ```
   Or directly via `java`:
   ```bash
   java -cp academic-service/bin com.learningportal.academic.AcademicServiceRunner
   ```

3. Open in browser:
   - Official Transcript: `http://localhost:8080/transcript.jsp?studentId=STU-2026-8941`
   - Signed Certificate: `http://localhost:8080/certificate.jsp?name=Alex+Sterling`

*(Note: The main Node.js server at port `3000` also has built-in execution handlers for `/academic-service/web/transcript.jsp` and `/academic-service/web/certificate.jsp`, so they work out-of-the-box even without running the Java server separately!)*

---

## 🌐 Deploying to Render

Render hosts Node.js web services with automated HTTPS and GitHub integration:

1. Push your repository to **GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of EduSphere Learning Portal"
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   git branch -M main
   git push -u origin main
   ```

2. Log in to [Render Dashboard](https://dashboard.render.com/) and click **New +** → **Web Service**.
3. Select your GitHub repository.
4. Configure the Web Service settings:
   - **Name**: `student-learning-portal`
   - **Environment**: `Node`
   - **Region**: Closest to your users (e.g. `Singapore` or `Oregon`)
   - **Branch**: `main`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`
5. *(Optional)* Under **Environment Variables**, add:
   - `NODE_ENV`: `production`
   - `MONGODB_URI`: `<your-mongodb-atlas-connection-string>`
6. Click **Deploy Web Service**. Render will automatically build, deploy, and assign a live URL (e.g., `https://student-learning-portal.onrender.com`).

*(A preconfigured [`render.yaml`](file:///render.yaml) is included in the root directory for 1-click Blueprint deployment).*

---

## ▲ Deploying to Vercel

Vercel provides instant edge CDN delivery and serverless API execution:

### Option A: Via Vercel CLI
1. Install Vercel CLI globally:
   ```bash
   npm install -g vercel
   ```
2. Run deployment from the project root:
   ```bash
   vercel
   ```
3. Follow the CLI prompts (Link to existing project: `N`, Project Name: `student-learning-portal`, Directory: `./`).
4. For production deployment:
   ```bash
   vercel --prod
   ```

### Option B: Via Vercel Web Dashboard (Recommended)
1. Push your code to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new).
3. Import your GitHub repository.
4. Framework Preset: Choose **Other** (Vercel automatically detects [`vercel.json`](file:///vercel.json) and [`api/index.js`](file:///api/index.js)).
5. Under **Environment Variables**, optionally add:
   - `MONGODB_URI`: `<your-mongodb-atlas-uri>`
6. Click **Deploy**. Vercel will deploy your application to a global CDN with a live `.vercel.app` domain.

---

## 🧪 Automated Test Verification

The project includes an end-to-end test suite verifying all 13 core endpoints and technical requirements:

```bash
node test-api.js
```

**Verification Results:**
- ✅ `GET /health` (Uptime monitoring & database status)
- ✅ `GET /api/courses` (HTTP GET Course Catalog & Filters)
- ✅ `GET /api/courses/:id` (HTTP GET Single Course Details)
- ✅ `POST /api/courses` (HTTP POST Dynamic Course Creation)
- ✅ `GET /api/student/profile` (HTTP GET Student Profile)
- ✅ `PUT /api/student/profile` (HTTP PUT Student Profile Update)
- ✅ `POST /api/enrollments` (HTTP POST Course Enrollment)
- ✅ `PATCH /api/courses/:id/progress` (HTTP PATCH Lesson Completion Update)
- ✅ `DELETE /api/enrollments/:id` (HTTP DELETE Drop Course)
- ✅ `GET /api/curriculum/xml` (XML Document Delivery)
- ✅ `POST /api/curriculum/validate-xml` (XML Schema & DTD Structural Validation)
- ✅ `GET /academic-service/web/transcript.jsp` (JSP Transcript Rendering)
- ✅ `GET /academic-service/web/certificate.jsp` (JSP Certificate Generation)
