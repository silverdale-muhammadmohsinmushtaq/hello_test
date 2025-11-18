/**
 * Main Playwright Utilities Export
 * 
 * Provides a unified interface for all Playwright utilities
 */

const SelectorStrategy = require('./selector-strategy');
const ElementHelpers = require('./element-helpers');
const HTMLStorage = require('./html-storage');
const OdooHelpers = require('./odoo-helpers');

class PlaywrightUtils {
  constructor(page, testName = 'test') {
    this.page = page;
    this.testName = testName;
    this.selectorStrategy = new SelectorStrategy(page);
    this.elementHelpers = new ElementHelpers(page, this.selectorStrategy);
    this.htmlStorage = new HTMLStorage(testName);
    this.odooHelpers = new OdooHelpers(page, this.elementHelpers);
    
    // Intercept element storage
    const originalStore = this.selectorStrategy.storeElementHTML.bind(this.selectorStrategy);
    this.selectorStrategy.storeElementHTML = async (locator, action) => {
      await originalStore(locator, action);
      const elements = this.selectorStrategy.getStoredElements();
      if (elements.length > 0) {
        const lastElement = elements[elements.length - 1];
        this.htmlStorage.addElement(lastElement);
      }
    };
  }

  /**
   * Save all stored element HTMLs
   * @param {Object} options - Save options
   * @returns {Promise<string>} Path to saved file
   */
  async saveElementStorage(options = {}) {
    const { format = 'both' } = options; // 'json', 'html', or 'both'
    
    if (format === 'json' || format === 'both') {
      this.htmlStorage.save();
    }
    
    if (format === 'html' || format === 'both') {
      return this.htmlStorage.saveAsHTML();
    }
    
    return this.htmlStorage.save();
  }

  /**
   * Clear all stored data
   */
  clearStorage() {
    this.selectorStrategy.clearStoredElements();
    this.htmlStorage.clear();
  }
}

module.exports = {
  PlaywrightUtils,
  SelectorStrategy,
  ElementHelpers,
  HTMLStorage,
  OdooHelpers,
};
