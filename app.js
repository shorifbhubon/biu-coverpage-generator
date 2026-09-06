/**
 * BIU Cover Page & Lab Report Generator - Universal Application Logic
 * Brahmaputra International University
 * Supports instant form fill, direct on-page click-to-edit, custom fields, and shareable links
 */

// Default sample data (matching the uploaded reference PDF)
const DEFAULT_DATA = {
  uniLine1: "BRAHMAPUTRA INTERNATIONAL",
  uniLine2: "UNIVERSITY",
  reportTitle: "Lab Report",
  courseCode: "0611-3208",
  courseTitle: "Numerical Analysis (Sessional)",
  docNumber: "",
  docTopic: "",
  studentName: "K.M.M. Shorif Bhubon",
  studentId: "0742320005101015",
  batch: "12th",
  section: "",
  semester: "",
  studentDept: "Department of CSE",
  studentUni: "Brahmaputra International University",
  teacherName: "Afia Farzana",
  teacherDesignation: "Lecturer",
  teacherDept: "Department of CSE",
  teacherUni: "Brahmaputra International University",
  submissionDate: "28 April 2026",
  accentColor: "#0070C0",
  watermarkOpacity: 18,
  watermarkScale: 105,
  offsetRightBox: true,
  groupMode: false,
  groupMembers: [],
  customFields: []
};

// Current application state
let state = { ...DEFAULT_DATA };
let currentZoom = 0.85;

// DOM Elements Cache
const elements = {
  // Inputs
  uniLine1: document.getElementById('inputUniLine1'),
  uniLine2: document.getElementById('inputUniLine2'),
  reportTitle: document.getElementById('inputReportTitle'),
  courseCode: document.getElementById('inputCourseCode'),
  courseTitle: document.getElementById('inputCourseTitle'),
  docNumber: document.getElementById('inputDocNumber'),
  docTopic: document.getElementById('inputDocTopic'),
  labelDocNumber: document.getElementById('labelDocNumber'),
  labelDocTopic: document.getElementById('labelDocTopic'),
  studentName: document.getElementById('inputStudentName'),
  studentId: document.getElementById('inputStudentId'),
  batch: document.getElementById('inputBatch'),
  section: document.getElementById('inputSection'),
  semester: document.getElementById('inputSemester'),
  studentDept: document.getElementById('inputStudentDept'),
  studentUni: document.getElementById('inputStudentUni'),
  teacherName: document.getElementById('inputTeacherName'),
  teacherDesignation: document.getElementById('inputTeacherDesignation'),
  teacherDept: document.getElementById('inputTeacherDept'),
  teacherUni: document.getElementById('inputTeacherUni'),
  submissionDate: document.getElementById('inputSubmissionDate'),
  accentColor: document.getElementById('accentColorInput'),
  watermarkOpacity: document.getElementById('watermarkOpacitySlider'),
  watermarkScale: document.getElementById('watermarkScaleSlider'),
  groupModeToggle: document.getElementById('groupModeToggle'),
  offsetRightBoxToggle: document.getElementById('offsetRightBoxToggle'),
  membersInputs: document.getElementById('membersInputs'),
  groupMembersList: document.getElementById('groupMembersList'),
  customFieldsInputs: document.getElementById('customFieldsInputs'),
  quickDeptSelect: document.getElementById('quickDeptSelect'),
  currentModeBadge: document.getElementById('currentModeBadge'),

  // Preview Elements
  previewUniLine1: document.getElementById('previewUniLine1'),
  previewUniLine2: document.getElementById('previewUniLine2'),
  previewReportTitle: document.getElementById('previewReportTitle'),
  previewCourseCode: document.getElementById('previewCourseCode'),
  previewCourseTitle: document.getElementById('previewCourseTitle'),
  previewMetaExtra: document.getElementById('previewMetaExtra'),
  previewNumberContainer: document.getElementById('previewNumberContainer'),
  previewNumberLabel: document.getElementById('previewNumberLabel'),
  previewNumberVal: document.getElementById('previewNumberVal'),
  previewTopicContainer: document.getElementById('previewTopicContainer'),
  previewTopicLabel: document.getElementById('previewTopicLabel'),
  previewTopicVal: document.getElementById('previewTopicVal'),
  previewStudentName: document.getElementById('previewStudentName'),
  previewStudentId: document.getElementById('previewStudentId'),
  previewBatch: document.getElementById('previewBatch'),
  previewExtraStudentLines: document.getElementById('previewExtraStudentLines'),
  previewStudentDept: document.getElementById('previewStudentDept'),
  previewStudentUni: document.getElementById('previewStudentUni'),
  previewTeacherName: document.getElementById('previewTeacherName'),
  previewTeacherDesignation: document.getElementById('previewTeacherDesignation'),
  previewTeacherDept: document.getElementById('previewTeacherDept'),
  previewTeacherUni: document.getElementById('previewTeacherUni'),
  previewSubmissionDate: document.getElementById('previewSubmissionDate'),
  previewPageIndicator: document.getElementById('previewPageIndicator'),
  boxSubmittedBy: document.getElementById('boxSubmittedBy'),
  boxSubmittedTo: document.getElementById('boxSubmittedTo'),
  submittedByBody: document.getElementById('submittedByBody'),
  watermarkLogo: document.getElementById('watermarkLogo'),
  headerLogoImg: document.getElementById('headerLogoImg'),
  coverPageSheet: document.getElementById('coverPageSheet'),
  sheetScaler: document.getElementById('sheetScaler'),
  zoomPercent: document.getElementById('zoomPercent'),
  previewViewport: document.getElementById('previewViewport'),
  editorPane: document.getElementById('editorPane'),
  previewPane: document.getElementById('previewPane'),

  // Displays
  opacityValueDisplay: document.getElementById('opacityValueDisplay'),
  scaleValueDisplay: document.getElementById('scaleValueDisplay'),
  toastNotification: document.getElementById('toastNotification'),
  toastMessage: document.getElementById('toastMessage'),
  toastSpinner: document.getElementById('toastSpinner'),
  themeIconDark: document.getElementById('themeIconDark'),
  themeIconLight: document.getElementById('themeIconLight')
};

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  loadSavedState();
  checkUrlParams();
  bindInputListeners();
  bindInlineEditableListeners();
  ensureLogoLoaded();
  calculateAutoFitZoom();
  window.addEventListener('resize', debounce(calculateAutoFitZoom, 150));
});

