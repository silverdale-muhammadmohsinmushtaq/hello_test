/**
 * Playwright Helper Utilities for Stable Odoo Testing
 * 
 * This module provides robust element finding strategies with multiple fallbacks
 * to ensure scripts remain stable even when selectors change.
 */

const { expect } = require('@playwright/test');

/**
 * Robust element finder with multiple selector strategies
 * Tries multiple selectors in order of reliability
 */
class StableElementFinder {
  constructor(page) {
    this.page = page;
  }

  /**
   * Find element using multiple selector strategies
   * @param {Object} selectors - Object with multiple selector strategies
   * @param {Object} options - Additional options
   * @returns {Promise<Locator>} - Found element locator
   */
  async findElement(selectors, options = {}) {
    const {
      timeout = 10000,
      visible = true,
      retries = 3,
      description = 'element'
    } = options;

    // Priority order: data-testid > role > text > css > xpath
    const selectorStrategies = [
      selectors.testId && `[data-testid="${selectors.testId}"]`,
      selectors.role && selectors.text 
        ? this.page.getByRole(selectors.role, { name: selectors.text })
        : selectors.role 
        ? this.page.getByRole(selectors.role)
        : null,
      selectors.text && this.page.getByText(selectors.text, { exact: false }),
      selectors.label && this.page.getByLabel(selectors.label),
      selectors.placeholder && this.page.getByPlaceholder(selectors.placeholder),
      selectors.css,
      selectors.xpath && this.page.locator(selectors.xpath),
    ].filter(Boolean);

    if (selectorStrategies.length === 0) {
      throw new Error(`No selector strategies provided for ${description}`);
    }

    let lastError;
    for (let attempt = 0; attempt < retries; attempt++) {
      for (const selector of selectorStrategies) {
        try {
          const locator = typeof selector === 'string' 
            ? this.page.locator(selector)
            : selector;

          if (visible) {
            await locator.first().waitFor({ state: 'visible', timeout });
          } else {
            await locator.first().waitFor({ state: 'attached', timeout });
          }

          // Verify element is actually visible/interactable
          const isVisible = await locator.first().isVisible();
          if (visible && !isVisible) {
            continue; // Try next selector
          }

          return locator.first();
        } catch (error) {
          lastError = error;
          continue; // Try next selector
        }
      }
      
      // Wait before retry
      if (attempt < retries - 1) {
        await this.page.waitForTimeout(1000);
      }
    }

    throw new Error(
      `Failed to find ${description} after ${retries} attempts. ` +
      `Last error: ${lastError?.message || 'Unknown error'}`
    );
  }

  /**
   * Click element with retry logic
   */
  async clickElement(selectors, options = {}) {
    const element = await this.findElement(selectors, options);
    await element.scrollIntoViewIfNeeded();
    await element.click({ timeout: options.timeout || 5000 });
    return element;
  }

  /**
   * Fill input with retry logic
   */
  async fillInput(selectors, value, options = {}) {
    const element = await this.findElement(selectors, options);
    await element.scrollIntoViewIfNeeded();
    await element.clear();
    await element.fill(value, { timeout: options.timeout || 5000 });
    return element;
  }

  /**
   * Select dropdown option with retry logic
   */
  async selectOption(selectors, value, options = {}) {
    const element = await this.findElement(selectors, options);
    await element.scrollIntoViewIfNeeded();
    
    // Try select by value first, then by label
    try {
      await element.selectOption({ value }, { timeout: 5000 });
    } catch {
      await element.selectOption({ label: value }, { timeout: 5000 });
    }
    
    return element;
  }

  /**
   * Wait for element to be visible and stable
   */
  async waitForStable(selectors, options = {}) {
    const { timeout = 10000, stableTime = 500 } = options;
    const element = await this.findElement(selectors, { ...options, timeout });
    
    // Wait for element to be stable (not moving/changing)
    await this.page.waitForTimeout(stableTime);
    
    return element;
  }

  /**
   * Get element text with retry
   */
  async getText(selectors, options = {}) {
    const element = await this.findElement(selectors, options);
    await element.scrollIntoViewIfNeeded();
    return await element.textContent();
  }

  /**
   * Check if element exists (non-throwing)
   */
  async elementExists(selectors, options = {}) {
    try {
      await this.findElement(selectors, { ...options, timeout: 2000 });
      return true;
    } catch {
      return false;
    }
  }
}

/**
 * Odoo-specific helper functions
 */
class OdooHelpers {
  constructor(page) {
    this.page = page;
    this.finder = new StableElementFinder(page);
  }

