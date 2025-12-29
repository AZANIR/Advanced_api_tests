const apiService = require('../services/apiService');
const authConfig = require('../config/auth');
const validators = require('../utils/validators');
const logger = require('../utils/logger');

/**
 * Auth Controller
 * Контролер для аутентифікації та авторизації
 * Додає retry логіку, керування токенами та валідацію
 */
class AuthController {
  /**
   * Логін в ReqRes API з retry логікою
   * @param {object} credentials - Дані для логіну
   * @param {object} options - Опції (retry: кількість спроб)
   * @returns {Promise<object>} Відповідь з токеном
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
   * Реєстрація в ReqRes API
   * @param {object} userData - Дані користувача
   * @returns {Promise<object>} Відповідь
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
   * Отримати збережений токен
   * @param {string} key - Ключ токену
   * @returns {string|null} Токен або null
   */
  getToken(key = 'reqres') {
    return authConfig.tokenStorage.getToken(key);
  }

  /**
   * Очистити токен
   * @param {string} key - Ключ токену
   */
  clearToken(key = 'reqres') {
    authConfig.tokenStorage.clearToken(key);
    logger.info(`Token ${key} cleared`);
  }

  /**
   * Очистити всі токени
   */
  clearAllTokens() {
    authConfig.tokenStorage.clearAll();
    logger.info('All tokens cleared');
  }

  /**
   * Перевірити валідність токену
   * @param {string} key - Ключ токену
   * @returns {boolean} Чи валідний токен
   */
  isTokenValid(key = 'reqres') {
    const token = this.getToken(key);
    return token !== null;
  }

  /**
   * Логін з валідними credentials
   * @returns {Promise<object>} Відповідь
   */
  async loginWithValidCredentials() {
    return this.login(authConfig.reqres.validCredentials);
  }

  /**
   * Логін з невалідними credentials (для негативних тестів)
   * @returns {Promise<object>} Відповідь з помилкою
   */
  async loginWithInvalidCredentials() {
    try {
      return await this.login(authConfig.reqres.invalidCredentials);
    } catch (error) {
      // Очікувана помилка для негативних тестів
      return error;
    }
  }

  /**
   * Затримка (helper для retry)
   * @param {number} ms - Мілісекунди
   * @returns {Promise}
   */
  _delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Експортуємо singleton instance
module.exports = new AuthController();

