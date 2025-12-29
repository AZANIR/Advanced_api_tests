const authController = require('../../src/controllers/authController');

/**
 * Test Helpers
 * Common utility functions for tests
 */

/**
 * Setup test environment
 * Clears tokens and prepares clean state
 */
function setupTestEnvironment() {
  authController.clearAllTokens();
}

/**
 * Cleanup test environment
 * Cleans up after tests
 */
function cleanupTestEnvironment() {
  authController.clearAllTokens();
}

/**
 * Wait for specified time (useful for rate limiting)
 * @param {number} ms - Milliseconds to wait
 * @returns {Promise<void>}
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Ensure token exists, login if needed
 * @returns {Promise<string>} Token string
 */
async function ensureToken() {
  let token = authController.getToken('reqres');
  if (!token) {
    await authController.loginWithValidCredentials();
    await delay(300);
    token = authController.getToken('reqres');
  }
  return token;
}

/**
 * Create test timeout wrapper
 * @param {Function} testFn - Test function
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Function} Wrapped test function
 */
function withTimeout(testFn, timeout = 10000) {
  return async (...args) => {
    return Promise.race([
      testFn(...args),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error(`Test timed out after ${timeout}ms`)), timeout)
      )
    ]);
  };
}

module.exports = {
  setupTestEnvironment,
  cleanupTestEnvironment,
  delay,
  ensureToken,
  withTimeout
};

