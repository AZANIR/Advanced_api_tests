const apiService = require('../services/apiService');
const authConfig = require('../config/auth');
const validators = require('../utils/validators');
const logger = require('../utils/logger');

/**
 * Auth Controller
 * Controller for authentication and authorization
 * Adds retry logic, token management and validation
 */
class AuthController {
  /**
   * Login to ReqRes API with retry logic
   * @param {object} credentials - Login credentials
   * @param {object} options - Options (retry: number of attempts)
   * @returns {Promise<AxiosResponse>} Response with token
   */
  async login(credentials = null, options = {}) {
    const creds = credentials || authConfig.reqres.validCredentials;
    const maxRetries = options.retry || authConfig.retryAttempts;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        logger.info(`Login attempt ${attempt}/${maxRetries}`);
        
        const response = await apiService.reqResLogin(creds);
        
        if (!validators.isSuccessStatus(response.status)) {
          throw new Error(`Login failed with status: ${response.status}`);
        }
        
        // Збереження токену (якщо є)
        if (response.data.token) {
          authConfig.tokenStorage.setToken('reqres', response.data.token);
          logger.info('Token stored successfully');
        }
        
        logger.info('Login successful');
        return response;
      } catch (error) {
        logger.warn(`Login attempt ${attempt} failed:`, error.message);
        
        if (attempt === maxRetries) {
          logger.error('All login attempts failed');
          throw error;
        }
        
        // Затримка перед наступною спробою
        await this._delay(authConfig.retryDelay * attempt);
      }
    }
  }

  /**
   * Register in ReqRes API
   * @param {object} userData - User data
   * @returns {Promise<AxiosResponse>} Response
   */
  async register(userData) {
    try {
      // Валідація входу
      const requiredFields = ['email', 'password'];
      const isValid = validators.hasRequiredFields(userData, requiredFields);
      
      if (!isValid) {
        const missing = requiredFields.filter(field => !userData.hasOwnProperty(field));
        throw new Error(`Missing required fields: ${missing.join(', ')}`);
      }
      
      const response = await apiService.reqResRegister(userData);
      
      if (!validators.isSuccessStatus(response.status)) {
        throw new Error(`Registration failed with status: ${response.status}`);
      }
      
      // Збереження токену (якщо є)
      if (response.data.token) {
        authConfig.tokenStorage.setToken('reqres', response.data.token);
      }
      
      logger.info('Registration successful');
      return response;
    } catch (error) {
      logger.error('Error during registration:', error);
      throw error;
    }
  }

  /**
   * Get stored token
   * @param {string} key - Token key
   * @returns {string|null} Token or null
   */
  getToken(key = 'reqres') {
    return authConfig.tokenStorage.getToken(key);
  }

  /**
   * Clear token
   * @param {string} key - Token key
   */
  clearToken(key = 'reqres') {
    authConfig.tokenStorage.clearToken(key);
    logger.info(`Token ${key} cleared`);
  }

  /**
   * Clear all tokens
   */
  clearAllTokens() {
    authConfig.tokenStorage.clearAll();
    logger.info('All tokens cleared');
  }

  /**
   * Check if token is valid
   * @param {string} key - Token key
   * @returns {boolean} Whether token is valid
   */
  isTokenValid(key = 'reqres') {
    const token = this.getToken(key);
    return token !== null;
  }

  /**
   * Login with valid credentials
   * @returns {Promise<AxiosResponse>} Response
   */
  async loginWithValidCredentials() {
    return this.login(authConfig.reqres.validCredentials);
  }

  /**
   * Login with invalid credentials (for negative tests)
   * @returns {Promise<AxiosResponse|Error>} Response or error
   */
  async loginWithInvalidCredentials() {
    try {
      return await this.login(authConfig.reqres.invalidCredentials);
    } catch (error) {
      // Expected error for negative tests
      return error;
    }
  }

  /**
   * Delay helper for retry logic
   * @param {number} ms - Milliseconds
   * @returns {Promise<void>}
   * @private
   */
  _delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Експортуємо singleton instance
module.exports = new AuthController();

