/**
 * Odoo-specific Helpers for Playwright
 * 
 * Provides utilities specific to Odoo application testing
 */

class OdooHelpers {
  constructor(page, elementHelpers) {
    this.page = page;
    this.elementHelpers = elementHelpers;
  }

  /**
   * Login to Odoo
   * @param {string} url - Odoo server URL
   * @param {string} username - Username
   * @param {string} password - Password
   * @param {Object} options - Additional options
   * @returns {Promise<void>}
   */
  async login(url, username, password, options = {}) {
    const {
      database = null,
      timeout = 30000,
    } = options;

    // Navigate to Odoo
    await this.page.goto(url, { waitUntil: 'networkidle', timeout });

    // Handle database selection if needed
    if (database) {
      try {
        await this.elementHelpers.fill(
          { css: 'input[name="db"]' },
          database,
          { timeout: 5000 }
        );
      } catch (error) {
        // Database field might not be present
        console.log('Database field not found, continuing...');
      }
    }

    // Fill username
    await this.elementHelpers.fill(
      { 
        css: 'input[name="login"]',
        placeholder: 'Email',
        name: 'login'
      },
      username,
      { timeout }
    );

    // Fill password
    await this.elementHelpers.fill(
      { 
        css: 'input[name="password"]',
        name: 'password'
      },
      password,
      { timeout }
    );

    // Click login button
    await this.elementHelpers.click(
      {
        role: 'button',
        text: 'Log in',
        css: 'button[type="submit"]',
      },
      { waitForNavigation: true, timeout }
    );

    // Wait for navigation to complete
    await this.page.waitForLoadState('networkidle', { timeout });
    
    // Verify login success (check for common Odoo elements)
    try {
      await this.page.waitForSelector('body', { timeout: 10000 });
      // Check if we're still on login page (login failed)
      const currentUrl = this.page.url();
      if (currentUrl.includes('/web/login')) {
        throw new Error('Login failed - still on login page');
      }
    } catch (error) {
      throw new Error(`Login verification failed: ${error.message}`);
    }
  }

  /**
   * Navigate to a specific Odoo menu
   * @param {string} menuPath - Menu path (e.g., "Sales > Orders")
   * @param {Object} options - Additional options
   * @returns {Promise<void>}
   */
  async navigateToMenu(menuPath, options = {}) {
    const { timeout = 30000 } = options;
    const menuItems = menuPath.split('>').map(item => item.trim());

    for (const menuItem of menuItems) {
      try {
        // Try to find menu item by text
        await this.elementHelpers.click(
          {
            text: menuItem,
            role: 'menuitem',
            css: `a:has-text("${menuItem}")`,
          },
          { timeout: 10000 }
        );
        
        // Wait for menu to expand or navigate
        await this.page.waitForTimeout(500);
      } catch (error) {
        throw new Error(`Failed to navigate to menu item "${menuItem}": ${error.message}`);
      }
    }

    // Wait for page to load
    await this.page.waitForLoadState('networkidle', { timeout });
  }

  /**
   * Wait for Odoo form to load
   * @param {Object} options - Additional options
   * @returns {Promise<void>}
   */
  async waitForFormLoad(options = {}) {
    const { timeout = 30000 } = options;
    
    // Wait for common Odoo form indicators
    await Promise.race([
      this.page.waitForSelector('.o_form_view', { timeout }),
      this.page.waitForSelector('form', { timeout }),
      this.page.waitForLoadState('networkidle', { timeout }),
    ]);
  }

  /**
   * Fill Odoo form field
   * @param {string} fieldName - Field name or label
   * @param {string} value - Value to fill
   * @param {Object} options - Additional options
   * @returns {Promise<void>}
   */
  async fillFormField(fieldName, value, options = {}) {
    // Try multiple strategies to find Odoo form fields
    const selectorOptions = {
      label: fieldName,
      css: `input[name="${fieldName}"], textarea[name="${fieldName}"]`,
      placeholder: fieldName,
    };

    await this.elementHelpers.fill(selectorOptions, value, options);
  }

  /**
   * Click Odoo button (Save, Create, etc.)
   * @param {string} buttonText - Button text
   * @param {Object} options - Additional options
   * @returns {Promise<void>}
   */
  async clickButton(buttonText, options = {}) {
    const selectorOptions = {
      role: 'button',
      text: buttonText,
      css: `button:has-text("${buttonText}"), a:has-text("${buttonText}")`,
    };

    await this.elementHelpers.click(selectorOptions, {
      waitForNavigation: true,
      ...options,
    });
  }

  /**
   * Wait for Odoo notification/toast
   * @param {string} expectedText - Expected notification text (optional)
   * @param {Object} options - Additional options
   * @returns {Promise<string>} Notification text
   */
  async waitForNotification(expectedText = null, options = {}) {
    const { timeout = 10000 } = options;
    
    try {
      // Wait for Odoo notification
      const notification = await this.page.waitForSelector(
        '.o_notification, .toast, .alert',
        { timeout, state: 'visible' }
      );
      
      const text = await notification.textContent();
      
      if (expectedText && !text.includes(expectedText)) {
        throw new Error(`Notification text mismatch. Expected: ${expectedText}, Got: ${text}`);
      }
      
      return text;
    } catch (error) {
      throw new Error(`Failed to find notification: ${error.message}`);
    }
  }
}

module.exports = OdooHelpers;
