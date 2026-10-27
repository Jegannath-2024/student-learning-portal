/**
 * Student Learning & Faculty Portal - Core Application Architecture
 * Object-Oriented JavaScript, Role-Based Access Control (Student vs Faculty),
 * HTML DOM Methods, Video Preview & Upload Engine, HTML5 Canvas 2D Analytics
 */

// 1. Course Service Object - Encapsulates all REST API calls
class CourseService {
  constructor(getHeadersFn) {
    this.getHeaders = getHeadersFn || (() => ({ 'Content-Type': 'application/json' }));
  }

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

  async fetchFacultyCourses() {
    const res = await fetch('/api/faculty/courses', {
      headers: this.getHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch faculty courses');
    return await res.json();
  }

  async createCourse(courseData) {
    const res = await fetch('/api/courses', {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(courseData)
    });
    if (!res.ok) throw new Error('Failed to create course');
    return await res.json();
  }

  async deleteCourse(courseId) {
    const res = await fetch(`/api/courses/${courseId}`, {
      method: 'DELETE',
      headers: this.getHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete course');
    return await res.json();
  }

  async addModule(courseId, moduleData) {
    const res = await fetch(`/api/courses/${courseId}/modules`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(moduleData)
    });
    if (!res.ok) throw new Error('Failed to add module');
    return await res.json();
  }

  async updateLessonVideo(courseId, moduleId, lessonId, videoUrl, summary) {
    const res = await fetch(`/api/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/video`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify({ videoUrl, summary })
    });
    if (!res.ok) throw new Error('Failed to update lesson video');
    return await res.json();
  }

  async fetchEnrollments() {
    const res = await fetch('/api/enrollments', {
      headers: this.getHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch enrollments');
    return await res.json();
  }

  async enrollInCourse(courseId) {
    const res = await fetch('/api/enrollments', {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ courseId })
    });
    if (!res.ok) throw new Error('Enrollment request failed');
    return await res.json();
  }

  async updateLessonProgress(courseId, lessonId) {
    const res = await fetch(`/api/courses/${courseId}/progress`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify({ lessonId })
    });
    if (!res.ok) throw new Error('Progress update failed');
    return await res.json();
  }

  async dropEnrollment(enrollmentId) {
    const res = await fetch(`/api/enrollments/${enrollmentId}`, {
      method: 'DELETE',
      headers: this.getHeaders()
    });
    if (!res.ok) throw new Error('Failed to drop enrollment');
    return await res.json();
  }

  async fetchUserProfile() {
    const res = await fetch('/api/student/profile', {
      headers: this.getHeaders()
    });
    if (!res.ok) throw new Error('Failed to load profile');
    return await res.json();
  }

  async updateUserProfile(profileData) {
    const res = await fetch('/api/student/profile', {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(profileData)
    });
    if (!res.ok) throw new Error('Failed to update profile');
    return await res.json();
  }

  async login(email, password, role) {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role })
    });
    return await res.json();
  }

  async register(userData) {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return await res.json();
  }

  async fetchFacultyStats(email) {
    const res = await fetch(`/api/faculty/stats?email=${encodeURIComponent(email || '')}`, {
      headers: this.getHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch faculty stats');
    return await res.json();
  }

  async fetchFacultyStudents() {
    const res = await fetch('/api/faculty/students', {
      headers: this.getHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch faculty students roster');
    return await res.json();
  }

  async updateFacultyStudent(enrollmentId, updates) {
    const res = await fetch(`/api/faculty/students/${enrollmentId}`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify(updates)
    });
    if (!res.ok) throw new Error('Failed to update student enrollment');
    return await res.json();
  }

  async removeFacultyStudent(enrollmentId) {
    const res = await fetch(`/api/faculty/students/${enrollmentId}`, {
      method: 'DELETE',
      headers: this.getHeaders()
    });
    if (!res.ok) throw new Error('Failed to drop student enrollment');
    return await res.json();
  }

  async fetchModuleQuiz(courseId, moduleId) {
    const res = await fetch(`/api/courses/${courseId}/modules/${moduleId}/quiz`, {
      headers: this.getHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch module quiz');
    return await res.json();
  }

  async saveModuleQuiz(courseId, moduleId, quizData) {
    const res = await fetch(`/api/courses/${courseId}/modules/${moduleId}/quiz`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(quizData)
    });
    if (!res.ok) throw new Error('Failed to save module quiz');
    return await res.json();
  }
}

// 2. HTML5 Canvas Learning Analytics Engine
class LearningAnalyticsEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.cachedData = null;
  }

  drawStudyAnalytics(studyData) {
    if (!this.canvas || !this.ctx) return;

    if (studyData !== undefined) {
      this.cachedData = studyData;
    } else if (!this.cachedData) {
      this.cachedData = [0, 0, 0, 0, 0, 0, 0];
    }
    const data = this.cachedData;

    const ctx = this.ctx;
    const width = this.canvas.width = this.canvas.parentElement.clientWidth || 600;
    const height = this.canvas.height = 240;

    ctx.clearRect(0, 0, width, height);

    const padding = 40;
    const chartW = width - padding * 2;
    const chartH = height - padding * 2;
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    // Draw Background Grid
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padding + (chartH / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();

      ctx.fillStyle = '#94a3b8';
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(`${(8 - i * 2)}h`, padding - 8, y + 4);
    }

    const points = [];
    const step = chartW / (days.length - 1);
    const maxVal = 8.0;

    for (let i = 0; i < days.length; i++) {
      const x = padding + i * step;
      const y = padding + chartH - (data[i] / maxVal) * chartH;
      points.push({ x, y, val: data[i] });

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

    // Draw Smooth Line
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

    // Points
    points.forEach((pt) => {
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.strokeStyle = '#2563eb';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${pt.val}h`, pt.x, pt.y - 10);
    });
  }
}

// 3. DOM Renderer - Centralizes direct HTML DOM tree creation
class DomRenderer {
  static createCourseCard(course, currentUser, onEnroll, onViewDetails) {
    const card = document.createElement('article');
    card.className = 'course-card';
    card.dataset.courseId = course.id;

    // Card Thumbnail Container
    const thumbWrap = document.createElement('figure');
    thumbWrap.className = 'course-thumb-wrap';

    const img = document.createElement('img');
    img.className = 'course-thumb';
    img.src = course.thumbnail || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80';
    img.alt = course.title;
    img.loading = 'lazy';

    const levelTag = document.createElement('span');
    levelTag.className = 'course-level-tag';
    levelTag.textContent = course.level || 'Beginner';

    const creditsTag = document.createElement('span');
    creditsTag.className = 'course-credits-tag';
    creditsTag.textContent = `${course.credits || 3} Credits`;

    thumbWrap.appendChild(img);
    thumbWrap.appendChild(levelTag);
    thumbWrap.appendChild(creditsTag);

    // Card Body
    const body = document.createElement('div');
    body.className = 'course-card-body';

    const category = document.createElement('div');
    category.className = 'course-card-category';
    category.textContent = course.category || 'Computer Science';

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
    instAvatar.src = course.instructor?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80';
    instAvatar.alt = course.instructor?.name || 'Faculty';

    const instInfo = document.createElement('div');
    instInfo.className = 'instructor-info';

    const instName = document.createElement('span');
    instName.className = 'instructor-name';
    instName.textContent = course.instructor?.name || 'Faculty Instructor';

    const instTitle = document.createElement('span');
    instTitle.className = 'instructor-title';
    instTitle.textContent = course.instructor?.title || 'Academic Faculty';

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
      <span class="metric-item">★ ${course.rating || 4.9}</span>
      <span class="metric-item">👥 ${course.studentsCount !== undefined ? course.studentsCount : 0}</span>
      <span class="metric-item">⏳ ${course.duration || '8 Weeks'}</span>
    `;

    const actionsWrap = document.createElement('div');
    actionsWrap.style.display = 'flex';
    actionsWrap.style.gap = '8px';

    const btnDetails = document.createElement('button');
    btnDetails.className = 'btn-secondary';
    btnDetails.textContent = 'Curriculum';
    btnDetails.addEventListener('click', () => onViewDetails(course));
    actionsWrap.appendChild(btnDetails);

    if (!currentUser || currentUser.role === 'student') {
      const btnEnroll = document.createElement('button');
      btnEnroll.className = 'btn-primary';
      btnEnroll.textContent = 'Enroll';
      btnEnroll.addEventListener('click', () => onEnroll(course));
      actionsWrap.appendChild(btnEnroll);
    } else {
      const btnPreview = document.createElement('button');
      btnPreview.className = 'btn-primary';
      btnPreview.textContent = 'Classroom';
      btnPreview.addEventListener('click', () => window.portalApp.openClassroomViewDirect(course));
      actionsWrap.appendChild(btnPreview);
    }

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
      <p>${course.category || 'Computer Science'} • Instructor: ${course.instructor?.name || 'Faculty'}</p>
    `;

    info.appendChild(img);
    info.appendChild(details);

    // HTML5 Progress Element (Safeguarded against non-finite values)
    const progressWrap = document.createElement('div');
    progressWrap.className = 'enrolled-progress-wrap';

    const rawPct = Number(enrollment.progressPercentage);
    const validProgress = Number.isFinite(rawPct) ? Math.max(0, Math.min(100, Math.round(rawPct))) : 0;

    const progressHeader = document.createElement('div');
    progressHeader.className = 'enrolled-progress-header';
    progressHeader.innerHTML = `
      <span>Overall Mastery</span>
      <strong>${validProgress}%</strong>
    `;

    const progressEl = document.createElement('progress');
    progressEl.max = 100;
    progressEl.value = validProgress;

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

  static createFacultyCourseItem(course, onAddModule, onDelete, onPreview, onUploadVideo, onPrepareQuiz) {
    const item = document.createElement('div');
    item.className = 'faculty-course-item';

    const meta = document.createElement('div');
    meta.className = 'faculty-course-meta';

    const img = document.createElement('img');
    img.src = course.thumbnail || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=150&q=80';
    img.alt = course.title;

    const textInfo = document.createElement('div');
    const moduleCount = course.modules ? course.modules.length : 0;
    let lessonCount = 0;
    if (course.modules) {
      course.modules.forEach(m => lessonCount += (m.lessons ? m.lessons.length : 0));
    }

    textInfo.innerHTML = `
      <div style="display:flex; gap:8px; align-items:center; margin-bottom:4px;">
        <span style="font-size:11px; font-weight:700; color:var(--primary); text-transform:uppercase;">${course.category} • ${course.level}</span>
        <span style="font-size:11px; background:var(--bg-secondary); padding:2px 8px; border-radius:4px;">${course.credits} Credits</span>
      </div>
      <h4 style="font-size:17px; font-weight:700; color:var(--text-main); margin-bottom:4px;">${course.title}</h4>
      <p style="font-size:13px; color:var(--text-muted); margin-bottom:6px;">${course.description}</p>
      <div style="font-size:12px; color:var(--text-light);">
        📁 <strong>${moduleCount}</strong> Modules • 📖 <strong>${lessonCount}</strong> Lessons • 👥 <strong>${course.studentsCount || 0}</strong> Students Enrolled
      </div>
    `;

    meta.appendChild(img);
    meta.appendChild(textInfo);

    const btnGroup = document.createElement('div');
    btnGroup.className = 'faculty-btn-group';

    const btnVideo = document.createElement('button');
    btnVideo.className = 'btn-primary';
    btnVideo.style.cssText = 'padding:8px 14px; font-size:12px; background:linear-gradient(135deg, #4f46e5, #7c3aed);';
    btnVideo.textContent = '📹 Upload / Preview Video';
    btnVideo.addEventListener('click', () => onUploadVideo(course));

    const btnQuiz = document.createElement('button');
    btnQuiz.className = 'btn-secondary';
    btnQuiz.style.cssText = 'padding:8px 14px; font-size:12px; border-color:#059669; color:#059669; font-weight:600;';
    btnQuiz.textContent = '📝 Prepare Quiz';
    btnQuiz.addEventListener('click', () => onPrepareQuiz(course));

    const btnClassroom = document.createElement('button');
    btnClassroom.className = 'btn-secondary';
    btnClassroom.textContent = 'View Classroom';
    btnClassroom.addEventListener('click', () => onPreview(course));

    const btnAddMod = document.createElement('button');
    btnAddMod.className = 'btn-manage-syllabus';
    btnAddMod.textContent = '➕ Add Module';
    btnAddMod.addEventListener('click', () => onAddModule(course));

    const btnDel = document.createElement('button');
    btnDel.className = 'btn-delete-course';
    btnDel.textContent = '🗑️ Delete';
    btnDel.addEventListener('click', () => onDelete(course));

    btnGroup.appendChild(btnVideo);
    btnGroup.appendChild(btnQuiz);
    btnGroup.appendChild(btnClassroom);
    btnGroup.appendChild(btnAddMod);
    btnGroup.appendChild(btnDel);

    item.appendChild(meta);
    item.appendChild(btnGroup);

    return item;
  }
}

// 4. Main Portal Application Controller
class StudentPortalApp {
  constructor() {
    this.currentUser = this.loadStoredUser();
    this.service = new CourseService(() => ({
      'Content-Type': 'application/json',
      'x-user-id': this.currentUser ? this.currentUser.id : ''
    }));
    this.analytics = new LearningAnalyticsEngine('analyticsCanvas');
    this.courses = [];
    this.enrollments = [];
    this.activeCourse = null;
    this.activeLesson = null;
    this.selectedCategory = 'All';

    this.init();
  }

  loadStoredUser() {
    try {
      const stored = localStorage.getItem('edusphere_session');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.id && parsed.role) {
          return parsed;
        }
      }
    } catch (e) {}
    return null;
  }

  saveSession(user) {
    this.currentUser = user;
    localStorage.setItem('edusphere_session', JSON.stringify(user));
    this.service = new CourseService(() => ({
      'Content-Type': 'application/json',
      'x-user-id': this.currentUser ? this.currentUser.id : ''
    }));
    this.updateUserUI();
  }

  handleSignOut() {
    localStorage.removeItem('edusphere_session');
    this.currentUser = null;
    this.enrollments = [];
    this.updateUserUI();
    this.showToast('You have signed out of your portal session.', 'info');
    this.switchView('view-auth');
  }

  async init() {
    this.bindEvents();
    this.initTheme();
    this.updateUserUI();

    if (this.currentUser) {
      this.switchView(this.currentUser.role === 'faculty' ? 'view-faculty' : 'view-dashboard');
      await this.loadInitialData();
    } else {
      this.switchView('view-auth');
      try {
        const coursesRes = await this.service.fetchCourses();
        this.courses = coursesRes.data || [];
        this.renderCourses(this.courses);
      } catch (e) {}
    }
  }

  updateUserUI() {
    const user = this.currentUser;
    const headerAuth = document.getElementById('header-auth-group');
    const headerUnauth = document.getElementById('header-unauth-group');

    // Context-Aware navigation elements
    const navAuth = document.getElementById('nav-item-auth');
    const navDashboard = document.getElementById('nav-item-dashboard');
    const navFaculty = document.getElementById('nav-item-faculty');
    const navAcademic = document.getElementById('nav-item-academic');
    const navProfile = document.getElementById('nav-item-profile');
    const catalogBanner = document.getElementById('catalog-faculty-banner');
    const classroomFacultyWrap = document.getElementById('classroom-faculty-add-module-wrap');
    const schemaCard = document.getElementById('schema-validation-card');
    const curriculumGrid = document.querySelector('.curriculum-grid');

    if (!user) {
      // Unauthenticated State: No dummy credentials or avatar
      if (headerAuth) headerAuth.style.display = 'none';
      if (headerUnauth) headerUnauth.style.display = 'flex';

      if (navAuth) navAuth.style.display = 'block';
      if (navDashboard) navDashboard.style.display = 'none';
      if (navFaculty) navFaculty.style.display = 'none';
      if (navAcademic) navAcademic.style.display = 'none';
      if (navProfile) navProfile.style.display = 'none';
      if (catalogBanner) catalogBanner.style.display = 'none';
      if (classroomFacultyWrap) classroomFacultyWrap.style.display = 'none';
      if (schemaCard) schemaCard.style.display = 'none';
      if (curriculumGrid) curriculumGrid.style.gridTemplateColumns = '1fr';

      // Clear profile form inputs & displayed identity
      const nameInput = document.getElementById('profile-name-input');
      const emailInput = document.getElementById('profile-email-input');
      const displayName = document.getElementById('display-student-name');
      const displayMajor = document.getElementById('display-student-major');
      const displayId = document.getElementById('display-user-id');
      const cardAvatar = document.getElementById('profile-card-avatar');
      if (nameInput) nameInput.value = '';
      if (emailInput) emailInput.value = '';
      if (displayName) displayName.textContent = 'Not Signed In';
      if (displayMajor) displayMajor.textContent = '';
      if (displayId) displayId.textContent = '';
      if (cardAvatar) {
        cardAvatar.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="%2394a3b8"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>';
      }

      this.populateProfileForm();
      return;
    }

    // Authenticated State
    if (headerAuth) headerAuth.style.display = 'flex';
    if (headerUnauth) headerUnauth.style.display = 'none';
    if (navAuth) navAuth.style.display = 'none';

    const isFaculty = user.role === 'faculty';

    // Header identity
    const nameEl = document.getElementById('header-user-name');
    if (nameEl) nameEl.textContent = user.name;

    const avatarEl = document.getElementById('header-avatar');
    if (avatarEl) avatarEl.src = user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80';

    const badgeEl = document.getElementById('header-role-badge');
    if (badgeEl) {
      badgeEl.textContent = isFaculty ? 'Faculty' : 'Student';
      badgeEl.className = `user-role-chip ${isFaculty ? 'role-faculty' : 'role-student'}`;
    }

    const switchLabel = document.getElementById('quick-switch-label');
    if (switchLabel) {
      switchLabel.textContent = isFaculty ? 'Switch to Student' : 'Switch to Faculty';
    }

    if (isFaculty) {
      if (navDashboard) navDashboard.style.display = 'none';
      if (navAcademic) navAcademic.style.display = 'none'; // REMOVE TRANSCRIPTS FROM FACULTY LOGIN
      if (navFaculty) {
        navFaculty.style.display = 'block';
        navFaculty.querySelector('button').style.display = 'flex';
      }
      if (navProfile) navProfile.style.display = 'block';
      if (catalogBanner) catalogBanner.style.display = 'block';
      if (classroomFacultyWrap) classroomFacultyWrap.style.display = 'block';
      if (schemaCard) schemaCard.style.display = 'block';
      if (curriculumGrid) curriculumGrid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(340px, 1fr))';
    } else {
      if (navDashboard) navDashboard.style.display = 'block';
      if (navAcademic) navAcademic.style.display = 'block'; // Show Transcripts only for student
      if (navFaculty) navFaculty.style.display = 'none';
      if (navProfile) navProfile.style.display = 'block';
      if (catalogBanner) catalogBanner.style.display = 'none';
      if (classroomFacultyWrap) classroomFacultyWrap.style.display = 'none';
      if (schemaCard) schemaCard.style.display = 'none';
      if (curriculumGrid) curriculumGrid.style.gridTemplateColumns = '1fr';
    }

    // Dynamically update degree certificate & transcript download links with current student name
    const certLink = document.getElementById('link-view-certificate');
    if (certLink) {
      const studentName = encodeURIComponent(user.name || '');
      const userId = encodeURIComponent(user.id || '');
      certLink.href = `/academic-service/web/certificate.jsp?name=${studentName}&userId=${userId}`;
    }

    const transcriptLink = document.getElementById('link-view-transcript');
    if (transcriptLink) {
      const studentName = encodeURIComponent(user.name || '');
      const userId = encodeURIComponent(user.id || '');
      transcriptLink.href = `/academic-service/web/transcript.jsp?studentId=${userId}&name=${studentName}&userId=${userId}`;
    }

    this.populateProfileForm();
  }

  bindEvents() {
    // Brand home click
    const brandLink = document.getElementById('brand-home-link');
    if (brandLink) {
      brandLink.addEventListener('click', (e) => {
        e.preventDefault();
        this.switchView('view-catalog');
      });
    }

    // Nav tabs
    const tabs = document.querySelectorAll('.nav-tab-btn');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const targetView = tab.dataset.view;
        this.switchView(targetView);
      });
    });

    // Quick Role Switcher
    const quickSwitchBtn = document.getElementById('btn-quick-switch-role');
    if (quickSwitchBtn) {
      quickSwitchBtn.addEventListener('click', () => {
        if (this.currentUser.role === 'student') {
          this.switchDemoAccount('faculty');
        } else {
          this.switchDemoAccount('student');
        }
      });
    }

    // Profile pill click
    const profilePill = document.getElementById('user-profile-pill');
    if (profilePill) {
      profilePill.addEventListener('click', () => {
        this.switchView('view-profile');
      });
    }

    // Auth Modal open/close
    const openAuthBtn = document.getElementById('btn-open-auth-modal');
    const authModal = document.getElementById('auth-modal');
    const closeAuthBtn = document.getElementById('auth-modal-close-btn');

    if (openAuthBtn && authModal) openAuthBtn.addEventListener('click', () => authModal.showModal());
    if (closeAuthBtn && authModal) closeAuthBtn.addEventListener('click', () => authModal.close());

    // Auth Tabs switching
    const authTabs = document.querySelectorAll('.auth-nav-tab');
    authTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        authTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const targetTabId = tab.dataset.authTab;
        document.querySelectorAll('.auth-form-tab').forEach(f => f.style.display = 'none');
        if (targetTabId === 'tab-login-student') {
          document.getElementById('form-login-student').style.display = 'block';
        } else if (targetTabId === 'tab-login-faculty') {
          document.getElementById('form-login-faculty').style.display = 'block';
        } else if (targetTabId === 'tab-register') {
          document.getElementById('form-register').style.display = 'block';
        }
      });
    });

    // Quick demo login buttons inside Auth Modal
    const btnDemoStudent = document.getElementById('btn-quick-login-student');
    const btnDemoFaculty = document.getElementById('btn-quick-login-faculty');
    if (btnDemoStudent) btnDemoStudent.addEventListener('click', () => this.switchDemoAccount('student'));
    if (btnDemoFaculty) btnDemoFaculty.addEventListener('click', () => this.switchDemoAccount('faculty'));

    // Student Login Form Submit
    const formLoginStudent = document.getElementById('form-login-student');
    if (formLoginStudent) {
      formLoginStudent.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-student-email').value;
        const password = document.getElementById('login-student-password').value;
        await this.handleLogin(email, password, 'student');
      });
    }

    // Faculty Login Form Submit
    const formLoginFaculty = document.getElementById('form-login-faculty');
    if (formLoginFaculty) {
      formLoginFaculty.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-faculty-email').value;
        const password = document.getElementById('login-faculty-password').value;
        await this.handleLogin(email, password, 'faculty');
      });
    }

    // Register Form Submit
    const formRegister = document.getElementById('form-register');
    if (formRegister) {
      formRegister.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('reg-name').value;
        const email = document.getElementById('reg-email').value;
        const role = document.getElementById('reg-role').value;
        const dept = document.getElementById('reg-dept').value;
        const password = document.getElementById('reg-password').value;

        try {
          const res = await this.service.register({ name, email, role, departmentOrMajor: dept, password });
          if (res.success) {
            this.showToast('Account registered successfully! Logging you in...', 'success');
            this.saveSession(res.user);
            if (authModal) authModal.close();
            await this.refreshAllData();
            this.switchView(role === 'faculty' ? 'view-faculty' : 'view-dashboard');
          } else {
            this.showToast(res.error || 'Registration failed', 'error');
          }
        } catch (err) {
          this.showToast(err.message, 'error');
        }
      });
    }

    // Logout from Profile
    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) {
      btnLogout.addEventListener('click', () => {
        this.handleSignOut();
      });
    }

    // Direct Header Sign Out
    const btnHeaderSignout = document.getElementById('btn-header-signout');
    if (btnHeaderSignout) {
      btnHeaderSignout.addEventListener('click', () => {
        this.handleSignOut();
      });
    }

    // Header Login Button (Go to Dedicated Gateway)
    const btnHeaderLogin = document.getElementById('btn-header-login-page');
    if (btnHeaderLogin) {
      btnHeaderLogin.addEventListener('click', () => {
        this.switchView('view-auth');
      });
    }

    // ==========================================
    // Dedicated Authentication Gateway Listeners
    // ==========================================
    const gatewayTabs = document.querySelectorAll('.auth-gateway-tab-btn');
    gatewayTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        gatewayTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const target = tab.dataset.gatewayTab;
        document.querySelectorAll('.auth-gateway-panel').forEach(p => p.classList.remove('active'));
        if (target === 'tab-student') {
          const p = document.getElementById('panel-gateway-student');
          if (p) p.classList.add('active');
        } else if (target === 'tab-faculty') {
          const p = document.getElementById('panel-gateway-faculty');
          if (p) p.classList.add('active');
        } else if (target === 'tab-register') {
          const p = document.getElementById('panel-gateway-register');
          if (p) p.classList.add('active');
        }
      });
    });

    // Gateway Demo Quick-Fill Buttons
    const btnFillDemoStudent = document.getElementById('btn-fill-demo-student');
    if (btnFillDemoStudent) {
      btnFillDemoStudent.addEventListener('click', () => {
        const emailInput = document.getElementById('gateway-student-email');
        const passInput = document.getElementById('gateway-student-password');
        if (emailInput) emailInput.value = 'student@edusphere.edu';
        if (passInput) passInput.value = 'password123';
        this.showToast('Demo student credentials filled.', 'info');
      });
    }

    const btnFillDemoFaculty = document.getElementById('btn-fill-demo-faculty');
    if (btnFillDemoFaculty) {
      btnFillDemoFaculty.addEventListener('click', () => {
        const emailInput = document.getElementById('gateway-faculty-email');
        const passInput = document.getElementById('gateway-faculty-password');
        if (emailInput) emailInput.value = 'faculty@edusphere.edu';
        if (passInput) passInput.value = 'password123';
        this.showToast('Demo faculty credentials filled.', 'info');
      });
    }

    // Gateway Student Form Submit
    const formGatewayStudent = document.getElementById('gateway-form-student');
    if (formGatewayStudent) {
      formGatewayStudent.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('gateway-student-email').value.trim();
        const password = document.getElementById('gateway-student-password').value;
        await this.handleLogin(email, password, 'student');
      });
    }

    // Gateway Faculty Form Submit
    const formGatewayFaculty = document.getElementById('gateway-form-faculty');
    if (formGatewayFaculty) {
      formGatewayFaculty.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('gateway-faculty-email').value.trim();
        const password = document.getElementById('gateway-faculty-password').value;
        await this.handleLogin(email, password, 'faculty');
      });
    }

    // Gateway Register Form Submit
    const formGatewayRegister = document.getElementById('gateway-form-register');
    if (formGatewayRegister) {
      formGatewayRegister.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('gateway-reg-name').value.trim();
        const email = document.getElementById('gateway-reg-email').value.trim();
        const role = document.getElementById('gateway-reg-role').value;
        const dept = document.getElementById('gateway-reg-dept').value.trim();
        const password = document.getElementById('gateway-reg-password').value;

        try {
          const res = await this.service.register({ name, email, role, departmentOrMajor: dept, password });
          if (res.success) {
            this.showToast(`Account registered successfully! Welcome, ${res.user.name}.`, 'success');
            this.saveSession(res.user);
            await this.refreshAllData();
            this.switchView(role === 'faculty' ? 'view-faculty' : 'view-dashboard');
          } else {
            this.showToast(res.error || 'Registration failed', 'error');
          }
        } catch (err) {
          this.showToast(err.message, 'error');
        }
      });
    }

    // Course Creator Modal Open/Close
    const createModal = document.getElementById('course-create-modal');
    const btnOpenCreate = document.getElementById('btn-faculty-open-create-modal');
    const btnCatalogCreate = document.getElementById('btn-catalog-create-course');
    const btnCloseCreate = document.getElementById('course-create-modal-close');
    const btnCancelCreate = document.getElementById('btn-cancel-create-course');

    const openCourseModal = () => {
      if (createModal) createModal.showModal();
    };
    if (btnOpenCreate) btnOpenCreate.addEventListener('click', openCourseModal);
    if (btnCatalogCreate) btnCatalogCreate.addEventListener('click', openCourseModal);
    if (btnCloseCreate) btnCloseCreate.addEventListener('click', () => createModal.close());
    if (btnCancelCreate) btnCancelCreate.addEventListener('click', () => createModal.close());

    // Course Creator Form Submit
    const formCreateCourse = document.getElementById('form-create-course');
    if (formCreateCourse) {
      formCreateCourse.addEventListener('submit', async (e) => {
        e.preventDefault();
        const courseData = {
          title: document.getElementById('new-course-title').value,
          category: document.getElementById('new-course-category').value,
          level: document.getElementById('new-course-level').value,
          credits: document.getElementById('new-course-credits').value,
          duration: document.getElementById('new-course-duration').value,
          description: document.getElementById('new-course-desc').value,
          thumbnail: document.getElementById('new-course-thumb').value || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80',
          instructorName: this.currentUser.name
        };

        try {
          const res = await this.service.createCourse(courseData);
          if (res.success) {
            this.showToast(`Course "${courseData.title}" published!`, 'success');
            if (createModal) createModal.close();
            formCreateCourse.reset();
            await this.refreshAllData();
            this.switchView('view-faculty');
          }
        } catch (err) {
          this.showToast(err.message, 'error');
        }
      });
    }

    // Module Creator Modal Open/Close
    const moduleModal = document.getElementById('module-create-modal');
    const btnCloseMod = document.getElementById('module-create-modal-close');
    const btnCancelMod = document.getElementById('btn-cancel-add-module');
    const btnClassroomAddMod = document.getElementById('btn-classroom-add-module');

    if (btnCloseMod && moduleModal) btnCloseMod.addEventListener('click', () => moduleModal.close());
    if (btnCancelMod && moduleModal) btnCancelMod.addEventListener('click', () => moduleModal.close());
    if (btnClassroomAddMod && moduleModal) {
      btnClassroomAddMod.addEventListener('click', () => {
        if (this.activeCourse) {
          this.openAddModuleModal(this.activeCourse);
        }
      });
    }

    // Module Creator Form Submit
    const formAddModule = document.getElementById('form-add-module');
    if (formAddModule) {
      formAddModule.addEventListener('submit', async (e) => {
        e.preventDefault();
        const courseId = document.getElementById('add-module-course-id').value;
        const moduleData = {
          title: document.getElementById('new-module-title').value,
          lessonTitle: document.getElementById('new-lesson-title').value,
          duration: document.getElementById('new-lesson-duration').value,
          videoUrl: document.getElementById('new-lesson-video').value,
          summary: document.getElementById('new-lesson-summary').value
        };

        try {
          const res = await this.service.addModule(courseId, moduleData);
          if (res.success) {
            this.showToast('New module & lesson added to course syllabus!', 'success');
            if (moduleModal) moduleModal.close();
            formAddModule.reset();
            await this.refreshAllData();
            if (this.activeCourse && this.activeCourse.id === courseId) {
              const updated = await this.service.fetchCourseById(courseId);
              this.activeCourse = updated.data;
              this.renderClassroomModules(this.activeCourse, { completedLessons: [] });
            }
          }
        } catch (err) {
          this.showToast(err.message, 'error');
        }
      });
    }

    // Video Upload & Preview Modal Handlers
    const uploadModal = document.getElementById('video-upload-modal');
    const closeUploadBtn = document.getElementById('video-upload-modal-close');
    const cancelUploadBtn = document.getElementById('btn-cancel-upload-video');
    const btnPreviewVideo = document.getElementById('btn-preview-video');
    const videoUrlInput = document.getElementById('video-url-input');
    const videoFilePicker = document.getElementById('video-file-picker');
    const videoPreviewBox = document.getElementById('video-preview-box');
    const videoPlayer = document.getElementById('video-modal-preview-player');
    const videoStatus = document.getElementById('video-preview-status');
    const formUploadVideo = document.getElementById('form-upload-video');

    if (closeUploadBtn && uploadModal) {
      closeUploadBtn.addEventListener('click', () => {
        if (videoPlayer) videoPlayer.pause();
        uploadModal.close();
      });
    }
    if (cancelUploadBtn && uploadModal) {
      cancelUploadBtn.addEventListener('click', () => {
        if (videoPlayer) videoPlayer.pause();
        uploadModal.close();
      });
    }

    if (btnPreviewVideo && videoUrlInput && videoPlayer) {
      btnPreviewVideo.addEventListener('click', () => {
        const url = videoUrlInput.value.trim();
        if (!url) {
          this.showToast('Please enter a video URL to preview.', 'error');
          return;
        }
        videoPlayer.src = url;
        videoPreviewBox.style.display = 'block';
        videoStatus.textContent = 'Loading video stream...';
        videoPlayer.oncanplay = () => {
          videoStatus.textContent = '✓ Video verified & ready to publish!';
        };
        videoPlayer.onerror = () => {
          videoStatus.textContent = '⚠️ Could not load video URL. Check link.';
        };
        videoPlayer.play().catch(() => {});
      });
    }

    if (videoFilePicker && videoPlayer && videoUrlInput) {
      videoFilePicker.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const blobUrl = URL.createObjectURL(file);
          videoUrlInput.value = blobUrl;
          videoPlayer.src = blobUrl;
          videoPreviewBox.style.display = 'block';
          videoStatus.textContent = `✓ Local file preview loaded: ${file.name}`;
          videoPlayer.play().catch(() => {});
        }
      });
    }

    if (formUploadVideo) {
      formUploadVideo.addEventListener('submit', async (e) => {
        e.preventDefault();
        const courseId = document.getElementById('video-course-id').value;
        const moduleId = document.getElementById('video-module-id').value;
        const lessonId = document.getElementById('video-lesson-id').value;
        const videoUrl = document.getElementById('video-url-input').value;
        const summary = document.getElementById('video-lesson-summary-input').value;

        try {
          const res = await this.service.updateLessonVideo(courseId, moduleId, lessonId, videoUrl, summary);
          if (res.success) {
            this.showToast('Video lecture verified and published to module!', 'success');
            if (videoPlayer) videoPlayer.pause();
            if (uploadModal) uploadModal.close();
            await this.refreshAllData();

            if (this.activeCourse && this.activeCourse.id === courseId) {
              const updated = await this.service.fetchCourseById(courseId);
              this.activeCourse = updated.data;
              this.renderClassroomModules(this.activeCourse, { completedLessons: [] });
            }
          }
        } catch (err) {
          this.showToast(err.message, 'error');
        }
      });
    }

    // Faculty Sync button
    const btnSyncFac = document.getElementById('btn-sync-faculty-data');
    if (btnSyncFac) {
      btnSyncFac.addEventListener('click', async () => {
        await this.refreshAllData();
        this.showToast('Faculty dashboard refreshed.', 'success');
      });
    }

    // Theme toggle
    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) themeBtn.addEventListener('click', () => this.toggleTheme());

    // General Modal close
    const modal = document.getElementById('custom-modal');
    const closeBtn = document.getElementById('modal-close-btn');
    if (closeBtn && modal) closeBtn.addEventListener('click', () => modal.close());

    // XML Download trigger
    const xmlDownloadBtn = document.getElementById('btn-download-xml');
    if (xmlDownloadBtn) {
      xmlDownloadBtn.addEventListener('click', () => window.xmlCurriculumManager.downloadXmlFile());
    }

    // Classroom back button
    const btnClassroomBack = document.getElementById('btn-classroom-back');
    if (btnClassroomBack) {
      btnClassroomBack.addEventListener('click', () => {
        this.switchView(this.currentUser.role === 'faculty' ? 'view-faculty' : 'view-dashboard');
      });
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

    // Quiz Builder modal events
    const quizModal = document.getElementById('quiz-builder-modal');
    const closeQuizBtn = document.getElementById('btn-close-quiz-builder');
    const cancelQuizBtn = document.getElementById('btn-cancel-quiz-builder');
    const addQBtn = document.getElementById('btn-add-quiz-question');
    const formQuizBuilder = document.getElementById('form-quiz-builder');

    if (closeQuizBtn && quizModal) closeQuizBtn.addEventListener('click', () => quizModal.close());
    if (cancelQuizBtn && quizModal) cancelQuizBtn.addEventListener('click', () => quizModal.close());
    if (addQBtn) {
      addQBtn.addEventListener('click', () => {
        const list = document.getElementById('quiz-questions-list');
        if (list) this.addQuestionBlockToBuilder(list, null);
      });
    }

    if (formQuizBuilder) {
      formQuizBuilder.addEventListener('submit', async (e) => {
        e.preventDefault();
        const courseId = document.getElementById('quiz-builder-course-id').value;
        const moduleId = document.getElementById('quiz-builder-module-id').value;
        const title = document.getElementById('quiz-title-input').value;
        const blocks = document.querySelectorAll('.quiz-question-block');

        const questions = [];
        blocks.forEach((block, idx) => {
          const qText = block.querySelector('.q-text-input').value;
          const optInputs = block.querySelectorAll('.q-opt-input');
          const options = Array.from(optInputs).map(inp => inp.value);
          const checkedRadio = block.querySelector('input[type="radio"]:checked');
          const correctIndex = checkedRadio ? parseInt(checkedRadio.value, 10) : 0;
          const explanation = block.querySelector('.q-exp-input').value;

          questions.push({
            questionId: 'q-' + Date.now().toString(36) + '-' + idx,
            questionText: qText,
            options,
            correctIndex,
            explanation
          });
        });

        if (questions.length === 0) {
          this.showToast('Please include at least one question in the assessment.', 'error');
          return;
        }

        try {
          const res = await this.service.saveModuleQuiz(courseId, moduleId, { title, questions });
          if (res.success) {
            this.showToast('Module assessment quiz published to students successfully!', 'success');
            if (quizModal) quizModal.close();
            await this.refreshAllData();
          }
        } catch (err) {
          this.showToast(err.message, 'error');
        }
      });
    }

    // Refresh student roster button
    const btnRefStudents = document.getElementById('btn-refresh-students');
    if (btnRefStudents) {
      btnRefStudents.addEventListener('click', async () => {
        await this.renderFacultyStudents();
        this.showToast('Student cohort roster refreshed.', 'success');
      });
    }

    // Redraw canvas on window resize
    window.addEventListener('resize', () => {
      this.analytics.drawStudyAnalytics();
    });
  }

  async switchDemoAccount(role) {
    if (role === 'faculty') {
      const facultyUser = {
        id: "usr-faculty-1",
        name: "Dr. Sarah Mitchell",
        email: "faculty@edusphere.edu",
        role: "faculty",
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80",
        departmentOrMajor: "Computer Science & Engineering",
        title: "Professor of Software Engineering",
        bio: "Lead Faculty Instructor for Advanced Web Engineering and Distributed Cloud Systems.",
        learningGoals: "Deliver rigorous curriculum with verified lab practicals.",
        officeHours: "Mon/Wed 14:00 - 16:00 UTC"
      };
      this.saveSession(facultyUser);
      this.showToast('Switched to Faculty Portal (Dr. Sarah Mitchell)', 'success');
      const authModal = document.getElementById('auth-modal');
      if (authModal) authModal.close();
      await this.refreshAllData();
      this.switchView('view-faculty');
    } else {
      const studentUser = {
        id: "usr-student-1",
        name: "Alex Sterling",
        email: "student@edusphere.edu",
        role: "student",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
        departmentOrMajor: "Computer Science & Engineering",
        title: "Undergraduate Scholar",
        bio: "Honors student studying advanced web engineering, cloud computing, and distributed database architectures.",
        learningGoals: "Complete certified technical milestones and software architecture competencies.",
        officeHours: "N/A"
      };
      this.saveSession(studentUser);
      this.showToast('Switched to Student Portal (Alex Sterling)', 'success');
      const authModal = document.getElementById('auth-modal');
      if (authModal) authModal.close();
      await this.refreshAllData();
      this.switchView('view-dashboard');
    }
  }

  async handleLogin(email, password, expectedRole) {
    try {
      const res = await this.service.login(email, password, expectedRole);
      if (res.success) {
        this.saveSession(res.user);
        this.showToast(`Logged in as ${res.user.name} (${res.user.role})`, 'success');
        const authModal = document.getElementById('auth-modal');
        if (authModal) authModal.close();
        await this.refreshAllData();
        this.switchView(res.user.role === 'faculty' ? 'view-faculty' : 'view-dashboard');
      } else {
        this.showToast(res.error || 'Authentication failed', 'error');
      }
    } catch (err) {
      this.showToast(err.message, 'error');
    }
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
    if (icon) icon.textContent = theme === 'dark' ? '☀️' : '🌙';
  }

  switchView(viewId) {
    // If user is unauthenticated, redirect private views to view-auth
    const privateViews = ['view-dashboard', 'view-faculty', 'view-academic', 'view-profile'];
    if (!this.currentUser && privateViews.includes(viewId)) {
      this.showToast('Please sign in or register to access your portal records.', 'info');
      viewId = 'view-auth';
    }

    // Role protection for faculty
    if (this.currentUser && this.currentUser.role === 'faculty') {
      if (viewId === 'view-dashboard') viewId = 'view-faculty';
      if (viewId === 'view-academic') {
        this.showToast('Official Transcripts & Records are accessible in Student mode.', 'info');
        viewId = 'view-faculty';
      }
    }

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

    // View specific actions
    if (viewId === 'view-dashboard') {
      setTimeout(() => this.analytics.drawStudyAnalytics(), 100);
      this.renderEnrolledCourses();
    } else if (viewId === 'view-faculty') {
      this.renderFacultyStudio();
    } else if (viewId === 'view-curriculum') {
      if (window.xmlCurriculumManager) {
        window.xmlCurriculumManager.loadCurriculumXml();
      }
    } else if (viewId === 'view-academic') {
      this.loadAcademicRecords();
    } else if (viewId === 'view-profile') {
      this.populateProfileForm();
    }
  }

  async loadInitialData() {
    try {
      const coursesRes = await this.service.fetchCourses();
      this.courses = coursesRes.data || [];

      if (this.currentUser) {
        const enrollmentsRes = await this.service.fetchEnrollments();
        this.enrollments = enrollmentsRes.data || [];
        this.renderEnrolledCourses();
        if (this.currentUser.role === 'faculty') {
          this.renderFacultyStudio();
        }
      } else {
        this.enrollments = [];
      }

      this.renderCourses(this.courses);
      if (this.analytics) {
        this.analytics.drawStudyAnalytics();
      }
    } catch (err) {
      console.error('Data load notice:', err);
    }
  }

  async refreshAllData() {
    await this.loadInitialData();
  }

  renderCourses(coursesToRender) {
    const grid = document.getElementById('course-grid');
    if (!grid) return;

    while (grid.firstChild) {
      grid.removeChild(grid.firstChild);
    }

    // When logged in as student, filter out courses they are already enrolled in
    let coursesToShow = coursesToRender;
    if (this.currentUser && this.currentUser.role === 'student') {
      const enrolledIds = new Set((this.enrollments || []).map(e => e.courseId));
      coursesToShow = coursesToRender.filter(c => !enrolledIds.has(c.id));
    }

    if (coursesToShow.length === 0) {
      const emptyNotice = document.createElement('div');
      emptyNotice.style.cssText = 'grid-column: 1/-1; padding: 40px; text-align: center; color: var(--text-muted); background: var(--bg-surface); border-radius: var(--radius-lg); border: 1px dashed var(--border-color);';
      if (this.currentUser && this.currentUser.role === 'student' && (this.enrollments || []).length > 0) {
        emptyNotice.innerHTML = `
          <h4 style="font-size:16px; font-weight:700; color:var(--text-main); margin-bottom:8px;">🎉 You are actively enrolled in all current coursework!</h4>
          <p style="font-size:13px; margin-bottom:16px; color:var(--text-muted);">View your active curriculum, watch lesson videos, and complete module assessments in your Learning Dashboard.</p>
          <button class="btn-primary" onclick="window.portalApp.switchView('view-dashboard')">Go to My Enrolled Courses</button>
        `;
      } else {
        emptyNotice.textContent = 'No courses found matching your criteria.';
      }
      grid.appendChild(emptyNotice);
      return;
    }

    const fragment = document.createDocumentFragment();
    coursesToShow.forEach(course => {
      const card = DomRenderer.createCourseCard(
        course,
        this.currentUser,
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

    const isDemoUser = this.currentUser && this.currentUser.id === 'usr-student-1';

    if (this.enrollments.length === 0) {
      const empty = document.createElement('div');
      empty.style.cssText = 'padding: 24px; text-align: center; color: var(--text-muted); background: var(--bg-surface); border-radius: var(--radius-md); border: 1px dashed var(--border-color);';
      empty.textContent = 'You have not enrolled in any courses yet. Browse the catalog to start learning!';
      container.appendChild(empty);

      // Reset all Dashboard KPIs strictly to zero for clean new student
      const avgEl = document.getElementById('kpi-avg-progress');
      if (avgEl) avgEl.textContent = '0%';

      const countEl = document.getElementById('kpi-enrolled-count');
      if (countEl) countEl.textContent = '0';

      const creditsEl = document.getElementById('kpi-total-credits');
      if (creditsEl) creditsEl.textContent = '0';

      const honorsEl = document.getElementById('kpi-honors-standing');
      if (honorsEl) honorsEl.textContent = 'Initial';

      // Zero study hours on canvas
      if (this.analytics) {
        this.analytics.drawStudyAnalytics([0, 0, 0, 0, 0, 0, 0]);
      }

      // Empty milestones list
      this.renderDashboardMilestones([]);
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

    // Calculate real KPI metrics based on user's active enrollments
    let totalProgress = 0;
    let accreditedCredits = 0;

    this.enrollments.forEach(e => {
      const pct = Number(e.progressPercentage) || 0;
      totalProgress += pct;
      const course = e.course || this.courses.find(c => c.id === e.courseId);
      if (course) {
        if (pct === 100 || e.status === 'Completed') {
          accreditedCredits += (course.credits || 4);
        }
      }
    });

    const avg = this.enrollments.length > 0 ? Math.round(totalProgress / this.enrollments.length) : 0;

    const avgEl = document.getElementById('kpi-avg-progress');
    if (avgEl) avgEl.textContent = `${avg}%`;

    const countEl = document.getElementById('kpi-enrolled-count');
    if (countEl) countEl.textContent = this.enrollments.length;

    const creditsEl = document.getElementById('kpi-total-credits');
    if (creditsEl) {
      creditsEl.textContent = isDemoUser ? '14' : String(accreditedCredits);
    }

    const honorsEl = document.getElementById('kpi-honors-standing');
    if (honorsEl) {
      if (isDemoUser) {
        honorsEl.textContent = 'Top 5%';
      } else if (accreditedCredits > 0) {
        honorsEl.textContent = avg >= 80 ? 'Dean\'s List' : 'Good Standing';
      } else {
        honorsEl.textContent = avg > 0 ? 'Active' : 'Initial';
      }
    }

    // Dynamic Study Analytics graph
    if (this.analytics) {
      if (isDemoUser) {
        this.analytics.drawStudyAnalytics([3.5, 4.2, 5.0, 2.8, 6.4, 4.8, 5.5]);
      } else {
        const baseHours = Number((avg / 20).toFixed(1));
        this.analytics.drawStudyAnalytics([baseHours, baseHours, baseHours, baseHours, baseHours, baseHours, baseHours]);
      }
    }

    // Dynamic Milestones
    this.renderDashboardMilestones(this.enrollments);
  }

  renderDashboardMilestones(enrollments) {
    const list = document.getElementById('dashboard-milestones-list');
    if (!list) return;

    while (list.firstChild) {
      list.removeChild(list.firstChild);
    }

    const isDemoUser = this.currentUser && this.currentUser.id === 'usr-student-1';

    if (isDemoUser) {
      list.innerHTML = `
        <li class="activity-item">
          <span class="activity-dot"></span>
          <div>
            <strong>Completed Lesson 2.2</strong>
            <p style="color:var(--text-muted); font-size:12px;">Full-Stack Web Architectures</p>
          </div>
        </li>
        <li class="activity-item">
          <span class="activity-dot" style="background:var(--accent);"></span>
          <div>
            <strong>Passed Diagnostic Assessment</strong>
            <p style="color:var(--text-muted); font-size:12px;">Full-Stack Web Architectures • Module 1</p>
          </div>
        </li>
        <li class="activity-item">
          <span class="activity-dot" style="background:var(--accent-amber);"></span>
          <div>
            <strong>Curriculum Enrolled &amp; Active</strong>
            <p style="color:var(--text-muted); font-size:12px;">CS-101 Verified Cohort</p>
          </div>
        </li>
      `;
      return;
    }

    if (!enrollments || enrollments.length === 0) {
      list.innerHTML = `
        <li class="activity-item" style="color:var(--text-muted); font-size:13px;">
          <span class="activity-dot" style="background:var(--border-color);"></span>
          <div>
            <strong>No academic milestones recorded yet.</strong>
            <p style="color:var(--text-muted); font-size:12px;">Enroll in an accredited course and complete module lessons to earn competency milestones.</p>
          </div>
        </li>
      `;
      return;
    }

    enrollments.forEach(e => {
      const course = e.course || this.courses.find(c => c.id === e.courseId);
      const title = course ? course.title : 'Course';
      const completedCount = (e.completedLessons || []).length;
      
      const li = document.createElement('li');
      li.className = 'activity-item';
      li.innerHTML = `
        <span class="activity-dot" style="background:${e.progressPercentage === 100 ? '#059669' : 'var(--primary)'};"></span>
        <div>
          <strong>${e.progressPercentage === 100 ? 'Course Mastered & Completed' : `Active Progress: ${completedCount} lessons completed`}</strong>
          <p style="color:var(--text-muted); font-size:12px;">${title} (${e.progressPercentage}%)</p>
        </div>
      `;
      list.appendChild(li);
    });
  }

  async renderFacultyStudio() {
    if (this.currentUser.role !== 'faculty') return;

    const container = document.getElementById('faculty-courses-container');
    if (!container) return;

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    try {
      // ONLY fetch courses handled by this faculty
      const [statsRes, facultyCoursesRes] = await Promise.all([
        this.service.fetchFacultyStats(this.currentUser.email),
        this.service.fetchFacultyCourses()
      ]);

      const stats = statsRes.data || {};
      const facultyCourses = facultyCoursesRes.data || [];

      const coursesCountEl = document.getElementById('fac-kpi-courses');
      const studentsCountEl = document.getElementById('fac-kpi-students');
      const activeCountEl = document.getElementById('fac-kpi-active');
      const certsCountEl = document.getElementById('fac-kpi-certs');

      if (coursesCountEl) coursesCountEl.textContent = facultyCourses.length;
      if (studentsCountEl) studentsCountEl.textContent = Number(stats.totalStudents || 0).toLocaleString();
      if (activeCountEl) activeCountEl.textContent = Number(stats.activeEnrollments !== undefined ? stats.activeEnrollments : facultyCourses.length);
      if (certsCountEl) certsCountEl.textContent = Number(stats.certificationsIssued || 0);

      if (facultyCourses.length === 0) {
        const empty = document.createElement('div');
        empty.style.cssText = 'padding: 30px; text-align: center; color: var(--text-muted); background: var(--bg-surface); border-radius: var(--radius-md); border: 1px dashed var(--border-color);';
        empty.textContent = 'You are not handling any courses currently. Click "Author New Course" above to create and manage your first course!';
        container.appendChild(empty);
      } else {
        const fragment = document.createDocumentFragment();
        facultyCourses.forEach(course => {
          const item = DomRenderer.createFacultyCourseItem(
            course,
            (c) => this.openAddModuleModal(c),
            (c) => this.handleDeleteCourse(c),
            (c) => this.openClassroomViewDirect(c),
            (c) => this.openVideoUploadForCourse(c),
            (c) => this.openQuizBuilderForCourse(c)
          );
          fragment.appendChild(item);
        });

        container.appendChild(fragment);
      }

      // Render the student cohort management roster
      await this.renderFacultyStudents();
    } catch (err) {
      console.error('Faculty studio render error:', err);
    }
  }

  async renderFacultyStudents() {
    const container = document.getElementById('faculty-students-roster-container');
    if (!container) return;

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    try {
      const res = await this.service.fetchFacultyStudents();
      const students = res.data || [];

      if (students.length === 0) {
        const empty = document.createElement('div');
        empty.style.cssText = 'padding: 24px; text-align: center; color: var(--text-muted); font-size: 13px;';
        empty.textContent = 'No students are currently enrolled in your courses.';
        container.appendChild(empty);
        return;
      }

      const tableWrap = document.createElement('div');
      tableWrap.style.overflowX = 'auto';

      const table = document.createElement('table');
      table.style.cssText = 'width: 100%; border-collapse: collapse; text-align: left; font-size: 13px;';

      table.innerHTML = `
        <thead>
          <tr style="border-bottom: 2px solid var(--border-color); color: var(--text-muted);">
            <th style="padding: 10px 12px;">Student</th>
            <th style="padding: 10px 12px;">Enrolled Course</th>
            <th style="padding: 10px 12px;">Mastery Progress</th>
            <th style="padding: 10px 12px;">Status</th>
            <th style="padding: 10px 12px; text-align: right;">Faculty Actions</th>
          </tr>
        </thead>
        <tbody></tbody>
      `;

      const tbody = table.querySelector('tbody');
      students.forEach(st => {
        const tr = document.createElement('tr');
        tr.style.cssText = 'border-bottom: 1px solid var(--border-color);';

        const statusColor = st.status === 'Completed' ? '#059669' : '#3b82f6';
        const progressPct = Number.isFinite(Number(st.progressPercentage)) ? Math.round(Number(st.progressPercentage)) : 0;

        tr.innerHTML = `
          <td style="padding: 12px;">
            <div style="display:flex; align-items:center; gap:10px;">
              <img src="${st.studentAvatar}" style="width:36px; height:36px; border-radius:50%; object-fit:cover;">
              <div>
                <strong style="color:var(--text-main); display:block;">${st.studentName}</strong>
                <span style="color:var(--text-muted); font-size:12px;">${st.studentEmail}</span>
              </div>
            </div>
          </td>
          <td style="padding: 12px; color:var(--text-main); font-weight:600;">
            ${st.courseTitle}
          </td>
          <td style="padding: 12px; min-width: 160px;">
            <div style="display:flex; justify-content:space-between; margin-bottom:4px; font-size:11px;">
              <span>Completed Lessons: ${st.completedLessonsCount}</span>
              <strong>${progressPct}%</strong>
            </div>
            <progress max="100" value="${progressPct}" style="width:100%; height:8px; border-radius:4px;"></progress>
          </td>
          <td style="padding: 12px;">
            <span style="display:inline-block; padding:3px 8px; border-radius:12px; font-size:11px; font-weight:700; background:rgba(59,130,246,0.1); color:${statusColor};">
              ${st.status}
            </span>
          </td>
          <td style="padding: 12px; text-align: right;">
            <div style="display:flex; gap:6px; justify-content:flex-end;">
              <button class="btn-primary btn-grant-cert" style="padding:4px 10px; font-size:11px; background:#059669;" title="Award 100% completion & diploma">🎓 Grant 100%</button>
              <button class="btn-secondary btn-toggle-status" style="padding:4px 10px; font-size:11px;" title="Toggle between Active and In Review">🔄 Status</button>
              <button class="btn-danger btn-drop-student" style="padding:4px 10px; font-size:11px;" title="Unenroll student from this course">❌ Drop</button>
            </div>
          </td>
        `;

        // Grant 100% mastery
        tr.querySelector('.btn-grant-cert').addEventListener('click', async () => {
          try {
            await this.service.updateFacultyStudent(st.enrollmentId, { progressPercentage: 100, status: 'Completed' });
            this.showToast(`Granted 100% mastery & certification to ${st.studentName}!`, 'success');
            await this.renderFacultyStudio();
          } catch (e) {
            this.showToast(e.message, 'error');
          }
        });

        // Toggle status
        tr.querySelector('.btn-toggle-status').addEventListener('click', async () => {
          try {
            const nextStatus = st.status === 'Completed' ? 'Active' : (st.status === 'Active' ? 'In Review' : 'Active');
            await this.service.updateFacultyStudent(st.enrollmentId, { status: nextStatus });
            this.showToast(`Updated ${st.studentName} status to ${nextStatus}`, 'success');
            await this.renderFacultyStudio();
          } catch (e) {
            this.showToast(e.message, 'error');
          }
        });

        // Drop student
        tr.querySelector('.btn-drop-student').addEventListener('click', async () => {
          if (!confirm(`Are you sure you want to remove ${st.studentName} from ${st.courseTitle}?`)) return;
          try {
            await this.service.removeFacultyStudent(st.enrollmentId);
            this.showToast(`Removed ${st.studentName} from course roster.`, 'success');
            await this.renderFacultyStudio();
          } catch (e) {
            this.showToast(e.message, 'error');
          }
        });

        tbody.appendChild(tr);
      });

      tableWrap.appendChild(table);
      container.appendChild(tableWrap);
    } catch (err) {
      console.error('Error rendering faculty students:', err);
    }
  }

  openVideoUploadForCourse(course, targetModuleId, targetLessonId) {
    const modal = document.getElementById('video-upload-modal');
    if (!modal) return;

    const courseIdInput = document.getElementById('video-course-id');
    const moduleIdInput = document.getElementById('video-module-id');
    const lessonIdInput = document.getElementById('video-lesson-id');
    const displayTarget = document.getElementById('video-target-display');
    const urlInput = document.getElementById('video-url-input');
    const summaryInput = document.getElementById('video-lesson-summary-input');
    const previewBox = document.getElementById('video-preview-box');
    const player = document.getElementById('video-modal-preview-player');

    // Default to first module and lesson if not explicitly selected
    const m = (course.modules && course.modules.find(mod => mod.moduleId === targetModuleId)) || (course.modules && course.modules[0]);
    const l = (m && m.lessons && m.lessons.find(les => les.lessonId === targetLessonId)) || (m && m.lessons && m.lessons[0]);

    if (!m || !l) {
      this.showToast('Please add at least one module and lesson to this course first.', 'info');
      this.openAddModuleModal(course);
      return;
    }

    courseIdInput.value = course.id;
    moduleIdInput.value = m.moduleId;
    lessonIdInput.value = l.lessonId;
    displayTarget.textContent = `${course.title} > ${m.title} > ${l.title}`;
    urlInput.value = l.videoUrl || '';
    summaryInput.value = l.summary || '';

    previewBox.style.display = 'none';
    player.src = '';

    modal.showModal();
  }

  openAddModuleModal(course) {
    const modal = document.getElementById('module-create-modal');
    const title = document.getElementById('module-modal-title');
    const courseIdInput = document.getElementById('add-module-course-id');

    if (title) title.textContent = `Add Module to: ${course.title}`;
    if (courseIdInput) courseIdInput.value = course.id;
    if (modal) modal.showModal();
  }

  async handleDeleteCourse(course) {
    const confirmed = window.confirm(`Are you sure you want to delete course "${course.title}"? This cannot be undone.`);
    if (!confirmed) return;

    try {
      const res = await this.service.deleteCourse(course.id);
      if (res.success) {
        this.showToast(`Course "${course.title}" deleted from catalog.`, 'success');
        await this.refreshAllData();
      }
    } catch (err) {
      this.showToast(err.message, 'error');
    }
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
      (c.title && c.title.toLowerCase().includes(q)) || 
      (c.description && c.description.toLowerCase().includes(q)) ||
      (c.category && c.category.toLowerCase().includes(q))
    );
    this.renderCourses(filtered);
  }

  async handleEnrollCourse(course) {
    if (!this.currentUser) {
      this.showToast('Please sign in or register to enroll in accredited courses.', 'info');
      this.switchView('view-auth');
      return;
    }

    try {
      const res = await this.service.enrollInCourse(course.id);
      if (res.success) {
        this.showToast(`Successfully enrolled in "${course.title}"!`, 'success');
        const enrollmentsRes = await this.service.fetchEnrollments();
        this.enrollments = enrollmentsRes.data || [];
        // Immediately refresh views: course disappears from catalog and appears in enrolled list
        this.renderEnrolledCourses();
        this.renderCourses(this.courses);
        this.switchView('view-dashboard');
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
        this.renderCourses(this.courses); // Course reappears in catalog
      }
    } catch (err) {
      this.showToast(err.message, 'error');
    }
  }

  openClassroomView(enrollment) {
    const course = enrollment.course || this.courses.find(c => c.id === enrollment.courseId);
    if (!course) return;

    this.activeCourse = course;
    this.switchView('view-classroom');

    document.getElementById('classroom-course-title').textContent = course.title;
    document.getElementById('classroom-course-cat').textContent = `${course.category} • ${course.level}`;

    this.renderClassroomModules(course, enrollment);

    if (course.modules && course.modules[0] && course.modules[0].lessons && course.modules[0].lessons[0]) {
      this.selectLesson(course.modules[0].lessons[0], enrollment);
    }
  }

  openClassroomViewDirect(course) {
    this.activeCourse = course;
    this.switchView('view-classroom');

    document.getElementById('classroom-course-title').textContent = course.title;
    document.getElementById('classroom-course-cat').textContent = `${course.category} • ${course.level}`;

    this.renderClassroomModules(course, { completedLessons: [] });

    if (course.modules && course.modules[0] && course.modules[0].lessons && course.modules[0].lessons[0]) {
      this.selectLesson(course.modules[0].lessons[0], { completedLessons: [] });
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

      let facultyQuizBtn = '';
      if (this.currentUser.role === 'faculty') {
        facultyQuizBtn = `<button class="btn-secondary btn-header-prepare-quiz" style="padding:2px 8px; font-size:11px; margin-left:auto; margin-right:8px; border-color:#059669; color:#059669; font-weight:600;" title="Prepare assessment quiz for this module">📝 Prepare Quiz</button>`;
      }

      const header = document.createElement('div');
      header.className = 'module-header';
      header.innerHTML = `
        <span>${mod.title}</span>
        <div style="display:flex; align-items:center;">
          ${facultyQuizBtn}
          <span class="module-toggle-icon">▼</span>
        </div>
      `;

      const quizBtn = header.querySelector('.btn-header-prepare-quiz');
      if (quizBtn) {
        quizBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.openQuizBuilderForCourse(course, mod.moduleId);
        });
      }

      const lessonsList = document.createElement('ul');
      lessonsList.className = 'lessons-list';

      (mod.lessons || []).forEach((les, lesIdx) => {
        const item = document.createElement('li');
        item.className = 'lesson-list-item';
        item.dataset.lessonId = les.lessonId;

        const isDone = completed.has(les.lessonId);
        
        let facultyUploadBtnHtml = '';
        if (this.currentUser.role === 'faculty') {
          facultyUploadBtnHtml = `<button class="btn-secondary btn-upload-lesson-video" style="padding:2px 8px; font-size:11px; margin-left:8px;" title="Upload or Preview Video for this lesson">📹 Video</button>`;
        }

        item.innerHTML = `
          <span>${les.title} (${les.duration})</span>
          <div style="display:flex; align-items:center; gap:6px;">
            ${facultyUploadBtnHtml}
            <span class="lesson-check-icon">${isDone ? '✓' : '○'}</span>
          </div>
        `;

        // If faculty clicks the video button on a specific lesson
        const vidBtn = item.querySelector('.btn-upload-lesson-video');
        if (vidBtn) {
          vidBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.openVideoUploadForCourse(course, mod.moduleId, les.lessonId);
          });
        }

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
    if (this.activeCourse && this.activeCourse.modules) {
      this.activeModule = this.activeCourse.modules.find(m => 
        (m.lessons || []).some(l => l.lessonId === lesson.lessonId)
      ) || this.activeCourse.modules[0];
    }

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

  async openQuizDialog() {
    const modal = document.getElementById('custom-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body-content');

    if (!this.activeCourse) return;
    const moduleId = (this.activeModule && this.activeModule.moduleId) || 
      (this.activeCourse.modules && this.activeCourse.modules[0] ? this.activeCourse.modules[0].moduleId : 'mod-1');

    modalTitle.textContent = `Module Assessment: ${this.activeLesson ? this.activeLesson.title : 'Practical Assessment'}`;
    modalBody.innerHTML = '<div style="padding:24px; text-align:center; color:var(--text-muted);">Loading verified module assessment...</div>';
    modal.showModal();

    try {
      const res = await this.service.fetchModuleQuiz(this.activeCourse.id, moduleId);
      const quiz = res.data;
      window.currentActiveQuiz = quiz;

      let questionsHtml = '';
      (quiz.questions || []).forEach((q, qIdx) => {
        let optionsHtml = '';
        (q.options || []).forEach((opt, optIdx) => {
          optionsHtml += `
            <label style="display:flex; align-items:center; gap:8px; margin-bottom:6px; font-size:13px; cursor:pointer;">
              <input type="radio" name="q_${qIdx}" value="${optIdx}">
              <span>${opt}</span>
            </label>
          `;
        });

        questionsHtml += `
          <div style="margin-bottom:18px; padding-bottom:14px; border-bottom:1px solid var(--border-color);">
            <p style="font-weight:700; font-size:14px; margin-bottom:8px; color:var(--text-main);">${qIdx + 1}. ${q.questionText}</p>
            <div style="margin-left:8px;">${optionsHtml}</div>
          </div>
        `;
      });

      modalBody.innerHTML = `
        <form id="quiz-form">
          <div style="margin-bottom:14px; padding-bottom:8px; border-bottom:2px solid var(--border-color);">
            <h4 style="font-size:16px; font-weight:700; color:var(--primary); margin:0 0 4px 0;">${quiz.title}</h4>
            <span style="font-size:12px; color:var(--text-muted);">Passing threshold: 60% &bull; Questions prepared by faculty instructor</span>
          </div>
          ${questionsHtml}
          <div id="quiz-feedback-box" class="validation-output" style="margin-top:12px;"></div>
          <div style="margin-top:20px; display:flex; justify-content:flex-end; gap:10px;">
            <button type="button" class="btn-primary" id="btn-submit-quiz">Submit Assessment</button>
          </div>
        </form>
      `;
    } catch (err) {
      modalBody.innerHTML = `<div class="validation-output error">Failed to load quiz: ${err.message}</div>`;
    }
  }

  async openQuizBuilderForCourse(course, targetModuleId) {
    const modal = document.getElementById('quiz-builder-modal');
    if (!modal) return;

    const courseIdInput = document.getElementById('quiz-builder-course-id');
    const moduleIdInput = document.getElementById('quiz-builder-module-id');
    const targetDisplay = document.getElementById('quiz-builder-target-display');
    const titleInput = document.getElementById('quiz-title-input');
    const questionsList = document.getElementById('quiz-questions-list');

    const mod = (course.modules && course.modules.find(m => m.moduleId === targetModuleId)) || (course.modules && course.modules[0]);
    if (!mod) {
      this.showToast('Please add at least one module before preparing a quiz.', 'error');
      return;
    }

    courseIdInput.value = course.id;
    moduleIdInput.value = mod.moduleId;
    targetDisplay.textContent = `${course.title} • ${mod.title}`;

    questionsList.innerHTML = '<div style="padding:16px; text-align:center; color:var(--text-muted);">Loading existing module questions...</div>';
    modal.showModal();

    try {
      const res = await this.service.fetchModuleQuiz(course.id, mod.moduleId);
      const quiz = res.data || {};
      titleInput.value = quiz.title || `${mod.title} Assessment Quiz`;

      questionsList.innerHTML = '';
      const questions = (quiz.questions && quiz.questions.length > 0) ? quiz.questions : [
        {
          questionText: 'What is the primary role of asynchronous AJAX communication in modern web apps?',
          options: [
            'Forcing synchronous full-page reloads',
            'Exchanging JSON payloads in background without refreshing',
            'Disabling client-side JavaScript execution',
            'Preventing CSS styling from applying'
          ],
          correctIndex: 1,
          explanation: 'AJAX enables background asynchronous communication.'
        }
      ];

      questions.forEach((q) => {
        this.addQuestionBlockToBuilder(questionsList, q);
      });
    } catch (e) {
      questionsList.innerHTML = '';
      this.addQuestionBlockToBuilder(questionsList, null);
    }
  }

  addQuestionBlockToBuilder(container, qData) {
    const block = document.createElement('div');
    block.className = 'quiz-question-block';
    block.style.cssText = 'background:var(--bg-secondary); padding:14px; border-radius:8px; border:1px solid var(--border-color);';

    const qNum = container.children.length + 1;
    const qText = qData ? qData.questionText : '';
    const opts = qData ? qData.options : ['', '', '', ''];
    const correct = qData ? Number(qData.correctIndex || 0) : 0;
    const exp = qData ? (qData.explanation || '') : '';
    const radioGroupName = 'correct_opt_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 4);

    block.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
        <strong style="font-size:13px; color:var(--text-main);">Question #${qNum}</strong>
        <button type="button" class="btn-danger btn-remove-q-block" style="padding:2px 8px; font-size:11px;">Remove</button>
      </div>
      <div style="margin-bottom:10px;">
        <label style="font-size:12px; font-weight:600;">Question Title / Prompt:</label>
        <input type="text" class="q-text-input" value="${qText}" style="width:100%; padding:6px 10px; border-radius:4px; border:1px solid var(--border-color); background:var(--bg-surface); color:var(--text-main);" placeholder="e.g. Which HTTP method is idempotent?" required>
      </div>
      <div style="font-size:12px; font-weight:600; margin-bottom:4px;">Answer Choices (Select radio button for the correct answer):</div>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:8px;">
        ${[0, 1, 2, 3].map(i => `
          <div style="display:flex; align-items:center; gap:6px;">
            <input type="radio" name="${radioGroupName}" value="${i}" ${correct === i ? 'checked' : ''} style="cursor:pointer;" title="Mark as correct answer">
            <input type="text" class="q-opt-input" value="${opts[i] || ''}" style="width:100%; padding:5px 8px; border-radius:4px; border:1px solid var(--border-color); background:var(--bg-surface); color:var(--text-main);" placeholder="Option ${i + 1}" required>
          </div>
        `).join('')}
      </div>
      <div>
        <label style="font-size:12px; font-weight:600;">Feedback / Competency Explanation:</label>
        <input type="text" class="q-exp-input" value="${exp}" style="width:100%; padding:5px 8px; border-radius:4px; border:1px solid var(--border-color); background:var(--bg-surface); color:var(--text-main);" placeholder="Explanation shown to students after answering">
      </div>
    `;

    block.querySelector('.btn-remove-q-block').addEventListener('click', () => {
      block.remove();
    });

    container.appendChild(block);
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
      const res = await fetch(`/api/academic/verify/${this.currentUser.id}`);
      const data = await res.json();
      if (data.success) {
        const record = data.data;
        const standingEl = document.getElementById('academic-standing-badge');
        if (standingEl) standingEl.textContent = record.academicStanding;
        const gpaEl = document.getElementById('academic-gpa-display');
        if (gpaEl) gpaEl.textContent = `${record.cumulativeGpa} / 4.00`;
        const codeEl = document.getElementById('academic-cert-code');
        if (codeEl) codeEl.textContent = record.verificationCode;
        const creditsEl = document.getElementById('academic-credits-completed');
        if (creditsEl) creditsEl.textContent = `${record.creditsCompleted} Units`;

        // Dynamically bind official transcript and certificate buttons
        const transcriptLink = document.getElementById('link-view-transcript');
        if (transcriptLink) {
          transcriptLink.href = `/academic-service/web/transcript.jsp?studentId=${encodeURIComponent(record.studentId)}&name=${encodeURIComponent(record.studentName)}&userId=${encodeURIComponent(this.currentUser.id)}`;
        }
        const certLink = document.getElementById('link-view-certificate');
        if (certLink) {
          certLink.href = `/academic-service/web/certificate.jsp?name=${encodeURIComponent(record.studentName)}&userId=${encodeURIComponent(this.currentUser.id)}`;
        }
      }
    } catch (err) {
      console.error('Academic records notice:', err);
    }
  }

  populateProfileForm() {
    const user = this.currentUser;
    const isFaculty = user.role === 'faculty';

    const nameInput = document.getElementById('profile-name-input');
    const emailInput = document.getElementById('profile-email-input');
    const majorInput = document.getElementById('profile-major-input');
    const bioInput = document.getElementById('profile-bio-input');
    const goalsInput = document.getElementById('profile-goals-input');
    const titleInput = document.getElementById('profile-title-input');
    const officeInput = document.getElementById('profile-office-input');

    const cardAvatar = document.getElementById('profile-card-avatar');
    const displayName = document.getElementById('display-student-name');
    const displayMajor = document.getElementById('display-student-major');
    const displayId = document.getElementById('display-user-id');
    const roleBadge = document.getElementById('profile-role-badge');

    if (nameInput) nameInput.value = user.name || '';
    if (emailInput) emailInput.value = user.email || '';
    if (majorInput) majorInput.value = user.departmentOrMajor || '';
    if (bioInput) bioInput.value = user.bio || '';
    if (goalsInput) goalsInput.value = user.learningGoals || '';
    if (titleInput) titleInput.value = user.title || '';
    if (officeInput) officeInput.value = user.officeHours || '';

    if (cardAvatar) cardAvatar.src = user.avatar;
    if (displayName) displayName.textContent = user.name;
    if (displayMajor) displayMajor.textContent = user.departmentOrMajor;
    if (displayId) displayId.textContent = `ID: ${user.id}`;

    if (roleBadge) {
      roleBadge.textContent = isFaculty ? 'Faculty Instructor' : 'Student Scholar';
      roleBadge.className = `user-role-chip ${isFaculty ? 'role-faculty' : 'role-student'}`;
    }

    const titleGroup = document.getElementById('profile-title-group');
    const goalsGroup = document.getElementById('profile-goals-group');
    const officeGroup = document.getElementById('profile-office-hours-group');
    const deptLabel = document.getElementById('profile-dept-label');

    if (isFaculty) {
      if (titleGroup) titleGroup.style.display = 'block';
      if (officeGroup) officeGroup.style.display = 'block';
      if (goalsGroup) goalsGroup.style.display = 'none';
      if (deptLabel) deptLabel.textContent = 'Academic Department / Faculty Division';
    } else {
      if (titleGroup) titleGroup.style.display = 'none';
      if (officeGroup) officeGroup.style.display = 'none';
      if (goalsGroup) goalsGroup.style.display = 'block';
      if (deptLabel) deptLabel.textContent = 'Degree Track / Academic Major';
    }
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