/**
 * Make sure the official high-res logo is active
 */
function ensureLogoLoaded() {
  const logoSrc = (window.DEFAULT_LOGO_BASE64 && window.DEFAULT_LOGO_BASE64.length > 50) 
    ? window.DEFAULT_LOGO_BASE64 
    : 'assets/biu_logo.png';
  
  if (elements.watermarkLogo && (!elements.watermarkLogo.src || elements.watermarkLogo.src.endsWith('undefined'))) {
    elements.watermarkLogo.src = logoSrc;
  }
  if (elements.headerLogoImg && (!elements.headerLogoImg.src || elements.headerLogoImg.src.endsWith('undefined'))) {
    elements.headerLogoImg.src = logoSrc;
  }
}

/**
 * Check if the page was opened with shareable URL parameters
 */
function checkUrlParams() {
  try {
    const params = new URLSearchParams(window.location.search);
    let hasParams = false;

    if (params.has('type')) { state.reportTitle = params.get('type'); hasParams = true; }
    if (params.has('code')) { state.courseCode = params.get('code'); hasParams = true; }
    if (params.has('title')) { state.courseTitle = params.get('title'); hasParams = true; }
    if (params.has('topic')) { state.docTopic = params.get('topic'); hasParams = true; }
    if (params.has('num')) { state.docNumber = params.get('num'); hasParams = true; }
    if (params.has('teacher')) { state.teacherName = params.get('teacher'); hasParams = true; }
    if (params.has('desig')) { state.teacherDesignation = params.get('desig'); hasParams = true; }
    if (params.has('dept')) { state.studentDept = params.get('dept'); state.teacherDept = params.get('dept'); hasParams = true; }
    if (params.has('date')) { state.submissionDate = params.get('date'); hasParams = true; }

    if (hasParams) {
      populateFormFromState();
      updateStudentSection();
      updateExtraMetaSection();
      showToast('Loaded shared course template from link! Fill in your details below.');
    }
  } catch (e) {
    // Ignore URL parse error
  }
}

/**
 * Copy a shareable template link with current course info for classmates
 */
function copyShareableLink() {
  const baseUrl = window.location.origin + window.location.pathname;
  const params = new URLSearchParams();

  if (state.reportTitle) params.set('type', state.reportTitle);
  if (state.courseCode) params.set('code', state.courseCode);
  if (state.courseTitle) params.set('title', state.courseTitle);
  if (state.docTopic) params.set('topic', state.docTopic);
  if (state.docNumber) params.set('num', state.docNumber);
  if (state.teacherName) params.set('teacher', state.teacherName);
  if (state.teacherDesignation) params.set('desig', state.teacherDesignation);
  if (state.studentDept) params.set('dept', state.studentDept);
  if (state.submissionDate) params.set('date', state.submissionDate);

  const shareUrl = `${baseUrl}?${params.toString()}`;

  navigator.clipboard.writeText(shareUrl).then(() => {
    showToast('🔗 Template link copied! Share it with your classmates in WhatsApp/Messenger.', 4000);
  }).catch(() => {
    prompt('Copy this link to share this course template with your classmates:', shareUrl);
  });
}

/**
 * Bind live input events to preview updates
 */
