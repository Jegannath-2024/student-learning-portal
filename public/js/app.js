/**
 * Student Learning & Faculty Portal - Core Application Architecture
 * Object-Oriented JavaScript, Role-Based Access Control (Student vs Faculty),
 * HTML DOM Methods, HTML5 Canvas 2D Analytics & RESTful Operations
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
    const res = await fetch(`/api/faculty/stats?email=${encodeURIComponent(email || '')}`);
    if (!res.ok) throw new Error('Failed to fetch faculty stats');
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
      const y = padding + chartH - (studyData[i] / maxVal) * chartH;
      points.push({ x, y, val: studyData[i] });

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
      <span class="metric-item">★ ${course.rating || 4.8}</span>
      <span class="metric-item">👥 ${course.studentsCount || 100}</span>
      <span class="metric-item">⏳ ${course.duration || '6 Weeks'}</span>
    `;

    const actionsWrap = document.createElement('div');
    actionsWrap.style.display = 'flex';
    actionsWrap.style.gap = '8px';

    const btnDetails = document.createElement('button');
    btnDetails.className = 'btn-secondary';
    btnDetails.textContent = 'Curriculum';
    btnDetails.addEventListener('click', () => onViewDetails(course));
    actionsWrap.appendChild(btnDetails);

    // If user is student, show Enroll button; if faculty, show View Classroom
    if (currentUser.role === 'student') {
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

    // HTML5 Progress Element
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

  static createFacultyCourseItem(course, onAddModule, onDelete, onPreview) {
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
        📁 <strong>${moduleCount}</strong> Modules • 📖 <strong>${lessonCount}</strong> Lessons • 👥 <strong>${course.studentsCount || 0}</strong> Students
      </div>
    `;

    meta.appendChild(img);
    meta.appendChild(textInfo);

    const btnGroup = document.createElement('div');
    btnGroup.className = 'faculty-btn-group';

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
      'x-user-id': this.currentUser.id
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
        return JSON.parse(stored);
      }
    } catch (e) {}

    // Default student user
    return {
      id: "usr-student-1",
      name: "Alex Sterling",
      email: "alex.sterling@learningportal.edu",
      role: "student",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
      title: "Undergraduate Scholar",
      departmentOrMajor: "Computer Science & Engineering",
      bio: "Honors undergraduate student exploring high-throughput web systems, distributed architectures, and interactive digital education.",
      learningGoals: "Complete Full-Stack Architecture certification and deploy scalable cloud microservices.",
      officeHours: "N/A"
    };
  }

  saveSession(user) {
    this.currentUser = user;
    localStorage.setItem('edusphere_session', JSON.stringify(user));
    this.service = new CourseService(() => ({
      'Content-Type': 'application/json',
      'x-user-id': this.currentUser.id
    }));
    this.updateUserUI();
  }

  async init() {
    this.bindEvents();
    this.initTheme();
    this.updateUserUI();
    await this.loadInitialData();
  }

  updateUserUI() {
    const user = this.currentUser;
    const isFaculty = user.role === 'faculty';

    // Header identity
    const nameEl = document.getElementById('header-user-name');
    if (nameEl) nameEl.textContent = user.name;

    const avatarEl = document.getElementById('header-avatar');
    if (avatarEl) avatarEl.src = user.avatar;

    const badgeEl = document.getElementById('header-role-badge');
    if (badgeEl) {
      badgeEl.textContent = isFaculty ? 'Faculty' : 'Student';
      badgeEl.className = `user-role-chip ${isFaculty ? 'role-faculty' : 'role-student'}`;
    }

    const switchLabel = document.getElementById('quick-switch-label');
    if (switchLabel) {
      switchLabel.textContent = isFaculty ? 'Switch to Student' : 'Switch to Faculty';
    }

    // Context-Aware navigation visibility
    const navDashboard = document.getElementById('nav-item-dashboard');
    const navFaculty = document.getElementById('nav-item-faculty');
    const catalogBanner = document.getElementById('catalog-faculty-banner');
    const classroomFacultyWrap = document.getElementById('classroom-faculty-add-module-wrap');

    if (isFaculty) {
      if (navDashboard) navDashboard.style.display = 'none';
      if (navFaculty) {
        navFaculty.style.display = 'block';
        navFaculty.querySelector('button').style.display = 'flex';
      }
      if (catalogBanner) catalogBanner.style.display = 'block';
      if (classroomFacultyWrap) classroomFacultyWrap.style.display = 'block';
    } else {
      if (navDashboard) navDashboard.style.display = 'block';
      if (navFaculty) navFaculty.style.display = 'none';
      if (catalogBanner) catalogBanner.style.display = 'none';
      if (classroomFacultyWrap) classroomFacultyWrap.style.display = 'none';
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

    if (openAuthBtn && authModal) {
      openAuthBtn.addEventListener('click', () => authModal.showModal());
    }
    if (closeAuthBtn && authModal) {
      closeAuthBtn.addEventListener('click', () => authModal.close());
    }

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
            this.switchView(role === 'faculty' ? 'view-faculty' : 'view-dashboard');
          } else {
            this.showToast(res.error || 'Registration failed', 'error');
          }
        } catch (err) {
          this.showToast(err.message, 'error');
        }
      });
    }

    // Logout
    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) {
      btnLogout.addEventListener('click', () => {
        this.showToast('Signed out of session.', 'info');
        this.switchDemoAccount('student');
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
        email: "sarah.mitchell@learningportal.edu",
        role: "faculty",
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80",
        departmentOrMajor: "Computer Science & Engineering",
        title: "Senior Professor of Software Engineering",
        bio: "Leading research in distributed web architectures, enterprise cloud engineering, and interactive pedagogical systems.",
        learningGoals: "Expand advanced curriculum with modern REST APIs and XML schema modeling.",
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
        email: "alex.sterling@learningportal.edu",
        role: "student",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
        departmentOrMajor: "Computer Science & Engineering",
        title: "Undergraduate Scholar",
        bio: "Honors undergraduate student exploring high-throughput web systems, distributed architectures, and interactive digital education.",
        learningGoals: "Complete Full-Stack Architecture certification and deploy scalable cloud microservices.",
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
    // If faculty attempts to view student dashboard, redirect to faculty studio
    if (viewId === 'view-dashboard' && this.currentUser.role === 'faculty') {
      viewId = 'view-faculty';
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
    }
  }

  async loadInitialData() {
    try {
      const [coursesRes, enrollmentsRes] = await Promise.all([
        this.service.fetchCourses(),
        this.service.fetchEnrollments()
      ]);

      this.courses = coursesRes.data || [];
      this.enrollments = enrollmentsRes.data || [];

      this.renderCourses(this.courses);
      this.renderEnrolledCourses();
      this.renderFacultyStudio();
      this.analytics.drawStudyAnalytics();
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

  async renderFacultyStudio() {
    if (this.currentUser.role !== 'faculty') return;

    const container = document.getElementById('faculty-courses-container');
    if (!container) return;

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    try {
      const statsRes = await this.service.fetchFacultyStats(this.currentUser.email);
      const stats = statsRes.data || {};

      const coursesCountEl = document.getElementById('fac-kpi-courses');
      const studentsCountEl = document.getElementById('fac-kpi-students');
      const activeCountEl = document.getElementById('fac-kpi-active');
      const certsCountEl = document.getElementById('fac-kpi-certs');

      if (coursesCountEl) coursesCountEl.textContent = stats.coursesCount || this.courses.length;
      if (studentsCountEl) studentsCountEl.textContent = Number(stats.totalStudents || 3070).toLocaleString();
      if (activeCountEl) activeCountEl.textContent = stats.activeEnrollments || this.courses.length;
      if (certsCountEl) certsCountEl.textContent = stats.certificationsIssued || 24;

      const facultyCourses = stats.courses && stats.courses.length > 0 ? stats.courses : this.courses;

      if (facultyCourses.length === 0) {
        const empty = document.createElement('div');
        empty.style.cssText = 'padding: 30px; text-align: center; color: var(--text-muted); background: var(--bg-surface); border-radius: var(--radius-md); border: 1px dashed var(--border-color);';
        empty.textContent = 'No authored courses found. Click "Author New Course" above to create your first curriculum!';
        container.appendChild(empty);
        return;
      }

      const fragment = document.createDocumentFragment();
      facultyCourses.forEach(course => {
        const item = DomRenderer.createFacultyCourseItem(
          course,
          (c) => this.openAddModuleModal(c),
          (c) => this.handleDeleteCourse(c),
          (c) => this.openClassroomViewDirect(c)
        );
        fragment.appendChild(item);
      });

      container.appendChild(fragment);
    } catch (err) {
      console.error('Faculty studio render error:', err);
    }
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
    try {
      const res = await this.service.enrollInCourse(course.id);
      if (res.success) {
        this.showToast(`Successfully enrolled in "${course.title}"!`, 'success');
        const enrollmentsRes = await this.service.fetchEnrollments();
        this.enrollments = enrollmentsRes.data || [];
        this.renderEnrolledCourses();
        this.openClassroomView(res.data);
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

    modalTitle.textContent = `Assessment: ${this.activeLesson ? this.activeLesson.title : 'Comprehensive Quiz'}`;
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

    // Toggle faculty vs student specific form fields
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
