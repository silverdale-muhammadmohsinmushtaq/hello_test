/**
 * Playwright Configuration for Odoo Testing
 * 
 * Optimized for stability and reliability
 */

const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  
  // Timeout settings
  timeout: 60000, // Test timeout
  expect: {
    timeout: 10000, // Assertion timeout
  },
  
  // Retry settings
  retries: process.env.CI ? 2 : 1,
  
  // Workers
  workers: process.env.CI ? 1 : 1, // Run tests serially for stability
  
  // Reporter
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['list'],
  ],
  
  // Shared settings
  use: {
    // Browser settings
    headless: false, // Run in headed mode for debugging
    viewport: { width: 1920, height: 1080 },
    
    // Timeouts
    actionTimeout: 30000,
    navigationTimeout: 30000,
    
    // Screenshots and videos
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
    
    // Browser context options
    ignoreHTTPSErrors: true,
    
    // Slow down operations for stability
    launchOptions: {
      slowMo: 100, // Add 100ms delay between actions
    },
  },
  
  // Projects for different browsers
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // Uncomment to test on other browsers
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],
  
  // Web server (if needed for local testing)
  // webServer: {
  //   command: 'npm run start',
  //   port: 3000,
  // },
});
