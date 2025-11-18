/**
 * Element Interaction Helpers for Playwright
 * 
 * Provides robust element interaction methods with proper waits and error handling
 */

class ElementHelpers {
  constructor(page, selectorStrategy) {
    this.page = page;
    this.selectorStrategy = selectorStrategy;
  }

  /**
   * Click element with retry and proper waits
   * @param {Object} selectorOptions - Selector options
   * @param {Object} options - Additional options
   * @returns {Promise<void>}
   */
  async click(selectorOptions, options = {}) {
    const {
      maxRetries = 3,
      timeout = 30000,
      force = false,
      waitForNavigation = false,
    } = options;

    const locator = await this.selectorStrategy.findElementWithRetry(selectorOptions, maxRetries, timeout);
    
    // Wait for element to be actionable
    await locator.waitFor({ state: 'attached', timeout });
    await locator.scrollIntoViewIfNeeded();
    
    // Check if element is enabled
    const isEnabled = await locator.isEnabled().catch(() => false);
    if (!isEnabled && !force) {
      throw new Error(`Element is not enabled: ${JSON.stringify(selectorOptions)}`);
    }

    // Store element HTML before interaction
    await this.selectorStrategy.storeElementHTML(locator, 'click');

    // Perform click
    if (waitForNavigation) {
      await Promise.all([
        this.page.waitForLoadState('networkidle'),
        locator.click({ force, timeout }),
      ]);
    } else {
      await locator.click({ force, timeout });
    }

    // Small delay to ensure action is processed
    await this.page.waitForTimeout(500);
  }

  /**
   * Fill input field with retry and validation
   * @param {Object} selectorOptions - Selector options
   * @param {string} value - Value to fill
   * @param {Object} options - Additional options
   * @returns {Promise<void>}
   */
  async fill(selectorOptions, value, options = {}) {
    const {
      maxRetries = 3,
      timeout = 30000,
      clear = true,
      validate = true,
    } = options;

    const locator = await this.selectorStrategy.findElementWithRetry(selectorOptions, maxRetries, timeout);
    
    await locator.waitFor({ state: 'visible', timeout });
    await locator.scrollIntoViewIfNeeded();

    // Store element HTML before interaction
    await this.selectorStrategy.storeElementHTML(locator, 'fill');

    // Clear if needed
    if (clear) {
      await locator.clear();
    }

    // Fill the field
    await locator.fill(value, { timeout });

    // Validate if the value was set correctly
    if (validate) {
      const actualValue = await locator.inputValue().catch(() => '');
      if (actualValue !== value) {
        // Try again with force
        await locator.fill(value, { force: true, timeout });
      }
    }

    await this.page.waitForTimeout(300);
  }

  /**
   * Select option from dropdown
   * @param {Object} selectorOptions - Selector options
   * @param {string|number} value - Value or label to select
   * @param {Object} options - Additional options
   * @returns {Promise<void>}
   */
  async selectOption(selectorOptions, value, options = {}) {
    const {
      maxRetries = 3,
      timeout = 30000,
    } = options;

    const locator = await this.selectorStrategy.findElementWithRetry(selectorOptions, maxRetries, timeout);
    
    await locator.waitFor({ state: 'visible', timeout });
    await locator.scrollIntoViewIfNeeded();

    // Store element HTML before interaction
    await this.selectorStrategy.storeElementHTML(locator, 'selectOption');

    await locator.selectOption(value, { timeout });
    await this.page.waitForTimeout(300);
  }

  /**
   * Check or uncheck checkbox/radio
   * @param {Object} selectorOptions - Selector options
   * @param {boolean} checked - Whether to check or uncheck
   * @param {Object} options - Additional options
   * @returns {Promise<void>}
   */
  async setChecked(selectorOptions, checked = true, options = {}) {
    const {
      maxRetries = 3,
      timeout = 30000,
    } = options;

    const locator = await this.selectorStrategy.findElementWithRetry(selectorOptions, maxRetries, timeout);
    
    await locator.waitFor({ state: 'visible', timeout });
    await locator.scrollIntoViewIfNeeded();

    // Store element HTML before interaction
    await this.selectorStrategy.storeElementHTML(locator, `setChecked-${checked}`);

    await locator.setChecked(checked, { timeout });
    await this.page.waitForTimeout(300);
  }

  /**
   * Get text content from element
   * @param {Object} selectorOptions - Selector options
   * @param {Object} options - Additional options
   * @returns {Promise<string>}
   */
  async getText(selectorOptions, options = {}) {
    const {
      maxRetries = 3,
      timeout = 30000,
    } = options;

    const locator = await this.selectorStrategy.findElementWithRetry(selectorOptions, maxRetries, timeout);
    
    await locator.waitFor({ state: 'visible', timeout });
    
    return await locator.textContent({ timeout });
  }

  /**
   * Wait for element to be visible
   * @param {Object} selectorOptions - Selector options
   * @param {Object} options - Additional options
   * @returns {Promise<void>}
   */
  async waitForVisible(selectorOptions, options = {}) {
    const {
      timeout = 30000,
    } = options;

    const locator = await this.selectorStrategy.findElementWithRetry(selectorOptions, 3, timeout);
    await locator.waitFor({ state: 'visible', timeout });
  }

  /**
   * Wait for element to disappear
   * @param {Object} selectorOptions - Selector options
   * @param {Object} options - Additional options
   * @returns {Promise<void>}
   */
  async waitForHidden(selectorOptions, options = {}) {
    const {
      timeout = 30000,
    } = options;

    try {
      const locator = await this.selectorStrategy.findElement(selectorOptions);
      await locator.waitFor({ state: 'hidden', timeout });
    } catch (error) {
      // Element not found is acceptable for hidden state
      if (!error.message.includes('not found')) {
        throw error;
      }
    }
  }

  /**
   * Verify element exists and is visible
   * @param {Object} selectorOptions - Selector options
   * @param {Object} options - Additional options
   * @returns {Promise<boolean>}
   */
  async isVisible(selectorOptions, options = {}) {
    try {
      const locator = await this.selectorStrategy.findElement(selectorOptions);
      return await locator.isVisible({ timeout: options.timeout || 5000 });
    } catch (error) {
      return false;
    }
  }

  /**
   * Take screenshot of element
   * @param {Object} selectorOptions - Selector options
   * @param {string} path - Screenshot path
   * @returns {Promise<void>}
   */
  async screenshot(selectorOptions, path) {
    const locator = await this.selectorStrategy.findElementWithRetry(selectorOptions);
    await locator.screenshot({ path });
  }
}

module.exports = ElementHelpers;