function bindInputListeners() {
  const map = [
    { el: elements.uniLine1, key: 'uniLine1', update: () => elements.previewUniLine1.textContent = state.uniLine1 },
    { el: elements.uniLine2, key: 'uniLine2', update: () => elements.previewUniLine2.textContent = state.uniLine2 },
    { el: elements.reportTitle, key: 'reportTitle', update: () => {
      elements.previewReportTitle.textContent = state.reportTitle || "Report";
      updatePageIndicator();
    }},
    { el: elements.courseCode, key: 'courseCode', update: () => elements.previewCourseCode.textContent = state.courseCode || "[Course Code]" },
    { el: elements.courseTitle, key: 'courseTitle', update: () => elements.previewCourseTitle.textContent = state.courseTitle || "[Course Title]" },
    { el: elements.docNumber, key: 'docNumber', update: updateExtraMetaSection },
    { el: elements.docTopic, key: 'docTopic', update: updateExtraMetaSection },
    { el: elements.studentName, key: 'studentName', update: updateStudentSection },
    { el: elements.studentId, key: 'studentId', update: updateStudentSection },
    { el: elements.batch, key: 'batch', update: updateStudentSection },
    { el: elements.section, key: 'section', update: updateStudentSection },
    { el: elements.semester, key: 'semester', update: updateStudentSection },
    { el: elements.studentDept, key: 'studentDept', update: () => elements.previewStudentDept.textContent = state.studentDept || "[Department]" },
    { el: elements.studentUni, key: 'studentUni', update: () => elements.previewStudentUni.textContent = state.studentUni || "[University Name]" },
    { el: elements.teacherName, key: 'teacherName', update: () => elements.previewTeacherName.textContent = state.teacherName || "[Teacher Name]" },
    { el: elements.teacherDesignation, key: 'teacherDesignation', update: () => elements.previewTeacherDesignation.textContent = state.teacherDesignation || "[Designation]" },
    { el: elements.teacherDept, key: 'teacherDept', update: () => elements.previewTeacherDept.textContent = state.teacherDept || "[Department]" },
    { el: elements.teacherUni, key: 'teacherUni', update: () => elements.previewTeacherUni.textContent = state.teacherUni || "[University Name]" },
    { el: elements.submissionDate, key: 'submissionDate', update: () => elements.previewSubmissionDate.textContent = state.submissionDate || "[Date]" },
  ];

  map.forEach(({ el, key, update }) => {
    if (!el) return;
    el.addEventListener('input', (e) => {
      state[key] = e.target.value;
      update();
      saveState();
    });
  });
}

/**
 * Two-way binding for direct inline editing on the preview sheet (WYSIWYG)
 */
function bindInlineEditableListeners() {
  const editableMap = [
    { el: elements.previewUniLine1, input: elements.uniLine1, key: 'uniLine1' },
    { el: elements.previewUniLine2, input: elements.uniLine2, key: 'uniLine2' },
    { el: elements.previewReportTitle, input: elements.reportTitle, key: 'reportTitle' },
    { el: elements.previewCourseCode, input: elements.courseCode, key: 'courseCode' },
    { el: elements.previewCourseTitle, input: elements.courseTitle, key: 'courseTitle' },
    { el: elements.previewNumberVal, input: elements.docNumber, key: 'docNumber' },
    { el: elements.previewTopicVal, input: elements.docTopic, key: 'docTopic' },
    { el: elements.previewStudentName, input: elements.studentName, key: 'studentName' },
    { el: elements.previewStudentId, input: elements.studentId, key: 'studentId' },
    { el: elements.previewBatch, input: elements.batch, key: 'batch' },
    { el: elements.previewStudentDept, input: elements.studentDept, key: 'studentDept' },
    { el: elements.previewStudentUni, input: elements.studentUni, key: 'studentUni' },
    { el: elements.previewTeacherName, input: elements.teacherName, key: 'teacherName' },
    { el: elements.previewTeacherDesignation, input: elements.teacherDesignation, key: 'teacherDesignation' },
    { el: elements.previewTeacherDept, input: elements.teacherDept, key: 'teacherDept' },
    { el: elements.previewTeacherUni, input: elements.teacherUni, key: 'teacherUni' },
    { el: elements.previewSubmissionDate, input: elements.submissionDate, key: 'submissionDate' }
  ];

  editableMap.forEach(({ el, input, key }) => {
    if (!el) return;
    el.addEventListener('input', () => {
      const val = el.textContent.trim();
      state[key] = val;
      if (input) input.value = val;
      saveState();
    });
  });
}

/**
 * Format batch string with automatic ordinal superscript (e.g. 12th -> 12<sup>th</sup>)
 */
function formatBatchOrdinal(batchStr) {
  if (!batchStr) return '';
  return batchStr.replace(/(\d+)(st|nd|rd|th)/gi, '$1<sup>$2</sup>');
}

/**
 * Update Document Extra Meta (Topic & Assignment/Experiment No.)
 */
function updateExtraMetaSection() {
  const hasNum = state.docNumber && state.docNumber.trim().length > 0;
  const hasTopic = state.docTopic && state.docTopic.trim().length > 0;

  if (hasNum || hasTopic) {
    elements.previewMetaExtra.style.display = 'flex';

    if (hasNum) {
      elements.previewNumberContainer.style.display = 'block';
      const isAssign = state.reportTitle.toLowerCase().includes('assignment');
      elements.previewNumberLabel.textContent = isAssign ? 'Assignment No:' : 'Experiment No:';
      elements.previewNumberVal.textContent = state.docNumber.trim();
    } else {
      elements.previewNumberContainer.style.display = 'none';
    }

    if (hasTopic) {
      elements.previewTopicContainer.style.display = 'block';
      const isAssign = state.reportTitle.toLowerCase().includes('assignment');
      elements.previewTopicLabel.textContent = isAssign ? 'Assignment Topic:' : 'Experiment Name:';
      elements.previewTopicVal.textContent = state.docTopic.trim();
    } else {
      elements.previewTopicContainer.style.display = 'none';
    }
  } else {
    elements.previewMetaExtra.style.display = 'none';
  }
}