  /**
   * Login to Odoo
   */
  async login(username, password, serverUrl) {
    await this.page.goto(serverUrl);
    
    // Wait for login form with multiple selector strategies
    await this.finder.fillInput(
      {
        testId: 'login',
        placeholder: 'Email',
        label: 'Email',
        css: 'input[name="login"]'
      },
      username,
      { description: 'login input' }
    );

    await this.finder.fillInput(
      {
        testId: 'password',
        placeholder: 'Password',
        label: 'Password',
        css: 'input[name="password"]'
      },
      password,
      { description: 'password input' }
    );

    await this.finder.clickElement(
      {
        testId: 'login-submit',
        role: 'button',
        text: 'Log in',
        css: 'button[type="submit"]'
      },
      { description: 'login button' }
    );

    // Wait for successful login (dashboard or app menu)
    await this.page.waitForURL(/\/web/, { timeout: 15000 });
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Navigate to a menu item
   */
  async navigateToMenu(menuPath, options = {}) {
    const { timeout = 10000 } = options;
    
    // Click app menu if needed
    const appMenuVisible = await this.finder.elementExists(
      { css: '.o_main_navbar .o_menu_toggle' },
      { timeout: 2000 }
    );
    
    if (appMenuVisible) {
      await this.finder.clickElement(
        { css: '.o_main_navbar .o_menu_toggle' },
        { description: 'app menu toggle' }
      );
      await this.page.waitForTimeout(500);
    }

    // Navigate through menu path
    const menuItems = Array.isArray(menuPath) ? menuPath : menuPath.split(' > ');
    
    for (let i = 0; i < menuItems.length; i++) {
      const menuText = menuItems[i].trim();
      
      await this.finder.clickElement(
        {
          role: 'menuitem',
          text: menuText,
          css: `a:has-text("${menuText}")`
        },
        { 
          description: `menu item: ${menuText}`,
          timeout 
        }
      );
      
      // Wait for menu to load
      await this.page.waitForTimeout(1000);
      await this.page.waitForLoadState('networkidle');
    }
  }

  /**
   * Wait for Odoo form to be ready
   */
  async waitForFormReady() {
    // Wait for form to be loaded
    await this.page.waitForLoadState('networkidle');
    
    // Wait for any loading indicators to disappear
    await this.page.waitForSelector('.o_loading', { state: 'hidden', timeout: 10000 }).catch(() => {});
    
    // Wait for form to be interactive
    await this.page.waitForTimeout(500);
  }

  /**
   * Fill Odoo form field
   */
  async fillFormField(fieldName, value, options = {}) {
    await this.waitForFormReady();
    
    // Try multiple strategies for Odoo fields
    const selectors = {
      testId: `field_${fieldName}`,
      css: `input[name="${fieldName}"], textarea[name="${fieldName}"], .o_field_widget[name="${fieldName}"] input`,
      label: fieldName,
      xpath: `//label[contains(text(), "${fieldName}")]/following-sibling::*//input | //label[contains(text(), "${fieldName}")]/following-sibling::*//textarea`
    };

    const field = await this.finder.findElement(selectors, {
      description: `form field: ${fieldName}`,
      ...options
    });

    await field.scrollIntoViewIfNeeded();
    
    // Check if it's a many2one field (needs special handling)
    const isMany2One = await field.evaluate((el) => {
      return el.closest('.o_field_many2one') !== null;
    });

    if (isMany2One) {
      // Clear and type for many2one fields
      await field.click();
      await field.fill('');
      await field.type(value, { delay: 100 });
      await this.page.waitForTimeout(500);
      // Select from dropdown if appears
      const dropdownOption = await this.finder.elementExists(
        { css: `.ui-autocomplete .ui-menu-item:has-text("${value}")` },
        { timeout: 3000 }
      );
      if (dropdownOption) {
        await this.finder.clickElement(
          { css: `.ui-autocomplete .ui-menu-item:has-text("${value}")` },
          { description: `dropdown option: ${value}` }
        );
      }
    } else {
      await field.clear();
      await field.fill(value);
    }

    return field;
  }

  /**
   * Click Odoo button
   */
  async clickButton(buttonText, options = {}) {
    await this.waitForFormReady();
    
    const selectors = {
      role: 'button',
      text: buttonText,
      css: `button:has-text("${buttonText}"), a:has-text("${buttonText}")`,
      testId: `button_${buttonText.replace(/\s+/g, '_')}`
    };

    return await this.finder.clickElement(selectors, {
      description: `button: ${buttonText}`,
      ...options
    });
  }

  /**
   * Save form
   */
  async saveForm() {
    await this.clickButton('Save', { timeout: 5000 });
    await this.waitForFormReady();
  }

  /**
   * Create new record
   */
  async createNew() {
    await this.clickButton('Create', { timeout: 5000 });
    await this.waitForFormReady();
  }
}

module.exports = {
  StableElementFinder,
  OdooHelpers
};
