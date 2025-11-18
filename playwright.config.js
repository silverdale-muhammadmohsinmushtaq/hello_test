/**
 * Playwright Configuration for Odoo Testing
 * Optimized for stability and reliability
 */

const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  
  // Timeout settings
  timeout: 60000, // 60 seconds per test
  expect: {
    timeout: 10000, // 10 seconds for assertions
  },
  
  // Retry failed tests
  retries: process.env.CI ? 2 : 1,
  
  // Workers
  workers: process.env.CI ? 1 : 1, // Run tests serially for stability
  
  // Reporter
  reporter: [
    ['html'],
    ['list'],
    ['json', { outputFile: 'test-results.json' }]
  ],
  
  // Use headed mode by default for debugging
  use: {
    headless: false,
    viewport: { width: 1920, height: 1080 },
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
    
    // Slower navigation for stability
    navigationTimeout: 30000,
    actionTimeout: 10000,
    
    // Ignore HTTPS errors
    ignoreHTTPSErrors: true,
    
    // Slower operations for stability
    launchOptions: {
      slowMo: 100, // Add 100ms delay between actions
    },
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
