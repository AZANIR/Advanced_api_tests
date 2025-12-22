const httpClient = require('./httpClient');
const endpoints = require('../config/endpoints');

/**
 * API Service
 * Обгортка над HTTP клієнтом для роботи з API
 * Надає зручні методи для виконання HTTP запитів
 */
class ApiService {
  /**
   * GET запит - отримання даних
   * @param {string} url - URL для запиту
   * @param {object} params - Query параметри (опціонально)
   * @returns {Promise} - Promise з відповіддю
   */
  async get(url, params = {}) {
    try {
      const response = await httpClient.get(url, { params });
      return response;
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * POST запит - створення ресурсу
   * @param {string} url - URL для запиту
   * @param {object} data - Дані для відправки
   * @returns {Promise} - Promise з відповіддю
   */
  async post(url, data = {}) {
    try {
      const response = await httpClient.post(url, data);
      return response;
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * PUT запит - повне оновлення ресурсу
   * @param {string} url - URL для запиту
   * @param {object} data - Дані для оновлення
   * @returns {Promise} - Promise з відповіддю
   */
  async put(url, data = {}) {
    try {
      const response = await httpClient.put(url, data);
      return response;
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * PATCH запит - часткове оновлення ресурсу
   * @param {string} url - URL для запиту
   * @param {object} data - Дані для часткового оновлення
   * @returns {Promise} - Promise з відповіддю
   */
  async patch(url, data = {}) {
    try {
      const response = await httpClient.patch(url, data);
      return response;
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * DELETE запит - видалення ресурсу
   * @param {string} url - URL для запиту
   * @returns {Promise} - Promise з відповіддю
   */
  async delete(url) {
    try {
      const response = await httpClient.delete(url);
      return response;
    } catch (error) {
      throw error;
    }
  }
  
  // Методи для роботи з користувачами (JSONPlaceholder)
  async getAllUsers() {
    return this.get(endpoints.jsonplaceholder.users);
  }
  
  async getUserById(id) {
    return this.get(endpoints.jsonplaceholder.userById(id));
  }
  
  async createUser(userData) {
    return this.post(endpoints.jsonplaceholder.users, userData);
  }
  
  async updateUser(id, userData) {
    return this.put(endpoints.jsonplaceholder.userById(id), userData);
  }
  
  async deleteUser(id) {
    return this.delete(endpoints.jsonplaceholder.userById(id));
  }
  
  // Методи для роботи з постами (JSONPlaceholder)
  async getAllPosts() {
    return this.get(endpoints.jsonplaceholder.posts);
  }
  
  async getPostById(id) {
    return this.get(endpoints.jsonplaceholder.postById(id));
  }
  
  async createPost(postData) {
    return this.post(endpoints.jsonplaceholder.posts, postData);
  }
  
  async updatePost(id, postData) {
    return this.put(endpoints.jsonplaceholder.postById(id), postData);
  }
  
  async deletePost(id) {
    return this.delete(endpoints.jsonplaceholder.postById(id));
  }
  
  // Методи для ReqRes API
  async getReqResUsers() {
    return this.get(endpoints.reqres.users);
  }
  
  async getReqResUserById(id) {
    return this.get(endpoints.reqres.userById(id));
  }
  
  async reqResLogin(credentials) {
    return this.post(endpoints.reqres.login, credentials);
  }
  
  async reqResRegister(userData) {
    return this.post(endpoints.reqres.register, userData);
  }
  
  // Методи для Petstore Swagger API
  async getPetById(id) {
    return this.get(endpoints.petstore.petById(id));
  }
  
  async createPet(petData) {
    return this.post(endpoints.petstore.pets, petData);
  }
  
  async updatePet(petData) {
    return this.put(endpoints.petstore.pets, petData);
  }
  
  async deletePet(id) {
    return this.delete(endpoints.petstore.petById(id));
  }
  
  async getPetsByStatus(status) {
    return this.get(endpoints.petstore.petsByStatus(status));
  }
  
  async getPetstoreUserByUsername(username) {
    return this.get(endpoints.petstore.userByUsername(username));
  }
  
  async createPetstoreUser(userData) {
    return this.post(endpoints.petstore.users, userData);
  }
  
  async getStoreInventory() {
    return this.get(endpoints.petstore.inventory);
  }
  
  async createOrder(orderData) {
    return this.post(endpoints.petstore.orders, orderData);
  }
  
  async getOrderById(id) {
    return this.get(endpoints.petstore.orderById(id));
  }
  
  async deleteOrder(id) {
    return this.delete(endpoints.petstore.orderById(id));
  }
}

// Експортуємо singleton instance
module.exports = new ApiService();

