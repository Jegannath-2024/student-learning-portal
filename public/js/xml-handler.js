/**
 * XML, XML DTD, and XML Schema (XSD) Handler
 * Uses Native Browser DOMParser, XMLSerializer, and DOM Methods to process Curriculum XML
 */
class XmlCurriculumManager {
  constructor() {
    this.rawXmlText = "";
    this.xmlDoc = null;
  }

  /**
   * Fetches the official XML curriculum from the REST endpoint using AJAX
   */
  async loadCurriculumXml() {
    try {
      const response = await fetch('/api/curriculum/xml');
      if (!response.ok) {
        throw new Error(`HTTP Error ${response.status}: Failed to retrieve curriculum XML`);
      }
      this.rawXmlText = await response.text();

      // Native HTML5 / Browser DOMParser for XML
      const parser = new DOMParser();
      this.xmlDoc = parser.parseFromString(this.rawXmlText, "text/xml");

      // Check for XML parse errors
      const parserError = this.xmlDoc.getElementsByTagName("parsererror");
      if (parserError.length > 0) {
        throw new Error("XML Parser Error: " + parserError[0].textContent);
      }

      this.renderCurriculumTree();
      this.renderRawXmlPreview();
      return true;
    } catch (err) {
      console.error("XmlCurriculumManager error:", err);
      return false;
    }
  }

