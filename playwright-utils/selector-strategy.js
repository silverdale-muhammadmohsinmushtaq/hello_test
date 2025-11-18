/**
 * Robust Selector Strategy Utility for Playwright
 * 
 * This utility provides multiple fallback strategies to find elements reliably.
 * Priority order: data-testid > role > text > CSS > XPath
 */

class SelectorStrategy {
  constructor(page) {
    this.page = page;
    this.interactedElements = []; // Store HTML of interacted elements
  }

  /**
   * Find element using multiple strategies with fallbacks
   * @param {Object} options - Selector options
   * @param {string} options.testId - data-testid attribute
   * @param {string} options.role - ARIA role
   * @param {string} options.text - Visible text content
   * @param {string} options.css - CSS selector
   * @param {string} options.xpath - XPath selector
   * @param {string} options.name - Name attribute
   * @param {string} options.label - Label text
   * @param {Object} options.options - Additional Playwright locator options
   * @returns {Promise<Locator>} Playwright locator
   */
  async findElement(options = {}) {
    const strategies = [
      // Strategy 1: data-testid (most reliable)
      () => options.testId && this.page.getByTestId(options.testId),
      
      // Strategy 2: Role-based selector
      () => {
        if (options.role && options.name) {
          return this.page.getByRole(options.role, { name: options.name, ...options.options });
        }
        if (options.role && options.text) {
          return this.page.getByRole(options.role, { name: options.text, ...options.options });
        }
        return null;
      },
      
      // Strategy 3: Text-based selector
      () => options.text && this.page.getByText(options.text, { exact: false }),
      
      // Strategy 4: Label-based selector
      () => options.label && this.page.getByLabel(options.label),
      
      // Strategy 5: Placeholder-based selector
      () => options.placeholder && this.page.getByPlaceholder(options.placeholder),
      
      // Strategy 6: CSS selector
      () => options.css && this.page.locator(options.css),
      
      // Strategy 7: XPath selector (last resort)
      () => options.xpath && this.page.locator(options.xpath),
    ];

    // Try each strategy until one works
    for (const strategy of strategies) {
      try {
        const locator = strategy();
        if (locator) {
          // Verify element exists and is visible
          const count = await locator.count();
          if (count > 0) {
            const firstLocator = locator.first();
            const isVisible = await firstLocator.isVisible().catch(() => false);
            if (isVisible) {
              return firstLocator;
            }
          }
        }
      } catch (error) {
        // Continue to next strategy
        continue;
      }
    }

    throw new Error(`Element not found with any strategy. Options: ${JSON.stringify(options)}`);
  }

  /**
   * Find element with retry logic
   * @param {Object} options - Selector options
   * @param {number} maxRetries - Maximum retry attempts
   * @param {number} timeout - Timeout in milliseconds
   * @returns {Promise<Locator>} Playwright locator
   */
  async findElementWithRetry(options = {}, maxRetries = 3, timeout = 30000) {
    let lastError;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const locator = await this.findElement(options);
        // Wait for element to be visible and stable
        await locator.waitFor({ state: 'visible', timeout });
        return locator;
      } catch (error) {
        lastError = error;
        if (attempt < maxRetries) {
          await this.page.waitForTimeout(1000 * attempt); // Exponential backoff
        }
      }
    }
    
    throw new Error(`Failed to find element after ${maxRetries} attempts. ${lastError?.message || ''}`);
  }

  /**
   * Store HTML of interacted element
   * @param {Locator} locator - Element locator
   * @param {string} action - Action performed (click, fill, etc.)
   */
  async storeElementHTML(locator, action) {
    try {
      const html = await locator.evaluate((el) => el.outerHTML);
      const selector = await locator.evaluate((el) => {
        // Try to get the best selector
        if (el.getAttribute('data-testid')) {
          return `[data-testid="${el.getAttribute('data-testid')}"]`;
        }
        if (el.id) {
          return `#${el.id}`;
        }
        if (el.className) {
          return `.${el.className.split(' ')[0]}`;
        }
        return el.tagName.toLowerCase();
      });
      
      this.interactedElements.push({
        timestamp: new Date().toISOString(),
        action,
        selector,
        html,
      });
    } catch (error) {
      console.warn('Failed to store element HTML:', error.message);
    }
  }

  /**
   * Get stored element HTMLs
   * @returns {Array} Array of stored element information
   */
  getStoredElements() {
    return this.interactedElements;
  }

  /**
   * Clear stored elements
   */
  clearStoredElements() {
    this.interactedElements = [];
  }
}

module.exports = SelectorStrategy;
