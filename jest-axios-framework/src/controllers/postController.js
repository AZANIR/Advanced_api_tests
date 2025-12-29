const apiService = require('../services/apiService');
const BaseController = require('./baseController');

/**
 * Post Controller
 * Controller for post operations
 * Adds validation, error handling and complex operations
 */
class PostController extends BaseController {
  /**
   * Get all posts with validation
   * @param {object} options - Request options
   * @returns {Promise<AxiosResponse>} Validated response
   */
  async getAllPosts(options = {}) {
    return this.executeWithErrorHandling(async () => {
      const response = await apiService.getAllPosts();
      
      this.validateStatus(response.status);
      this.validateArrayResponse(response.data, 'posts');
      this.logSuccess(`Retrieved ${response.data.length} posts`);
      
      return response;
    }, 'getAllPosts');
  }

  /**
   * Get post by ID with validation
   * @param {number} id - Post ID
   * @returns {Promise<AxiosResponse>} Validated response
   */
  async getPostById(id) {
    return this.executeWithErrorHandling(async () => {
      this.validateId(id, 'post');
      
      const response = await apiService.getPostById(id);
      
      this.validateStatus(response.status);
      this.validateResponseFields(response.data, ['id', 'title', 'body', 'userId']);
      this.logSuccess(`Retrieved post with ID: ${id}`);
      
      return response;
    }, `getPostById(${id})`);
  }

  /**
   * Create post with validation
   * @param {object} postData - Post data
   * @param {object} options - Options
   * @returns {Promise<AxiosResponse>} Validated response
   */
  async createPost(postData, options = {}) {
    return this.executeWithErrorHandling(async () => {
      this.validateRequiredFields(postData, ['title', 'body', 'userId']);
      
      const response = await apiService.createPost(postData);
      
      this.validateStatus(response.status);
      
      if (options.verify && response.data.id) {
        await this.handleVerify(() => this.getPostById(response.data.id), true);
      }
      
      this.logSuccess(`Created post with ID: ${response.data.id}`);
      return response;
    }, 'createPost');
  }

  /**
   * Update post with validation
   * @param {number} id - Post ID
   * @param {object} postData - Data to update
   * @param {object} options - Options
   * @returns {Promise<AxiosResponse>} Validated response
   */
  async updatePost(id, postData, options = {}) {
    return this.executeWithErrorHandling(async () => {
      this.validateId(id, 'post');
      
      const response = await apiService.updatePost(id, postData);
      
      this.validateStatus(response.status);
      
      if (options.verify) {
        await this.handleUpdateVerify(() => this.getPostById(id), postData, true);
      }
      
      this.logSuccess(`Updated post with ID: ${id}`);
      return response;
    }, `updatePost(${id})`);
  }


  /**
   * Delete post with verification
   * @param {number} id - Post ID
   * @param {object} options - Options
   * @returns {Promise<AxiosResponse>} Validated response
   */
  async deletePost(id, options = {}) {
    return this.executeWithErrorHandling(async () => {
      this.validateId(id, 'post');
      
      const response = await apiService.deletePost(id);
      
      this.validateStatus(response.status);
      
      if (options.verify) {
        await this.handleDeleteVerify(() => this.getPostById(id), id, true);
      }
      
      this.logSuccess(`Deleted post with ID: ${id}`);
      return response;
    }, `deletePost(${id})`);
  }

  /**
   * Get posts by user ID
   * @param {number} userId - User ID
   * @returns {Promise<Array>} Array of user posts
   */
  async getPostsByUserId(userId) {
    return this.executeWithErrorHandling(async () => {
      const response = await this.getAllPosts();
      const userPosts = response.data.filter(post => post.userId === userId);
      
      this.logSuccess(`Retrieved ${userPosts.length} posts for user ${userId}`);
      return userPosts;
    }, `getPostsByUserId(${userId})`);
  }

  /**
   * Complex operation: create and verify post
   * @param {object} postData - Post data
   * @returns {Promise<object>} Operation result
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