/**
 * Update the "Submitted By" box in the live preview
 */
function updateStudentSection() {
  const sName = state.studentName || "[Your Full Name]";
  const sId = state.studentId || "[Your Student ID]";
  const sBatch = state.batch || "[Batch]";

  if (state.groupMode && state.groupMembers && state.groupMembers.length > 0) {
    // Multi-Student / Group view
    let html = `
      <div class="multi-student-entry">
        <div class="person-name">${escapeHTML(sName)}</div>
        <div class="detail-line"><span class="field-label">ID:</span><span class="field-value">${escapeHTML(sId)}</span></div>
        <div class="detail-line"><span class="field-label">Batch:</span><span class="field-value">${formatBatchOrdinal(escapeHTML(sBatch))}</span></div>
        ${state.section ? `<div class="detail-line"><span class="field-label">Section:</span><span class="field-value">${escapeHTML(state.section)}</span></div>` : ''}
      </div>
    `;

    state.groupMembers.forEach((member, i) => {
      html += `
        <div class="multi-student-entry">
          <div class="person-name">${escapeHTML(member.name || `Student ${i+2}`)}</div>
          <div class="detail-line"><span class="field-label">ID:</span><span class="field-value">${escapeHTML(member.id || '')}</span></div>
          ${member.batch ? `<div class="detail-line"><span class="field-label">Batch:</span><span class="field-value">${formatBatchOrdinal(escapeHTML(member.batch))}</span></div>` : ''}
          ${member.section ? `<div class="detail-line"><span class="field-label">Section:</span><span class="field-value">${escapeHTML(member.section)}</span></div>` : ''}
        </div>
      `;
    });

    html += `
      <div class="detail-line dept-line" id="previewStudentDept" style="margin-top: 2mm;">${escapeHTML(state.studentDept || "[Department]")}</div>
      <div class="detail-line uni-line" id="previewStudentUni">${escapeHTML(state.studentUni || "[University]")}</div>
    `;
    elements.submittedByBody.innerHTML = html;
  } else {
    // Single Student
    let extraLines = '';
    if (state.section && state.section.trim()) {
      extraLines += `<div class="detail-line"><span class="field-label">Section:</span><span class="field-value">${escapeHTML(state.section)}</span></div>`;
    }
    if (state.semester && state.semester.trim()) {
      extraLines += `<div class="detail-line"><span class="field-label">Semester:</span><span class="field-value">${formatBatchOrdinal(escapeHTML(state.semester))}</span></div>`;
    }

    // Custom fields
    if (state.customFields && state.customFields.length > 0) {
      state.customFields.forEach(cf => {
        if (cf.label && cf.value) {
          extraLines += `<div class="detail-line"><span class="field-label">${escapeHTML(cf.label)}:</span><span class="field-value">${escapeHTML(cf.value)}</span></div>`;
        }
      });
    }

    elements.submittedByBody.innerHTML = `
      <div class="person-name" id="previewStudentName" contenteditable="true" title="Click to edit name">${escapeHTML(sName)}</div>
      <div class="detail-line">
        <span class="field-label">ID:</span>
        <span class="field-value" id="previewStudentId" contenteditable="true" title="Click to edit ID">${escapeHTML(sId)}</span>
      </div>
      <div class="detail-line">
        <span class="field-label">Batch:</span>
        <span class="field-value" id="previewBatch" contenteditable="true" title="Click to edit batch">${formatBatchOrdinal(escapeHTML(sBatch))}</span>
      </div>
      ${extraLines}
      <div class="detail-line dept-line" id="previewStudentDept" contenteditable="true" title="Click to edit department">${escapeHTML(state.studentDept || "[Department]")}</div>
      <div class="detail-line uni-line" id="previewStudentUni" contenteditable="true" title="Click to edit university">${escapeHTML(state.studentUni || "[University]")}</div>
    `;

    // Re-bind editable listeners for newly rendered elements
    bindInlineEditableListeners();
  }
}

/**
 * Add / Remove Custom Fields (e.g. Session, Registration No)
 */
function addCustomField() {
  if (!state.customFields) state.customFields = [];
  state.customFields.push({ label: 'Session', value: '' });
  renderCustomFieldsInputs();
  updateStudentSection();
  saveState();
}

function removeCustomField(idx) {
  state.customFields.splice(idx, 1);
  renderCustomFieldsInputs();
  updateStudentSection();
  saveState();
}

function renderCustomFieldsInputs() {
  if (!elements.customFieldsInputs) return;
  elements.customFieldsInputs.innerHTML = '';

  (state.customFields || []).forEach((field, i) => {
    const div = document.createElement('div');
    div.className = 'custom-field-row';
    div.innerHTML = `
      <input type="text" placeholder="Label (e.g. Session)" value="${escapeHTML(field.label)}" oninput="updateCustomFieldData(${i}, 'label', this.value)" style="flex: 1.2;">
      <input type="text" placeholder="Value (e.g. 2022-2023)" value="${escapeHTML(field.value)}" oninput="updateCustomFieldData(${i}, 'value', this.value)" style="flex: 2;">
      <button type="button" class="remove-member-btn" onclick="removeCustomField(${i})" title="Remove line">✕</button>
    `;
    elements.customFieldsInputs.appendChild(div);
  });
}

