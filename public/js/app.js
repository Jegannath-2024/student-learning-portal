/**
 * Student Learning Portal - Core Application Architecture
 * Object-Oriented JavaScript, HTML DOM Tree Methods, HTML5 Canvas Analytics,
 * RESTful Client Operations & SPA View State Management
 */

// 1. Course Service Object - Encapsulates REST API calls
class CourseService {
  async fetchCourses(query = {}) {
    const params = new URLSearchParams(query);
    const res = await fetch(`/api/courses?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch courses');
    return await res.json();
  }

  async fetchCourseById(id) {
    const res = await fetch(`/api/courses/${id}`);
    if (!res.ok) throw new Error(`Failed to load course ${id}`);
    return await res.json();
  }

  async fetchEnrollments() {
    const res = await fetch('/api/enrollments');
    if (!res.ok) throw new Error('Failed to fetch enrollments');
    return await res.json();
  }

  async enrollInCourse(courseId) {
    const res = await fetch('/api/enrollments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ courseId })
    });
    if (!res.ok) throw new Error('Enrollment request failed');
    return await res.json();
  }

  async updateLessonProgress(courseId, lessonId) {
    const res = await fetch(`/api/courses/${courseId}/progress`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lessonId })
    });
    if (!res.ok) throw new Error('Progress update failed');
    return await res.json();
  }

  async dropEnrollment(enrollmentId) {
    const res = await fetch(`/api/enrollments/${enrollmentId}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to drop enrollment');
    return await res.json();
  }

  async fetchStudentProfile() {
    const res = await fetch('/api/student/profile');
    if (!res.ok) throw new Error('Failed to load profile');
    return await res.json();
  }
}

// 2. HTML5 Canvas Learning Analytics Engine
class LearningAnalyticsEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
  }

  drawStudyAnalytics(studyData = [3.5, 4.2, 5.0, 2.8, 6.4, 4.8, 5.5]) {
    if (!this.canvas || !this.ctx) return;

    const ctx = this.ctx;
    const width = this.canvas.width = this.canvas.parentElement.clientWidth || 600;
    const height = this.canvas.height = 240;

    ctx.clearRect(0, 0, width, height);

    const padding = 40;
    const chartW = width - padding * 2;
    const chartH = height - padding * 2;
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    // Draw Background Grid Lines
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padding + (chartH / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();

      // Axis labels
      ctx.fillStyle = '#94a3b8';
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(`${(8 - i * 2)}h`, padding - 8, y + 4);
    }

    // Calculate Coordinates
    const points = [];
    const step = chartW / (days.length - 1);
    const maxVal = 8.0;

    for (let i = 0; i < studyData.length; i++) {
      const x = padding + i * step;
      const y = padding + chartH - (studyData[i] / maxVal) * chartH;
      points.push({ x, y, val: studyData[i] });

      // Day label
      ctx.fillStyle = '#64748b';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(days[i], x, height - 12);
    }

    // Draw Smooth Area Gradient
    const gradient = ctx.createLinearGradient(0, padding, 0, height - padding);
    gradient.addColorStop(0, 'rgba(37, 99, 235, 0.35)');
    gradient.addColorStop(1, 'rgba(37, 99, 235, 0.0)');

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 0; i < points.length - 1; i++) {
      const cpX = (points[i].x + points[i + 1].x) / 2;
      ctx.quadraticCurveTo(points[i].x, points[i].y, cpX, (points[i].y + points[i + 1].y) / 2);
    }
    ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
    ctx.lineTo(points[points.length - 1].x, height - padding);
    ctx.lineTo(points[0].x, height - padding);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Draw Smooth Curve Line
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 0; i < points.length - 1; i++) {
      const cpX = (points[i].x + points[i + 1].x) / 2;
      ctx.quadraticCurveTo(points[i].x, points[i].y, cpX, (points[i].y + points[i + 1].y) / 2);
    }
    ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Draw Points
    points.forEach((pt) => {
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.strokeStyle = '#2563eb';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Tooltip/Data value
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${pt.val}h`, pt.x, pt.y - 10);
    });
  }
}

// 3. DOM Renderer - Centralizes direct HTML DOM methods
class DomRenderer {
  static createCourseCard(course, onEnroll, onViewDetails) {
    const card = document.createElement('article');
    card.className = 'course-card';
    card.dataset.courseId = course.id;

    // Card Thumbnail Container
    const thumbWrap = document.createElement('figure');
    thumbWrap.className = 'course-thumb-wrap';

    const img = document.createElement('img');
    img.className = 'course-thumb';
    img.src = course.thumbnail;
    img.alt = course.title;
    img.loading = 'lazy';

    const levelTag = document.createElement('span');
    levelTag.className = 'course-level-tag';
    levelTag.textContent = course.level;

    const creditsTag = document.createElement('span');
    creditsTag.className = 'course-credits-tag';
    creditsTag.textContent = `${course.credits} Credits`;

    thumbWrap.appendChild(img);
    thumbWrap.appendChild(levelTag);
    thumbWrap.appendChild(creditsTag);

    // Card Body
    const body = document.createElement('div');
    body.className = 'course-card-body';

    const category = document.createElement('div');
    category.className = 'course-card-category';
    category.textContent = course.category;

    const title = document.createElement('h3');
    title.className = 'course-card-title';
    title.textContent = course.title;

    const desc = document.createElement('p');
    desc.className = 'course-card-desc';
    desc.textContent = course.description;

    // Instructor Row
    const instWrap = document.createElement('div');
    instWrap.className = 'course-instructor';

    const instAvatar = document.createElement('img');
    instAvatar.className = 'instructor-avatar';
    instAvatar.src = course.instructor.avatar;
    instAvatar.alt = course.instructor.name;

    const instInfo = document.createElement('div');
    instInfo.className = 'instructor-info';

    const instName = document.createElement('span');
    instName.className = 'instructor-name';
    instName.textContent = course.instructor.name;

    const instTitle = document.createElement('span');
    instTitle.className = 'instructor-title';
    instTitle.textContent = course.instructor.title;

    instInfo.appendChild(instName);
    instInfo.appendChild(instTitle);
    instWrap.appendChild(instAvatar);
    instWrap.appendChild(instInfo);

    // Card Footer Actions
    const footer = document.createElement('div');
    footer.className = 'course-card-footer';

    const metrics = document.createElement('div');
    metrics.className = 'course-metrics';
    metrics.innerHTML = `
      <span class="metric-item">★ ${course.rating}</span>
      <span class="metric-item">👥 ${course.studentsCount}</span>
      <span class="metric-item">⏳ ${course.duration}</span>
    `;

    const actionsWrap = document.createElement('div');
    actionsWrap.style.display = 'flex';
    actionsWrap.style.gap = '8px';

    const btnDetails = document.createElement('button');
    btnDetails.className = 'btn-secondary';
    btnDetails.textContent = 'Curriculum';
    btnDetails.addEventListener('click', () => onViewDetails(course));

    const btnEnroll = document.createElement('button');
    btnEnroll.className = 'btn-primary';
    btnEnroll.textContent = 'Enroll';
    btnEnroll.addEventListener('click', () => onEnroll(course));

    actionsWrap.appendChild(btnDetails);
    actionsWrap.appendChild(btnEnroll);

    footer.appendChild(metrics);
    footer.appendChild(actionsWrap);

    body.appendChild(category);
    body.appendChild(title);
    body.appendChild(desc);
    body.appendChild(instWrap);
    body.appendChild(footer);

    card.appendChild(thumbWrap);
    card.appendChild(body);

    return card;
  }

  static createEnrolledCard(enrollment, onContinue, onDrop) {
    const card = document.createElement('div');
    card.className = 'enrolled-card';
    card.dataset.enrollmentId = enrollment.id;

    const course = enrollment.course || {};

    const info = document.createElement('div');
    info.className = 'enrolled-info';

    const img = document.createElement('img');
    img.className = 'enrolled-thumb';
    img.src = course.thumbnail || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=150';
    img.alt = course.title || 'Course';

    const details = document.createElement('div');
    details.className = 'enrolled-details';
    details.innerHTML = `
      <h4>${course.title || 'Course'}</h4>
      <p>${course.category || 'General'} • Instructor: ${course.instructor?.name || 'Faculty'}</p>
    `;

    info.appendChild(img);
    info.appendChild(details);

    // Progress Section with HTML5 Progress Element
    const progressWrap = document.createElement('div');
    progressWrap.className = 'enrolled-progress-wrap';

    const progressHeader = document.createElement('div');
    progressHeader.className = 'enrolled-progress-header';
    progressHeader.innerHTML = `
      <span>Overall Mastery</span>
      <strong>${enrollment.progressPercentage}%</strong>
    `;

    const progressEl = document.createElement('progress');
    progressEl.max = 100;
    progressEl.value = enrollment.progressPercentage;

    progressWrap.appendChild(progressHeader);
    progressWrap.appendChild(progressEl);

    // Actions
    const actions = document.createElement('div');
    actions.className = 'enrolled-actions';

    const btnContinue = document.createElement('button');
    btnContinue.className = 'btn-primary';
    btnContinue.textContent = enrollment.progressPercentage === 100 ? 'Review Course' : 'Enter Classroom';
    btnContinue.addEventListener('click', () => onContinue(enrollment));

    const btnDrop = document.createElement('button');
    btnDrop.className = 'btn-danger';
    btnDrop.textContent = 'Drop';
    btnDrop.title = 'Drop this course enrollment';
    btnDrop.addEventListener('click', () => onDrop(enrollment));

    actions.appendChild(btnContinue);
    actions.appendChild(btnDrop);

    card.appendChild(info);
    card.appendChild(progressWrap);
    card.appendChild(actions);

    return card;
  }
}

// 4. Main Portal Application Controller
class StudentPortalApp {
  constructor() {
    this.service = new CourseService();
    this.analytics = new LearningAnalyticsEngine('analyticsCanvas');
    this.courses = [];
    this.enrollments = [];
    this.studentProfile = null;
    this.activeCourse = null;
    this.activeLesson = null;
    this.selectedCategory = 'All';

    this.init();
  }

  async init() {
    this.bindEvents();
    this.initTheme();
    await this.loadInitialData();
  }

  bindEvents() {
    // Nav tab clicks for SPA routing
    const tabs = document.querySelectorAll('.nav-tab-btn');
    tabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        const targetView = tab.dataset.view;
        this.switchView(targetView);
      });
    });

    // Theme toggle
    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => this.toggleTheme());
    }

    // Modal close buttons
    const modal = document.getElementById('custom-modal');
    const closeBtn = document.getElementById('modal-close-btn');
    if (closeBtn && modal) {
      closeBtn.addEventListener('click', () => modal.close());
    }

    // XML Download trigger
    const xmlDownloadBtn = document.getElementById('btn-download-xml');
    if (xmlDownloadBtn) {
      xmlDownloadBtn.addEventListener('click', () => window.xmlCurriculumManager.downloadXmlFile());
    }

    // Complete lesson button
    const completeLessonBtn = document.getElementById('btn-complete-lesson');
    if (completeLessonBtn) {
      completeLessonBtn.addEventListener('click', () => this.handleCompleteLesson());
    }

    // Open Quiz Modal
    const openQuizBtn = document.getElementById('btn-open-quiz');
    if (openQuizBtn) {
      openQuizBtn.addEventListener('click', () => this.openQuizDialog());
    }

    // Redraw canvas on window resize
    window.addEventListener('resize', () => {
      this.analytics.drawStudyAnalytics();
    });
  }

  initTheme() {
    const saved = localStorage.getItem('learnportal-theme') || 'light';
    document.documentElement.setAttribute('data-theme', saved);
    this.updateThemeIcon(saved);
  }

  toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('learnportal-theme', next);
    this.updateThemeIcon(next);
  }

  updateThemeIcon(theme) {
    const icon = document.getElementById('theme-toggle-icon');
    if (icon) {
      icon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
  }

  switchView(viewId) {
    // Update active nav tab
    document.querySelectorAll('.nav-tab-btn').forEach(btn => {
      if (btn.dataset.view === viewId) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Show/hide view sections
    document.querySelectorAll('.view-section').forEach(sec => {
      if (sec.id === viewId) {
        sec.classList.add('active');
      } else {
        sec.classList.remove('active');
      }
    });

    // Special view triggers
    if (viewId === 'view-dashboard') {
      setTimeout(() => this.analytics.drawStudyAnalytics(), 100);
      this.renderEnrolledCourses();
    } else if (viewId === 'view-curriculum') {
      if (window.xmlCurriculumManager) {
        window.xmlCurriculumManager.loadCurriculumXml();
      }
    } else if (viewId === 'view-academic') {
      this.loadAcademicRecords();
    }
  }

  async loadInitialData() {
    try {
      const [coursesRes, enrollmentsRes, profileRes] = await Promise.all([
        this.service.fetchCourses(),
        this.service.fetchEnrollments(),
        this.service.fetchStudentProfile()
      ]);

      this.courses = coursesRes.data || [];
      this.enrollments = enrollmentsRes.data || [];
      this.studentProfile = profileRes.data || {};

      this.updateStudentHeader();
      this.renderCourses(this.courses);
      this.renderEnrolledCourses();
      this.populateProfileForm();
      this.analytics.drawStudyAnalytics();
    } catch (err) {
      console.error('Failed to load portal data:', err);
      this.showToast('Data load notice: using initial local store.', 'info');
    }
  }

  updateStudentHeader() {
    if (!this.studentProfile) return;
    const nameEls = document.querySelectorAll('.student-badge-name');
    nameEls.forEach(el => el.textContent = this.studentProfile.name);

    const kpiCount = document.getElementById('kpi-enrolled-count');
    if (kpiCount) kpiCount.textContent = this.enrollments.length;
  }

  renderCourses(coursesToRender) {
    const grid = document.getElementById('course-grid');
    if (!grid) return;

    // Use direct DOM method to empty container
    while (grid.firstChild) {
      grid.removeChild(grid.firstChild);
    }

    if (coursesToRender.length === 0) {
      const emptyNotice = document.createElement('div');
      emptyNotice.style.cssText = 'grid-column: 1/-1; padding: 40px; text-align: center; color: var(--text-muted);';
      emptyNotice.textContent = 'No courses found matching your criteria.';
      grid.appendChild(emptyNotice);
      return;
    }

    const fragment = document.createDocumentFragment();
    coursesToRender.forEach(course => {
      const card = DomRenderer.createCourseCard(
        course,
        (c) => this.handleEnrollCourse(c),
        (c) => this.showCourseCurriculumModal(c)
      );
      fragment.appendChild(card);
    });

    grid.appendChild(fragment);
  }

  renderEnrolledCourses() {
    const container = document.getElementById('enrolled-courses-list');
    if (!container) return;

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    if (this.enrollments.length === 0) {
      const empty = document.createElement('div');
      empty.style.cssText = 'padding: 24px; text-align: center; color: var(--text-muted); background: var(--bg-surface); border-radius: var(--radius-md); border: 1px dashed var(--border-color);';
      empty.textContent = 'You have not enrolled in any courses yet. Browse the catalog to start learning!';
      container.appendChild(empty);
      return;
    }

    const fragment = document.createDocumentFragment();
    this.enrollments.forEach(enr => {
      const card = DomRenderer.createEnrolledCard(
        enr,
        (e) => this.openClassroomView(e),
        (e) => this.handleDropCourse(e)
      );
      fragment.appendChild(card);
    });

    container.appendChild(fragment);

    // Update KPI metrics
    let totalProgress = 0;
    this.enrollments.forEach(e => totalProgress += (e.progressPercentage || 0));
    const avg = this.enrollments.length > 0 ? Math.round(totalProgress / this.enrollments.length) : 0;

    const avgEl = document.getElementById('kpi-avg-progress');
    if (avgEl) avgEl.textContent = `${avg}%`;

    const countEl = document.getElementById('kpi-enrolled-count');
    if (countEl) countEl.textContent = this.enrollments.length;
  }

  filterCoursesByCategory(cat) {
    this.selectedCategory = cat;
    if (cat === 'All') {
      this.renderCourses(this.courses);
    } else {
      const filtered = this.courses.filter(c => c.category === cat);
      this.renderCourses(filtered);
    }
  }

  filterCoursesBySearch(query) {
    if (!query) {
      this.filterCoursesByCategory(this.selectedCategory);
      return;
    }
    const q = query.toLowerCase();
    const filtered = this.courses.filter(c => 
      c.title.toLowerCase().includes(q) || 
      c.description.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q)
    );
    this.renderCourses(filtered);
  }

  async handleEnrollCourse(course) {
    try {
      const res = await this.service.enrollInCourse(course.id);
      if (res.success) {
        this.showToast(`Successfully enrolled in "${course.title}"!`, 'success');
        // Refresh enrollments
        const enrollmentsRes = await this.service.fetchEnrollments();
        this.enrollments = enrollmentsRes.data || [];
        this.renderEnrolledCourses();
        this.updateStudentHeader();
      }
    } catch (err) {
      this.showToast(err.message, 'error');
    }
  }

  async handleDropCourse(enrollment) {
    const confirmed = window.confirm(`Are you sure you want to drop this course?`);
    if (!confirmed) return;

    try {
      const res = await this.service.dropEnrollment(enrollment.id);
      if (res.success) {
        this.showToast('Course enrollment successfully removed.', 'success');
        this.enrollments = this.enrollments.filter(e => e.id !== enrollment.id);
        this.renderEnrolledCourses();
        this.updateStudentHeader();
      }
    } catch (err) {
      this.showToast(err.message, 'error');
    }
  }

  openClassroomView(enrollment) {
    const course = enrollment.course;
    if (!course) return;

    this.activeCourse = course;
    this.switchView('view-classroom');

    // Update Classroom UI
    document.getElementById('classroom-course-title').textContent = course.title;
    document.getElementById('classroom-course-cat').textContent = `${course.category} • ${course.level}`;

    // Render modules and lessons in sidebar
    this.renderClassroomModules(course, enrollment);

    // Pick first lesson
    if (course.modules && course.modules[0] && course.modules[0].lessons && course.modules[0].lessons[0]) {
      this.selectLesson(course.modules[0].lessons[0], enrollment);
    }
  }

  renderClassroomModules(course, enrollment) {
    const container = document.getElementById('classroom-modules-list');
    if (!container) return;

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    const completed = new Set(enrollment.completedLessons || []);
    const fragment = document.createDocumentFragment();

    (course.modules || []).forEach((mod, modIdx) => {
      const modGroup = document.createElement('div');
      modGroup.className = 'module-group';

      const header = document.createElement('div');
      header.className = 'module-header';
      header.innerHTML = `
        <span>${mod.title}</span>
        <span class="module-toggle-icon">▼</span>
      `;

      const lessonsList = document.createElement('ul');
      lessonsList.className = 'lessons-list';

      (mod.lessons || []).forEach((les, lesIdx) => {
        const item = document.createElement('li');
        item.className = 'lesson-list-item';
        item.dataset.lessonId = les.lessonId;

        const isDone = completed.has(les.lessonId);
        item.innerHTML = `
          <span>${les.title} (${les.duration})</span>
          <span class="lesson-check-icon">${isDone ? '✓' : '○'}</span>
        `;

        item.addEventListener('click', () => {
          document.querySelectorAll('.lesson-list-item').forEach(li => li.classList.remove('active'));
          item.classList.add('active');
          this.selectLesson(les, enrollment);
        });

        if (modIdx === 0 && lesIdx === 0) {
          item.classList.add('active');
        }

        lessonsList.appendChild(item);
      });

      modGroup.appendChild(header);
      modGroup.appendChild(lessonsList);
      fragment.appendChild(modGroup);
    });

    container.appendChild(fragment);
  }

  selectLesson(lesson, enrollment) {
    this.activeLesson = lesson;
    document.getElementById('lesson-title-display').textContent = lesson.title;
    document.getElementById('lesson-summary-display').textContent = lesson.summary || 'In this lecture session, we explore key structural implementations and architectural patterns.';

    const videoEl = document.getElementById('lesson-video-player');
    if (videoEl && lesson.videoUrl) {
      videoEl.src = lesson.videoUrl;
    }

    const completed = (enrollment.completedLessons || []).includes(lesson.lessonId);
    const completeBtn = document.getElementById('btn-complete-lesson');
    if (completeBtn) {
      completeBtn.innerHTML = completed ? '✓ Lesson Completed' : 'Mark as Completed';
      completeBtn.style.opacity = completed ? '0.7' : '1.0';
    }
  }

  async handleCompleteLesson() {
    if (!this.activeCourse || !this.activeLesson) return;

    try {
      const res = await this.service.updateLessonProgress(this.activeCourse.id, this.activeLesson.lessonId);
      if (res.success) {
        this.showToast(res.message, 'success');

        // Update local enrollment record
        const enrIdx = this.enrollments.findIndex(e => e.courseId === this.activeCourse.id);
        if (enrIdx !== -1) {
          this.enrollments[enrIdx] = { ...this.enrollments[enrIdx], ...res.data };
          this.renderClassroomModules(this.activeCourse, this.enrollments[enrIdx]);
          this.selectLesson(this.activeLesson, this.enrollments[enrIdx]);
        }
      }
    } catch (err) {
      this.showToast(err.message, 'error');
    }
  }

  openQuizDialog() {
    const modal = document.getElementById('custom-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body-content');

    modalTitle.textContent = `Lesson Assessment: ${this.activeLesson ? this.activeLesson.title : 'Quiz'}`;
    modalBody.innerHTML = `
      <form id="quiz-form">
        <div style="margin-bottom:16px;">
          <p style="font-weight:600; font-size:14px; margin-bottom:8px;">1. What is the primary role of asynchronous AJAX communication in modern web apps?</p>
          <label style="display:block; margin-bottom:4px; font-size:13px;"><input type="radio" name="q1" value="a"> Forcing synchronous full-page reloads</label>
          <label style="display:block; margin-bottom:4px; font-size:13px;"><input type="radio" name="q1" value="b"> Exchanging JSON payloads in the background without refreshing</label>
          <label style="display:block; font-size:13px;"><input type="radio" name="q1" value="c"> Disabling client-side JavaScript execution</label>
        </div>

        <div style="margin-bottom:16px;">
          <p style="font-weight:600; font-size:14px; margin-bottom:8px;">2. Which HTTP method is semantically used for partial updates to a resource?</p>
          <label style="display:block; margin-bottom:4px; font-size:13px;"><input type="radio" name="q2" value="a"> GET</label>
          <label style="display:block; margin-bottom:4px; font-size:13px;"><input type="radio" name="q2" value="b"> POST</label>
          <label style="display:block; font-size:13px;"><input type="radio" name="q2" value="c"> PATCH</label>
        </div>

        <div style="margin-bottom:16px;">
          <p style="font-weight:600; font-size:14px; margin-bottom:8px;">3. What is the fundamental difference between XML DTD and XML Schema (XSD)?</p>
          <label style="display:block; margin-bottom:4px; font-size:13px;"><input type="radio" name="q3" value="a"> XSD is written in XML syntax and supports rich datatypes and ranges</label>
          <label style="display:block; font-size:13px;"><input type="radio" name="q3" value="b"> DTD supports object-oriented inheritance whereas XSD does not</label>
        </div>

        <div id="quiz-feedback-box" class="validation-output" style="margin-top:12px;"></div>

        <div style="margin-top:20px; display:flex; justify-content:flex-end; gap:10px;">
          <button type="button" class="btn-primary" id="btn-submit-quiz">Submit Assessment</button>
        </div>
      </form>
    `;

    modal.showModal();
  }

  showCourseCurriculumModal(course) {
    const modal = document.getElementById('custom-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body-content');

    modalTitle.textContent = `${course.title} - Academic Curriculum`;
    
    let modulesList = '';
    (course.modules || []).forEach(m => {
      let lessonsHtml = '';
      (m.lessons || []).forEach(l => {
        lessonsHtml += `<li style="font-size:13px; color:var(--text-muted); margin:4px 0 4px 18px;">${l.title} <em>(${l.duration})</em></li>`;
      });
      modulesList += `
        <div style="margin-bottom:12px; padding:12px; background:var(--bg-secondary); border-radius:8px;">
          <strong style="font-size:14px; color:var(--text-main);">${m.title}</strong>
          <ul>${lessonsHtml}</ul>
        </div>
      `;
    });

    modalBody.innerHTML = `
      <div style="margin-bottom:16px;">
        <span style="font-size:12px; font-weight:700; color:var(--primary); text-transform:uppercase;">${course.category} • ${course.level}</span>
        <p style="font-size:14px; color:var(--text-main); margin-top:6px;">${course.description}</p>
      </div>
      <h4 style="font-size:14px; margin-bottom:8px;">Accredited Modules:</h4>
      ${modulesList}
    `;

    modal.showModal();
  }

  async loadAcademicRecords() {
    try {
      const res = await fetch('/api/academic/verify/STU-2026-8941');
      const data = await res.json();
      if (data.success) {
        const record = data.data;
        const standingEl = document.getElementById('academic-standing-badge');
        if (standingEl) standingEl.textContent = record.academicStanding;
        const gpaEl = document.getElementById('academic-gpa-display');
        if (gpaEl) gpaEl.textContent = `${record.cumulativeGpa} / 4.00`;
        const codeEl = document.getElementById('academic-cert-code');
        if (codeEl) codeEl.textContent = record.verificationCode;
      }
    } catch (err) {
      console.error('Academic records load notice:', err);
    }
  }

  populateProfileForm() {
    if (!this.studentProfile) return;
    const nameInput = document.getElementById('profile-name-input');
    const emailInput = document.getElementById('profile-email-input');
    const majorInput = document.getElementById('profile-major-input');
    const bioInput = document.getElementById('profile-bio-input');
    const goalsInput = document.getElementById('profile-goals-input');

    if (nameInput) nameInput.value = this.studentProfile.name || '';
    if (emailInput) emailInput.value = this.studentProfile.email || '';
    if (majorInput) majorInput.value = this.studentProfile.major || '';
    if (bioInput) bioInput.value = this.studentProfile.bio || '';
    if (goalsInput) goalsInput.value = this.studentProfile.learningGoals || '';
  }

  showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <span>${type === 'success' ? '✓' : type === 'error' ? '⚠' : 'ℹ'}</span>
      <div>${message}</div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }
}

// Global bootstrap
document.addEventListener('DOMContentLoaded', () => {
  window.portalApp = new StudentPortalApp();
});
