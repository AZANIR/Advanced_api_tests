const apiService = require('../services/apiService');
const validators = require('../utils/validators');
const logger = require('../utils/logger');

/**
 * User Controller
 * Контролер для роботи з користувачами
 * Додає валідацію, обробку помилок та retry логіку
 */
class UserController {
  /**
   * Отримати всіх користувачів з валідацією
   * @param {object} options - Опції запиту
   * @returns {Promise<object>} Валідована відповідь
   */
  async getAllUsers(options = {}) {
    try {
      const response = await apiService.getAllUsers();
      
      // Валідація відповіді
      if (!validators.isSuccessStatus(response.status)) {
        throw new Error(`Unexpected status: ${response.status}`);
      }
      
      if (!Array.isArray(response.data)) {
        throw new Error('Expected array of users');
      }
      
      logger.info(`Retrieved ${response.data.length} users`);
      return response;
    } catch (error) {
      logger.error('Error getting all users:', error);
      throw error;
    }
  }

  /**
   * Отримати користувача по ID з валідацією
   * @param {number} id - ID користувача
   * @param {object} options - Опції запиту
   * @returns {Promise<object>} Валідована відповідь
   */
  async getUserById(id, options = {}) {
    try {
      // Валідація входу
      if (!id || typeof id !== 'number') {
        throw new Error('Invalid user ID');
      }
      
      const response = await apiService.getUserById(id);
      
      // Валідація відповіді
      if (!validators.isSuccessStatus(response.status)) {
        throw new Error(`Unexpected status: ${response.status}`);
      }
      
      if (!validators.hasRequiredFields(response.data, ['id', 'name', 'email'])) {
        throw new Error('User data missing required fields');
      }
      
      logger.info(`Retrieved user with ID: ${id}`);
      return response;
    } catch (error) {
      logger.error(`Error getting user ${id}:`, error);
      throw error;
    }
  }

  /**
   * Створити користувача з валідацією та перевіркою
   * @param {object} userData - Дані користувача
   * @param {object} options - Опції (verify: перевірити створення)
   * @returns {Promise<object>} Валідована відповідь
   */
  async createUser(userData, options = {}) {
    try {
      // Валідація входу
      const requiredFields = ['name', 'email'];
      const isValid = validators.hasRequiredFields(userData, requiredFields);
      
      if (!isValid) {
        const missing = requiredFields.filter(field => !userData.hasOwnProperty(field));
        throw new Error(`Missing required fields: ${missing.join(', ')}`);
      }
      
      // Створення користувача
      const response = await apiService.createUser(userData);
      
      // Валідація відповіді
      if (!validators.isSuccessStatus(response.status)) {
        throw new Error(`Unexpected status: ${response.status}`);
      }
      
      // Перевірка створення (якщо потрібно)
      if (options.verify && response.data.id) {
        const verifyResponse = await this.getUserById(response.data.id);
        logger.info('User creation verified');
      }
      
      logger.info(`Created user with ID: ${response.data.id}`);
      return response;
    } catch (error) {
      logger.error('Error creating user:', error);
      throw error;
    }
  }

  /**
   * Оновити користувача з валідацією
   * @param {number} id - ID користувача
   * @param {object} userData - Дані для оновлення
   * @param {object} options - Опції
   * @returns {Promise<object>} Валідована відповідь
   */
  async updateUser(id, userData, options = {}) {
    try {
      // Валідація входу
      if (!id || typeof id !== 'number') {
        throw new Error('Invalid user ID');
      }
      
      // Оновлення користувача
      const response = await apiService.updateUser(id, userData);
      
      // Валідація відповіді
      if (!validators.isSuccessStatus(response.status)) {
        throw new Error(`Unexpected status: ${response.status}`);
      }
      
      // Перевірка оновлення (якщо потрібно)
      if (options.verify) {
        const verifyResponse = await this.getUserById(id);
        // Перевірка, що дані оновилися
        Object.keys(userData).forEach(key => {
          if (verifyResponse.data[key] !== userData[key]) {
            logger.warn(`Field ${key} may not have been updated`);
          }
        });
      }
      
      logger.info(`Updated user with ID: ${id}`);
      return response;
    } catch (error) {
      logger.error(`Error updating user ${id}:`, error);
      throw error;
    }
  }

  /**
   * Видалити користувача з перевіркою
   * @param {number} id - ID користувача
   * @param {object} options - Опції
   * @returns {Promise<object>} Валідована відповідь
   */
  async deleteUser(id, options = {}) {
    try {
      // Валідація входу
      if (!id || typeof id !== 'number') {
        throw new Error('Invalid user ID');
      }
      
      // Видалення користувача
      const response = await apiService.deleteUser(id);
      
      // Валідація відповіді
      if (!validators.isSuccessStatus(response.status)) {
        throw new Error(`Unexpected status: ${response.status}`);
      }
      
      // Перевірка видалення (якщо потрібно)
      if (options.verify) {
        try {
          await this.getUserById(id);
          logger.warn(`User ${id} may still exist`);
        } catch (error) {
          if (error.response && error.response.status === 404) {
            logger.info(`User ${id} successfully deleted`);
          }
        }
      }
      
      logger.info(`Deleted user with ID: ${id}`);
      return response;
    } catch (error) {
      logger.error(`Error deleting user ${id}:`, error);
      throw error;
    }
  }

  /**
   * Комплексна операція: створити та перевірити користувача
   * @param {object} userData - Дані користувача
   * @returns {Promise<object>} Результат операції
   */
  async createAndVerifyUser(userData) {
    const createResponse = await this.createUser(userData, { verify: true });
    const verifyResponse = await this.getUserById(createResponse.data.id);
    
    return {
      created: createResponse.data,
      verified: verifyResponse.data
    };
  }
}

// Експортуємо singleton instance
module.exports = new UserController();

