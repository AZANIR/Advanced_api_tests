const axios = require('axios');
const config = require('../config/config');
const authConfig = require('../config/auth');
const logger = require('../utils/logger');

/**
 * Authentication Service
 * Handles automatic token refresh and login logic
 * Separated from httpClient to avoid circular dependencies
 */
class AuthService {
  /**
   * Perform automatic login to get a fresh token
   * @returns {Promise<string|null>} Token string or null if login failed
   */
  static async performAutoLogin() {
    try {
      logger.info('Attempting automatic login...');
      
      const credentials = authConfig.reqres.validCredentials;
      const loginResponse = await axios.post(
        `${config.reqresBaseURL}/login`,
        credentials,
        { timeout: authConfig.timeout }
      );
      
      if (loginResponse.data && loginResponse.data.token) {
        authConfig.tokenStorage.setToken('reqres', loginResponse.data.token);
        logger.info('Automatic login successful, token refreshed');
        return loginResponse.data.token;
      }
      
      return null;
    } catch (error) {
      logger.warn('Automatic login failed:', error.message);
      return null;
    }
  }

  /**
   * Check if URL is for ReqRes API
   * @param {string} url - URL to check
   * @returns {boolean} True if URL is for ReqRes API
   */
  static isReqResRequest(url) {
    if (!url) return false;
    return url.includes(config.reqresBaseURL) || url.includes('reqres.in');
  }
}

module.exports = AuthService;