window.updateCustomFieldData = function(index, key, value) {
  if (state.customFields[index]) {
    state.customFields[index][key] = value;
    updateStudentSection();
    saveState();
  }
};

/**
 * Preset button handler: Switches between Lab Report, Assignment, Project, etc.
 */
function applyTypePreset(type) {
  state.reportTitle = type;
  elements.reportTitle.value = type;
  elements.previewReportTitle.textContent = type;

  // Update dynamic labels
  const isAssign = type.toLowerCase().includes('assignment');
  if (isAssign) {
    elements.labelDocNumber.textContent = 'Assignment No. (Optional)';
    elements.labelDocTopic.textContent = 'Assignment Topic / Title (Optional)';
    elements.docNumber.placeholder = 'e.g. 01, 02 (optional)';
    elements.docTopic.placeholder = 'e.g. Solving Linear Equations (optional)';
  } else {
    elements.labelDocNumber.textContent = 'Experiment No. (Optional)';
    elements.labelDocTopic.textContent = 'Experiment Name / Title (Optional)';
    elements.docNumber.placeholder = 'e.g. 01, 02 (optional)';
    elements.docTopic.placeholder = 'e.g. Newton-Raphson Method (optional)';
  }

  // Update active pill
  document.querySelectorAll('.preset-pill').forEach(pill => {
    if (pill.dataset.type === type) {
      pill.classList.add('active');
    } else {
      pill.classList.remove('active');
    }
  });

  updatePageIndicator();
  updateExtraMetaSection();
  saveState();
  showToast(`Switched to "${type}" mode`);
}

function updatePageIndicator() {
  if (elements.currentModeBadge) {
    elements.currentModeBadge.textContent = `Current: ${state.reportTitle}`;
  }
  if (elements.previewPageIndicator) {
    elements.previewPageIndicator.textContent = `Live A4 Preview • ${state.reportTitle}`;
  }
}

/**
 * Start completely blank for a new student
 */
function startBlankForm() {
  state.studentName = "";
  state.studentId = "";
  state.batch = "";
  state.section = "";
  state.semester = "";
  state.courseCode = "";
  state.courseTitle = "";
  state.docNumber = "";
  state.docTopic = "";
  state.teacherName = "";
  state.teacherDesignation = "Lecturer";
  state.customFields = [];
  state.groupMembers = [];
  state.groupMode = false;

  populateFormFromState();
  updateStudentSection();
  updateExtraMetaSection();
  renderCustomFieldsInputs();
  saveState();
  showToast('Blank form ready! Fill in your details.');
}

/**
 * Apply Department Preset for all BIU departments
 */
function applyDepartmentPreset(dept) {
  if (!dept) return;
  state.studentDept = dept;
  state.teacherDept = dept;
  elements.studentDept.value = dept;
  elements.teacherDept.value = dept;
  elements.previewStudentDept.textContent = dept;
  elements.previewTeacherDept.textContent = dept;
  saveState();
  showToast(`Department set to ${dept}`);
}

/**
 * Save Student Profile to localStorage (for university students)
 */
function saveStudentProfile() {
  const profile = {
    studentName: state.studentName,
    studentId: state.studentId,
    batch: state.batch,
    section: state.section,
    semester: state.semester,
    studentDept: state.studentDept,
    studentUni: state.studentUni,
    customFields: state.customFields || []
  };
  localStorage.setItem('biu_student_profile', JSON.stringify(profile));
  showToast('Student profile saved! You can load it anytime for any new assignment.');
}

/**
 * Load Student Profile
 */
function loadStudentProfile() {
  const saved = localStorage.getItem('biu_student_profile');
  if (!saved) {
    showToast('No saved profile found. Fill in your details and click "Save Profile" first.');
    return;
  }
  try {
    const profile = JSON.parse(saved);
    Object.assign(state, profile);
    populateFormFromState();
    updateStudentSection();
    renderCustomFieldsInputs();
    saveState();
    showToast(`Loaded profile for ${profile.studentName || 'Student'}!`);
  } catch (e) {
    showToast('Error loading profile.');
  }
}

/**
 * Clear Course & Teacher fields (keeps student profile for their next assignment)
 */
function clearCourseFields() {
  state.courseCode = "";
  state.courseTitle = "";
  state.docNumber = "";
  state.docTopic = "";
  state.teacherName = "";
  state.teacherDesignation = "Lecturer";
  populateFormFromState();
  updateExtraMetaSection();
  saveState();
  showToast('Course fields cleared for your next assignment/course!');
}

/**
 * Set today's date in academic format (e.g. 6 September 2026)
 */