  /**
   * Traverses XML DOM using DOM methods (getElementsByTagName, getAttribute, textContent)
   */
  renderCurriculumTree() {
    const treeContainer = document.getElementById("xml-tree-view");
    if (!treeContainer || !this.xmlDoc) return;

    // Direct DOM method: empty existing nodes
    while (treeContainer.firstChild) {
      treeContainer.removeChild(treeContainer.firstChild);
    }

    const fragment = document.createDocumentFragment();

    const academicYear = this.xmlDoc.getElementsByTagName("academicYear")[0]?.textContent || "N/A";
    const department = this.xmlDoc.getElementsByTagName("department")[0]?.textContent || "N/A";

    const headerNode = document.createElement("div");
    headerNode.className = "mb-4 pb-3 border-b";
    headerNode.innerHTML = `
      <div style="font-weight:700; color:var(--primary); font-size:15px;">${department}</div>
      <div style="font-size:12px; color:var(--text-muted);">Academic Year: <strong>${academicYear}</strong> • Verified against <code>curriculum.dtd</code> &amp; <code>curriculum.xsd</code></div>
    `;
    fragment.appendChild(headerNode);

    // Get all course elements via XML DOM method
    const courses = this.xmlDoc.getElementsByTagName("course");

    for (let i = 0; i < courses.length; i++) {
      const courseNode = courses[i];
      const courseId = courseNode.getAttribute("id");
      const category = courseNode.getAttribute("category");

      const code = courseNode.getElementsByTagName("courseCode")[0]?.textContent || "";
      const title = courseNode.getElementsByTagName("title")[0]?.textContent || "";
      const credits = courseNode.getElementsByTagName("credits")[0]?.textContent || "";
      const level = courseNode.getElementsByTagName("level")[0]?.textContent || "";
      const duration = courseNode.getElementsByTagName("duration")[0]?.textContent || "";
      const instructorName = courseNode.getElementsByTagName("name")[0]?.textContent || "";
      const instructorEmail = courseNode.getElementsByTagName("email")[0]?.textContent || "";
      const desc = courseNode.getElementsByTagName("description")[0]?.textContent || "";

      const courseBox = document.createElement("div");
      courseBox.className = "p-3 mb-3 border rounded";
      courseBox.style.cssText = "border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 16px; margin-bottom: 16px; background: var(--bg-surface);";

      let modulesHtml = "";
      const modules = courseNode.getElementsByTagName("module");
      for (let j = 0; j < modules.length; j++) {
        const mod = modules[j];
        const modTitle = mod.getElementsByTagName("moduleTitle")[0]?.textContent || "";
        const lessons = mod.getElementsByTagName("lesson");

        let lessonsList = "";
        for (let k = 0; k < lessons.length; k++) {
          const les = lessons[k];
          const lesTitle = les.getElementsByTagName("lessonTitle")[0]?.textContent || "";
          const dur = les.getElementsByTagName("durationMinutes")[0]?.textContent || "";
          lessonsList += `<li style="margin-left: 20px; font-size: 12px; color: var(--text-muted); list-style-type: circle;">${lesTitle} (${dur} min)</li>`;
        }

        modulesHtml += `
          <div style="margin-top: 8px;">
            <div style="font-size: 13px; font-weight: 600; color: var(--text-main);">${modTitle}</div>
            <ul style="margin: 4px 0;">${lessonsList}</ul>
          </div>
        `;
      }

      courseBox.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
          <span style="font-size:12px; font-weight:700; color:var(--primary);">${code} • ${category}</span>
          <span style="font-size:11px; background:var(--primary-light); color:var(--primary); padding:2px 8px; border-radius:4px; font-weight:600;">${credits} Credits (${level})</span>
        </div>
        <h4 style="font-size:16px; font-weight:700; color:var(--text-main); margin-bottom:4px;">${title}</h4>
        <p style="font-size:12px; color:var(--text-muted); margin-bottom:8px;">${desc}</p>
        <div style="font-size:11px; color:var(--text-light); margin-bottom:10px;">Instructor: ${instructorName} (${instructorEmail}) • Duration: ${duration}</div>
        <div style="background:var(--bg-secondary); padding:10px; border-radius:6px;">
          <strong style="font-size:12px; color:var(--text-main);">Curriculum Modules &amp; Learning Outcomes:</strong>
          ${modulesHtml}
        </div>
      `;

      fragment.appendChild(courseBox);
    }

    treeContainer.appendChild(fragment);
  }

  renderRawXmlPreview() {
    const rawBox = document.getElementById("raw-xml-viewer");
    if (rawBox) {
      // Escape HTML special characters for syntax visibility
      rawBox.textContent = this.rawXmlText;
    }

    const editArea = document.getElementById("xml-validator-input");
    if (editArea && !editArea.value) {
      editArea.value = this.rawXmlText;
    }
  }

  /**
   * Validates XML against DTD / Schema constraints via backend AJAX POST
   */
  async validateXmlContent(xmlString) {
    const outputEl = document.getElementById("xml-validation-status");
    if (!outputEl) return;

    outputEl.className = "validation-output";
    outputEl.style.display = "block";
    outputEl.innerHTML = "Validating XML against DTD and Schema declarations...";

    try {
      const response = await fetch('/api/curriculum/validate-xml', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ xmlContent: xmlString })
      });

      const res = await response.json();

      if (res.valid) {
        outputEl.className = "validation-output success";
        outputEl.innerHTML = `
          <strong>Validation Success:</strong> ${res.message}<br>
          Department: <em>${res.department}</em> • Accredited Courses Count: <strong>${res.courseCount}</strong>
        `;
      } else {
        outputEl.className = "validation-output error";
        const issueList = res.issues ? res.issues.map(i => `<li>${i}</li>`).join('') : `<li>${res.message || 'Unknown Schema Violation'}</li>`;
        outputEl.innerHTML = `
          <strong>Schema / DTD Validation Warning:</strong><br>
          <ul style="margin: 6px 0 0 16px;">${issueList}</ul>
        `;
      }
    } catch (err) {
      outputEl.className = "validation-output error";
      outputEl.innerHTML = `<strong>Request Failed:</strong> ${err.message}`;
    }
  }

  /**
   * Triggers client-side download of the official Curriculum XML file
   */
  downloadXmlFile() {
    if (!this.rawXmlText) return;
    const blob = new Blob([this.rawXmlText], { type: "application/xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "curriculum-specification.xml";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

// Global instance
window.xmlCurriculumManager = new XmlCurriculumManager();
