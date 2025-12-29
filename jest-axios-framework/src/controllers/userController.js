const apiService = require('../services/apiService');
const BaseController = require('./baseController');

/**
 * User Controller
 * Controller for user operations
 * Adds validation, error handling and retry logic
 */
class UserController extends BaseController {
  /**
   * Отримати всіх користувачів з валідацією
   * @param {object} options - Опції запиту
   * @returns {Promise<object>} Валідована відповідь
   */
  /**
   * Get all users with validation
   * @param {object} options - Request options
   * @returns {Promise<AxiosResponse>} Validated response
   */
  async getAllUsers(options = {}) {
    return this.executeWithErrorHandling(async () => {
      const response = await apiService.getAllUsers();
      
      this.validateStatus(response.status);
      this.validateArrayResponse(response.data, 'users');
      this.logSuccess(`Retrieved ${response.data.length} users`);
      
      return response;
    }, 'getAllUsers');
  }

  /**
   * Отримати користувача по ID з валідацією
   * @param {number} id - ID користувача
   * @param {object} options - Опції запиту
   * @returns {Promise<object>} Валідована відповідь
   */
  /**
   * Get user by ID with validation
   * @param {number} id - User ID
   * @param {object} options - Request options
   * @returns {Promise<AxiosResponse>} Validated response
   */
  async getUserById(id, options = {}) {
    return this.executeWithErrorHandling(async () => {
      this.validateId(id, 'user');
      
      const response = await apiService.getUserById(id);
      
      this.validateStatus(response.status);
      this.validateResponseFields(response.data, ['id', 'name', 'email']);
      this.logSuccess(`Retrieved user with ID: ${id}`);
      
      return response;
    }, `getUserById(${id})`);
  }

  /**
   * Створити користувача з валідацією та перевіркою
   * @param {object} userData - Дані користувача
   * @param {object} options - Опції (verify: перевірити створення)
   * @returns {Promise<object>} Валідована відповідь
   */
  /**
   * Create user with validation and verification
   * @param {object} userData - User data
   * @param {object} options - Options (verify: verify creation)
   * @returns {Promise<AxiosResponse>} Validated response
   */
  async createUser(userData, options = {}) {
    return this.executeWithErrorHandling(async () => {
      this.validateRequiredFields(userData, ['name', 'email']);
      
      const response = await apiService.createUser(userData);
      
      this.validateStatus(response.status);
      
      if (options.verify && response.data.id) {
        await this.handleVerify(() => this.getUserById(response.data.id), true);
      }
      
      this.logSuccess(`Created user with ID: ${response.data.id}`);
      return response;
    }, 'createUser');
  }

  /**
   * Оновити користувача з валідацією
   * @param {number} id - ID користувача
   * @param {object} userData - Дані для оновлення
   * @param {object} options - Опції
   * @returns {Promise<object>} Валідована відповідь
   */
  /**
   * Update user with validation
   * @param {number} id - User ID
   * @param {object} userData - Data to update
   * @param {object} options - Options
   * @returns {Promise<AxiosResponse>} Validated response
   */
  async updateUser(id, userData, options = {}) {
    return this.executeWithErrorHandling(async () => {
      this.validateId(id, 'user');
      
      const response = await apiService.updateUser(id, userData);
      
      this.validateStatus(response.status);
      
      if (options.verify) {
        await this.handleUpdateVerify(() => this.getUserById(id), userData, true);
      }
      
      this.logSuccess(`Updated user with ID: ${id}`);
      return response;
    }, `updateUser(${id})`);
  }

  /**
   * Видалити користувача з перевіркою
   * @param {number} id - ID користувача
   * @param {object} options - Опції
   * @returns {Promise<object>} Валідована відповідь
   */
  /**
   * Delete user with verification
   * @param {number} id - User ID
   * @param {object} options - Options
   * @returns {Promise<AxiosResponse>} Validated response
   */
  async deleteUser(id, options = {}) {
    return this.executeWithErrorHandling(async () => {
      this.validateId(id, 'user');
      
      const response = await apiService.deleteUser(id);
      
      this.validateStatus(response.status);
      
      if (options.verify) {
        await this.handleDeleteVerify(() => this.getUserById(id), id, true);
      }
      
      this.logSuccess(`Deleted user with ID: ${id}`);
      return response;
    }, `deleteUser(${id})`);
  }

  /**
   * Complex operation: create and verify user
   * @param {object} userData - User data
   * @returns {Promise<object>} Operation result
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

