/**
 * HTML Element Storage Utility
 * 
 * Stores HTML of interacted elements for debugging and reference
 */

const fs = require('fs');
const path = require('path');

class HTMLStorage {
  constructor(testName) {
    this.testName = testName;
    this.elements = [];
    this.storageDir = path.join(__dirname, '../element-storage');
    
    // Create storage directory if it doesn't exist
    if (!fs.existsSync(this.storageDir)) {
      fs.mkdirSync(this.storageDir, { recursive: true });
    }
  }

  /**
   * Add element to storage
   * @param {Object} elementData - Element data
   */
  addElement(elementData) {
    this.elements.push({
      ...elementData,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Save stored elements to file
   * @param {string} filename - Optional custom filename
   */
  save(filename = null) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const safeTestName = this.testName.replace(/[^a-zA-Z0-9]/g, '_');
    const file = filename || `${safeTestName}_${timestamp}.json`;
    const filePath = path.join(this.storageDir, file);

    const data = {
      testName: this.testName,
      timestamp: new Date().toISOString(),
      elements: this.elements,
    };

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`Element storage saved to: ${filePath}`);
    return filePath;
  }

  /**
   * Save as HTML report
   * @param {string} filename - Optional custom filename
   */
  saveAsHTML(filename = null) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const safeTestName = this.testName.replace(/[^a-zA-Z0-9]/g, '_');
    const file = filename || `${safeTestName}_${timestamp}.html`;
    const filePath = path.join(this.storageDir, file);

    const html = this.generateHTMLReport();
    fs.writeFileSync(filePath, html);
    console.log(`HTML report saved to: ${filePath}`);
    return filePath;
  }

  /**
   * Generate HTML report
   * @returns {string} HTML content
   */
  generateHTMLReport() {
    const elementsHTML = this.elements.map((el, index) => `
      <div class="element-item">
        <h3>Element ${index + 1}: ${el.action}</h3>
        <p><strong>Selector:</strong> <code>${el.selector || 'N/A'}</code></p>
        <p><strong>Timestamp:</strong> ${el.timestamp}</p>
        <details>
          <summary>HTML Code</summary>
          <pre><code>${this.escapeHTML(el.html || 'N/A')}</code></pre>
        </details>
      </div>
    `).join('');

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Element Storage Report - ${this.testName}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f5f5f5;
    }
    .header {
      background-color: #2c3e50;
      color: white;
      padding: 20px;
      border-radius: 5px;
      margin-bottom: 20px;
    }
    .element-item {
      background-color: white;
      padding: 15px;
      margin-bottom: 15px;
      border-radius: 5px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .element-item h3 {
      margin-top: 0;
      color: #2c3e50;
    }
    code {
      background-color: #f4f4f4;
      padding: 2px 6px;
      border-radius: 3px;
      font-family: 'Courier New', monospace;
    }
    pre {
      background-color: #f4f4f4;
      padding: 15px;
      border-radius: 5px;
      overflow-x: auto;
    }
    details {
      margin-top: 10px;
    }
    summary {
      cursor: pointer;
      font-weight: bold;
      color: #3498db;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>Element Storage Report</h1>
    <p><strong>Test:</strong> ${this.testName}</p>
    <p><strong>Generated:</strong> ${new Date().toISOString()}</p>
    <p><strong>Total Elements:</strong> ${this.elements.length}</p>
  </div>
  ${elementsHTML}
</body>
</html>`;
  }

  /**
   * Escape HTML special characters
   * @param {string} text - Text to escape
   * @returns {string} Escaped text
   */
  escapeHTML(text) {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /**
   * Clear stored elements
   */
  clear() {
    this.elements = [];
  }
}

module.exports = HTMLStorage;
