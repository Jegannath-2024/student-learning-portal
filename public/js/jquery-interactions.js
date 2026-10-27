/**
 * jQuery Dynamic Interactions, Animations, and AJAX with JSON
 * Implements $(document).ready, jQuery Animations (fadeIn, slideToggle),
 * Event Handling, and Asynchronous jQuery AJAX ($.ajax, $.getJSON, $.post)
 */

$(document).ready(function() {
  console.log("jQuery 3.x initialized for EduSphere Academic Portal.");

  // 1. jQuery Accordion Slide Toggle for Course Modules in Classroom view
  $(document).on('click', '.module-header', function() {
    const $lessonsList = $(this).next('.lessons-list');
    $lessonsList.slideToggle(250);
    const $icon = $(this).find('.module-toggle-icon');
    if ($icon.text() === '▼') {
      $icon.text('▲');
    } else {
      $icon.text('▼');
    }
  });

  // 2. jQuery Live Search Debounce & Instant Catalog Filter
  let searchTimer;
  $('#global-search-input').on('keyup', function() {
    clearTimeout(searchTimer);
    const query = $(this).val().trim();
    searchTimer = setTimeout(function() {
      if (window.portalApp) {
        window.portalApp.filterCoursesBySearch(query);
      }
    }, 280);
  });

  // 3. Category Filter Chips jQuery interaction
  $(document).on('click', '.filter-chip', function() {
    $('.filter-chip').removeClass('active');
    $(this).addClass('active');
    const category = $(this).data('category');
    if (window.portalApp) {
      window.portalApp.filterCoursesByCategory(category);
    }
  });

  // 4. jQuery AJAX PUT Request for Student / Faculty Profile Update
  $('#student-profile-form').on('submit', function(e) {
    e.preventDefault();

    const profileData = {
      name: $('#profile-name-input').val(),
      major: $('#profile-major-input').val(),
      departmentOrMajor: $('#profile-major-input').val(),
      title: $('#profile-title-input').val(),
      officeHours: $('#profile-office-input').val(),
      bio: $('#profile-bio-input').val(),
      learningGoals: $('#profile-goals-input').val()
    };

    const $submitBtn = $('#btn-save-profile');
    $submitBtn.prop('disabled', true).text('Updating Profile...');

    const userId = window.portalApp ? window.portalApp.currentUser.id : 'usr-student-1';

    // jQuery $.ajax with JSON payload (PUT method)
    $.ajax({
      url: '/api/student/profile',
      type: 'PUT',
      contentType: 'application/json',
      headers: {
        'x-user-id': userId
      },
      data: JSON.stringify(profileData),
      dataType: 'json',
      success: function(response) {
        $submitBtn.prop('disabled', false).text('Save Profile Changes');
        if (response.success) {
          if (window.portalApp) {
            window.portalApp.currentUser = { ...window.portalApp.currentUser, ...response.data };
            window.portalApp.saveSession(window.portalApp.currentUser);
            window.portalApp.showToast('Profile updated successfully!', 'success');
          }
        }
      },
      error: function(xhr, status, error) {
        $submitBtn.prop('disabled', false).text('Save Profile Changes');
        if (window.portalApp) {
          window.portalApp.showToast('Failed to update profile: ' + error, 'error');
        }
      }
    });
  });

  // 5. jQuery AJAX XML Validation Handler
  $('#btn-trigger-xml-validate').on('click', function() {
    const xmlText = $('#xml-validator-input').val();
    if (!xmlText.trim()) {
      if (window.portalApp) {
        window.portalApp.showToast('Please enter or paste XML content to validate.', 'error');
      }
      return;
    }
    if (window.xmlCurriculumManager) {
      window.xmlCurriculumManager.validateXmlContent(xmlText);
    }
  });

  // 6. Reset XML content in editor
  $('#btn-reset-xml').on('click', function() {
    if (window.xmlCurriculumManager && window.xmlCurriculumManager.rawXmlText) {
      $('#xml-validator-input').val(window.xmlCurriculumManager.rawXmlText);
      $('#xml-validation-status').hide();
      if (window.portalApp) {
        window.portalApp.showToast('Reset editor to canonical curriculum XML.', 'success');
      }
    }
  });

  // 7. Interactive Quiz Modal Submit with jQuery
  $(document).on('click', '#btn-submit-quiz', function() {
    let score = 0;
    const total = 3;

    if ($('input[name="q1"]:checked').val() === 'b') score++;
    if ($('input[name="q2"]:checked').val() === 'c') score++;
    if ($('input[name="q3"]:checked').val() === 'a') score++;

    const percent = Math.round((score / total) * 100);
    const $quizResult = $('#quiz-feedback-box');
    $quizResult.hide().removeClass('success error');

    if (percent >= 66) {
      $quizResult.addClass('success').html(`
        <strong>Assessment Passed!</strong> Score: ${score}/${total} (${percent}%).
        <p style="margin-top:4px; font-size:12px;">Competency recorded to student academic progress.</p>
      `).slideDown(300);
    } else {
      $quizResult.addClass('error').html(`
        <strong>Score: ${score}/${total} (${percent}%).</strong>
        <p style="margin-top:4px; font-size:12px;">Review the lecture video and try again to achieve passing threshold.</p>
      `).slideDown(300);
    }
  });

});