function setTodayDate() {
  const now = new Date();
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const dateStr = `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
  state.submissionDate = dateStr;
  elements.submissionDate.value = dateStr;
  elements.previewSubmissionDate.textContent = dateStr;
  saveState();
}

/**
 * Handle calendar select
 */
function onCalendarSelect(isoDate) {
  if (!isoDate) return;
  const parts = isoDate.split('-');
  if (parts.length !== 3) return;
  const year = parts[0];
  const monthIdx = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const formatted = `${day} ${months[monthIdx]} ${year}`;
  state.submissionDate = formatted;
  elements.submissionDate.value = formatted;
  elements.previewSubmissionDate.textContent = formatted;
  saveState();
}

/**
 * Update Accent Color
 */
function updateAccentColor(hex) {
  state.accentColor = hex;
  elements.accentColor.value = hex;
  document.documentElement.style.setProperty('--accent-color', hex);

  // Update active swatch
  document.querySelectorAll('.color-swatch').forEach(swatch => {
    if (swatch.style.backgroundColor === hex || rgbToHex(swatch.style.backgroundColor) === hex.toLowerCase()) {
      swatch.classList.add('active');
    } else {
      swatch.classList.remove('active');
    }
  });
  saveState();
}

/**
 * Watermark Opacity Slider
 */
function updateWatermarkOpacity(val) {
  state.watermarkOpacity = parseInt(val, 10);
  const decimal = state.watermarkOpacity / 100;
  document.documentElement.style.setProperty('--watermark-opacity', decimal);
  elements.opacityValueDisplay.textContent = `${state.watermarkOpacity}%`;
  saveState();
}

/**
 * Watermark Scale Slider
 */
function updateWatermarkScale(val) {
  state.watermarkScale = parseInt(val, 10);
  const decimal = state.watermarkScale / 100;
  document.documentElement.style.setProperty('--watermark-scale', decimal);
  elements.scaleValueDisplay.textContent = `${state.watermarkScale}%`;
  saveState();
}

/**
 * Custom Logo Upload
 */
function handleCustomLogo(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const dataUrl = e.target.result;
    elements.watermarkLogo.src = dataUrl;
    elements.headerLogoImg.src = dataUrl;
    showToast('Custom logo applied!');
  };
  reader.readAsDataURL(file);
}

/**
 * Restore official BIU crest
 */
function restoreDefaultLogo() {
  const logoSrc = window.DEFAULT_LOGO_BASE64 || 'assets/biu_logo.png';
  elements.watermarkLogo.src = logoSrc;
  elements.headerLogoImg.src = logoSrc;
  showToast('Restored official BIU seal');
}

/**
 * Toggle Right Box Offset
 */
function toggleRightBoxOffset() {
  state.offsetRightBox = elements.offsetRightBoxToggle.checked;
  if (state.offsetRightBox) {
    elements.boxSubmittedTo.classList.add('offset-down');
  } else {
    elements.boxSubmittedTo.classList.remove('offset-down');
  }
  saveState();
}

/**
 * Group Mode (Multiple Students)
 */
function toggleGroupMode() {
  state.groupMode = elements.groupModeToggle.checked;
  if (state.groupMode) {
    elements.groupMembersList.classList.remove('hidden');
    if (state.groupMembers.length === 0) {
      addGroupMember();
    }
  } else {
    elements.groupMembersList.classList.add('hidden');
  }
  updateStudentSection();
  saveState();
}

function addGroupMember() {
  const newMember = { name: '', id: '', batch: state.batch || '', section: state.section || '' };
  state.groupMembers.push(newMember);
  renderGroupMemberInputs();
  updateStudentSection();
  saveState();
}

function removeGroupMember(index) {
  state.groupMembers.splice(index, 1);
  renderGroupMemberInputs();
  updateStudentSection();
  saveState();
}

function renderGroupMemberInputs() {
  elements.membersInputs.innerHTML = '';
  state.groupMembers.forEach((member, i) => {
    const div = document.createElement('div');
    div.className = 'member-row';
    div.innerHTML = `
      <input type="text" placeholder="Name" value="${escapeHTML(member.name)}" oninput="updateMemberData(${i}, 'name', this.value)" style="flex: 2;">
      <input type="text" placeholder="ID" value="${escapeHTML(member.id)}" oninput="updateMemberData(${i}, 'id', this.value)" style="flex: 1.5;">
      <input type="text" placeholder="Batch" value="${escapeHTML(member.batch)}" oninput="updateMemberData(${i}, 'batch', this.value)" style="flex: 1;">
      <button type="button" class="remove-member-btn" onclick="removeGroupMember(${i})" title="Remove">✕</button>
    `;
    elements.membersInputs.appendChild(div);
  });
}

window.updateMemberData = function(index, field, value) {
  if (state.groupMembers[index]) {
    state.groupMembers[index][field] = value;
    updateStudentSection();
    saveState();
  }
};

/**
 * Zoom Controls
 */
function adjustZoom(delta) {
  currentZoom = Math.min(Math.max(0.4, currentZoom + delta), 1.5);
  applyZoom();
}

function setFitZoom() {
  calculateAutoFitZoom();
}

function applyZoom() {
  elements.sheetScaler.style.transform = `scale(${currentZoom})`;
  elements.zoomPercent.textContent = `${Math.round(currentZoom * 100)}%`;
}

function calculateAutoFitZoom() {
  if (!elements.previewViewport || !elements.coverPageSheet) return;
  const viewportWidth = elements.previewViewport.clientWidth - 48;
  const viewportHeight = elements.previewViewport.clientHeight - 48;
  const sheetWidthPx = elements.coverPageSheet.offsetWidth || 794;
  const sheetHeightPx = elements.coverPageSheet.offsetHeight || 1123;

  const scaleW = viewportWidth / sheetWidthPx;
  const scaleH = viewportHeight / sheetHeightPx;
  currentZoom = Math.min(scaleW, scaleH, 1.0);
  currentZoom = Math.max(0.45, Math.min(1.2, currentZoom));
  applyZoom();
}

/**
 * Mobile Tab Switcher
 */
function switchMobileTab(tab) {
  const formBtn = document.getElementById('tabFormBtn');
  const previewBtn = document.getElementById('tabPreviewBtn');

  if (tab === 'form') {
    elements.editorPane.classList.remove('hidden-mobile');
    elements.previewPane.classList.add('hidden-mobile');
    formBtn.classList.add('active');
    previewBtn.classList.remove('active');
  } else {
    elements.editorPane.classList.add('hidden-mobile');
    elements.previewPane.classList.remove('hidden-mobile');
    previewBtn.classList.add('active');
    formBtn.classList.remove('active');
    calculateAutoFitZoom();
  }
}

/**
 * Theme Toggle (Dark / Light)
 */
function toggleTheme() {
  const isLight = document.body.classList.toggle('theme-light');
  document.body.classList.toggle('theme-dark', !isLight);
  if (isLight) {
    elements.themeIconDark.classList.add('hidden');
    elements.themeIconLight.classList.remove('hidden');
    localStorage.setItem('biu_theme', 'light');
  } else {
    elements.themeIconDark.classList.remove('hidden');
    elements.themeIconLight.classList.add('hidden');
    localStorage.setItem('biu_theme', 'dark');
  }
}

/**
 * Collapsible Cards
 */
function toggleCardCollapse(headerEl) {
  const card = headerEl.closest('.form-card');
  if (card) {
    card.classList.toggle('collapsed');
  }
}

/**
 * Native Browser Print / Vector PDF
 */
function printDocument() {
  showToast('Opening print dialog...', 2000);
  setTimeout(() => {
    window.print();
  }, 200);
}

/**
 * Generate & Download High-Quality A4 PDF via html2pdf
 */
async function generatePDF() {
  if (typeof html2pdf === 'undefined') {
    alert('PDF generator library is still initializing. Please wait a moment or use "Print / Save".');
    return;
  }

  showToast('Generating high-res A4 PDF...', 10000, true);

  const sheet = elements.coverPageSheet;
  const studentClean = (state.studentName || 'Student').replace(/[^a-zA-Z0-9]/g, '_');
  const courseClean = (state.courseCode || 'Course').replace(/[^a-zA-Z0-9]/g, '_');
  const titleClean = (state.reportTitle || 'CoverPage').replace(/[^a-zA-Z0-9]/g, '_');
  const filename = `${titleClean}_${courseClean}_${studentClean}.pdf`;

  const opt = {
    margin: 0,
    filename: filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: {
      scale: 2.5,
      useCORS: true,
      letterRendering: true,
      scrollX: 0,
      scrollY: 0,
      logging: false
    },
    jsPDF: {
      unit: 'mm',
      format: 'a4',
      orientation: 'portrait'
    }
  };

  try {
    await html2pdf().set(opt).from(sheet).save();
    showToast('PDF downloaded successfully! 🎉', 3500);
  } catch (err) {
    console.error('PDF Generation Error:', err);
    showToast('Export error. Opening browser print dialog...', 3000);
    setTimeout(() => window.print(), 1000);
  }
}

/**
 * Download High-Res PNG Image
 */
async function downloadImage() {
  showToast('Generating PNG image...', 5000, true);
  try {
    if (typeof html2canvas === 'undefined' && typeof html2pdf !== 'undefined') {
      window.html2canvas = html2pdf().Worker.prototype.toCanvas;
    }
    const canvas = await html2canvas(elements.coverPageSheet, {
      scale: 2.5,
      useCORS: true,
      logging: false
    });
    const link = document.createElement('a');
    link.download = `${state.reportTitle || 'CoverPage'}_${state.studentName || 'Document'}.png`.replace(/\s+/g, '_');
    link.href = canvas.toDataURL('image/png');
    link.click();
    showToast('PNG image downloaded! 🎉', 3000);
  } catch (e) {
    console.error(e);
    showToast('Could not export PNG.', 3000);
  }
}

/**
 * Reset to sample reference
 */
function resetToSample() {
  state = { ...DEFAULT_DATA, groupMembers: [], customFields: [] };
  localStorage.removeItem('biu_generator_state');
  populateFormFromState();
  updateStudentSection();
  updateExtraMetaSection();
  renderCustomFieldsInputs();
  updateAccentColor(state.accentColor);
  updateWatermarkOpacity(state.watermarkOpacity);
  updateWatermarkScale(state.watermarkScale);
  restoreDefaultLogo();
  showToast('Loaded demo sample data');
}

/**
 * Populate Form Fields from state
 */
function populateFormFromState() {
  elements.uniLine1.value = state.uniLine1;
  elements.uniLine2.value = state.uniLine2;
  elements.reportTitle.value = state.reportTitle;
  elements.courseCode.value = state.courseCode;
  elements.courseTitle.value = state.courseTitle;
  if (elements.docNumber) elements.docNumber.value = state.docNumber || "";
  if (elements.docTopic) elements.docTopic.value = state.docTopic || "";
  elements.studentName.value = state.studentName;
  elements.studentId.value = state.studentId;
  elements.batch.value = state.batch;
  if (elements.section) elements.section.value = state.section || "";
  if (elements.semester) elements.semester.value = state.semester || "";
  elements.studentDept.value = state.studentDept;
  elements.studentUni.value = state.studentUni;
  elements.teacherName.value = state.teacherName;
  elements.teacherDesignation.value = state.teacherDesignation;
  elements.teacherDept.value = state.teacherDept;
  elements.teacherUni.value = state.teacherUni;
  elements.submissionDate.value = state.submissionDate;
  elements.accentColor.value = state.accentColor;
  elements.watermarkOpacity.value = state.watermarkOpacity;
  elements.watermarkScale.value = state.watermarkScale;
  elements.offsetRightBoxToggle.checked = state.offsetRightBox;
  elements.groupModeToggle.checked = state.groupMode;

  // Live text
  elements.previewUniLine1.textContent = state.uniLine1 || "[University Name]";
  elements.previewUniLine2.textContent = state.uniLine2 || "";
  elements.previewReportTitle.textContent = state.reportTitle || "Report";
  elements.previewCourseCode.textContent = state.courseCode || "[Course Code]";
  elements.previewCourseTitle.textContent = state.courseTitle || "[Course Title]";
  elements.previewTeacherName.textContent = state.teacherName || "[Teacher Name]";
  elements.previewTeacherDesignation.textContent = state.teacherDesignation || "[Designation]";
  elements.previewTeacherDept.textContent = state.teacherDept || "[Department]";
  elements.previewTeacherUni.textContent = state.teacherUni || "[University]";
  elements.previewSubmissionDate.textContent = state.submissionDate || "[Date of Submission]";

  if (state.offsetRightBox) {
    elements.boxSubmittedTo.classList.add('offset-down');
  } else {
    elements.boxSubmittedTo.classList.remove('offset-down');
  }

  updatePageIndicator();

  // Presets active button
  document.querySelectorAll('.preset-pill').forEach(pill => {
    if (pill.dataset.type === state.reportTitle) {
      pill.classList.add('active');
    } else {
      pill.classList.remove('active');
    }
  });

  if (state.groupMode) {
    elements.groupMembersList.classList.remove('hidden');
    renderGroupMemberInputs();
  } else {
    elements.groupMembersList.classList.add('hidden');
  }

  renderCustomFieldsInputs();
}

/**
 * State Persistence in localStorage
 */
function saveState() {
  try {
    localStorage.setItem('biu_generator_state', JSON.stringify(state));
  } catch (e) {
    // Ignore quota issues
  }
}

function loadSavedState() {
  const savedTheme = localStorage.getItem('biu_theme');
  if (savedTheme === 'light') {
    document.body.classList.add('theme-light');
    document.body.classList.remove('theme-dark');
    elements.themeIconDark.classList.add('hidden');
    elements.themeIconLight.classList.remove('hidden');
  }

  try {
    const saved = localStorage.getItem('biu_generator_state');
    if (saved) {
      const parsed = JSON.parse(saved);
      state = { ...DEFAULT_DATA, ...parsed };
      if (state.watermarkScale < 100) {
        state.watermarkScale = 105;
      }
    }
  } catch (e) {
    state = { ...DEFAULT_DATA };
  }

  populateFormFromState();
  updateStudentSection();
  updateExtraMetaSection();
  updateAccentColor(state.accentColor);
  updateWatermarkOpacity(state.watermarkOpacity);
  updateWatermarkScale(state.watermarkScale);
}

/**
 * Notification Toast
 */
let toastTimeout = null;
function showToast(message, duration = 3000, showSpinner = false) {
  if (toastTimeout) clearTimeout(toastTimeout);
  elements.toastMessage.textContent = message;
  elements.toastSpinner.style.display = showSpinner ? 'block' : 'none';
  elements.toastNotification.classList.remove('hidden');

  toastTimeout = setTimeout(() => {
    elements.toastNotification.classList.add('hidden');
  }, duration);
}

/**
 * Utilities
 */
function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

function escapeHTML(str) {
  if (!str) return '';
  return str.replace(/[&<>'"]/g, tag => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  }[tag] || tag));
}

function rgbToHex(rgb) {
  if (!rgb || !rgb.startsWith('rgb')) return rgb;
  const match = rgb.match(/\d+/g);
  if (!match || match.length < 3) return rgb;
  return '#' + match.slice(0, 3).map(x => {
    const hex = parseInt(x, 10).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}
