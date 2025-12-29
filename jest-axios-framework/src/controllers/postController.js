const apiService = require('../services/apiService');
const validators = require('../utils/validators');
const logger = require('../utils/logger');

/**
 * Post Controller
 * Контролер для роботи з постами
 * Додає валідацію, обробку помилок та комплексні операції
 */
class PostController {
  /**
   * Отримати всі пости з валідацією
   * @param {object} options - Опції запиту
   * @returns {Promise<object>} Валідована відповідь
   */
  async getAllPosts(options = {}) {
    try {
      const response = await apiService.getAllPosts();
      
      if (!validators.isSuccessStatus(response.status)) {
        throw new Error(`Unexpected status: ${response.status}`);
      }
      
      if (!Array.isArray(response.data)) {
        throw new Error('Expected array of posts');
      }
      
      logger.info(`Retrieved ${response.data.length} posts`);
      return response;
    } catch (error) {
      logger.error('Error getting all posts:', error);
      throw error;
    }
  }

  /**
   * Отримати пост по ID з валідацією
   * @param {number} id - ID поста
   * @returns {Promise<object>} Валідована відповідь
   */
  async getPostById(id) {
    try {
      if (!id || typeof id !== 'number') {
        throw new Error('Invalid post ID');
      }
      
      const response = await apiService.getPostById(id);
      
      if (!validators.isSuccessStatus(response.status)) {
        throw new Error(`Unexpected status: ${response.status}`);
      }
      
      if (!validators.hasRequiredFields(response.data, ['id', 'title', 'body', 'userId'])) {
        throw new Error('Post data missing required fields');
      }
      
      logger.info(`Retrieved post with ID: ${id}`);
      return response;
    } catch (error) {
      logger.error(`Error getting post ${id}:`, error);
      throw error;
    }
  }

  /**
   * Створити пост з валідацією
   * @param {object} postData - Дані поста
   * @param {object} options - Опції
   * @returns {Promise<object>} Валідована відповідь
   */
  async createPost(postData, options = {}) {
    try {
      const requiredFields = ['title', 'body', 'userId'];
      const isValid = validators.hasRequiredFields(postData, requiredFields);
      
      if (!isValid) {
        const missing = requiredFields.filter(field => !postData.hasOwnProperty(field));
        throw new Error(`Missing required fields: ${missing.join(', ')}`);
      }
      
      const response = await apiService.createPost(postData);
      
      if (!validators.isSuccessStatus(response.status)) {
        throw new Error(`Unexpected status: ${response.status}`);
      }
      
      if (options.verify && response.data.id) {
        const verifyResponse = await this.getPostById(response.data.id);
        logger.info('Post creation verified');
      }
      
      logger.info(`Created post with ID: ${response.data.id}`);
      return response;
    } catch (error) {
      logger.error('Error creating post:', error);
      throw error;
    }
  }

  /**
   * Оновити пост з валідацією
   * @param {number} id - ID поста
   * @param {object} postData - Дані для оновлення
   * @param {object} options - Опції
   * @returns {Promise<object>} Валідована відповідь
   */
  async updatePost(id, postData, options = {}) {
    try {
      if (!id || typeof id !== 'number') {
        throw new Error('Invalid post ID');
      }
      
      const response = await apiService.updatePost(id, postData);
      
      if (!validators.isSuccessStatus(response.status)) {
        throw new Error(`Unexpected status: ${response.status}`);
      }
      
      if (options.verify) {
        const verifyResponse = await this.getPostById(id);
        Object.keys(postData).forEach(key => {
          if (verifyResponse.data[key] !== postData[key]) {
            logger.warn(`Field ${key} may not have been updated`);
          }
        });
      }
      
      logger.info(`Updated post with ID: ${id}`);
      return response;
    } catch (error) {
      logger.error(`Error updating post ${id}:`, error);
      throw error;
    }
  }

  /**
   * Видалити пост з перевіркою
   * @param {number} id - ID поста
   * @param {object} options - Опції
   * @returns {Promise<object>} Валідована відповідь
   */
  async deletePost(id, options = {}) {
    try {
      if (!id || typeof id !== 'number') {
        throw new Error('Invalid post ID');
      }
      
      const response = await apiService.deletePost(id);
      
      if (!validators.isSuccessStatus(response.status)) {
        throw new Error(`Unexpected status: ${response.status}`);
      }
      
      if (options.verify) {
        try {
          await this.getPostById(id);
          logger.warn(`Post ${id} may still exist`);
        } catch (error) {
          if (error.response && error.response.status === 404) {
            logger.info(`Post ${id} successfully deleted`);
          }
        }
      }
      
      logger.info(`Deleted post with ID: ${id}`);
      return response;
    } catch (error) {
      logger.error(`Error deleting post ${id}:`, error);
      throw error;
    }
  }

  /**
   * Отримати пости користувача
   * @param {number} userId - ID користувача
   * @returns {Promise<Array>} Масив постів користувача
   */
  async getPostsByUserId(userId) {
    try {
      const response = await this.getAllPosts();
      const userPosts = response.data.filter(post => post.userId === userId);
      
      logger.info(`Retrieved ${userPosts.length} posts for user ${userId}`);
      return userPosts;
    } catch (error) {
      logger.error(`Error getting posts for user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Комплексна операція: створити та перевірити пост
   * @param {object} postData - Дані поста
   * @returns {Promise<object>} Результат операції
   */
  async createAndVerifyPost(postData) {
    const createResponse = await this.createPost(postData, { verify: true });
    const verifyResponse = await this.getPostById(createResponse.data.id);
    
    return {
      created: createResponse.data,
      verified: verifyResponse.data
    };
  }
}

// Експортуємо singleton instance
module.exports = new PostController();

